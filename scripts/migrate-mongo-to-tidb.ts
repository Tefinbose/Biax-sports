import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrate() {
  console.log("=== Starting MongoDB -> TiDB Migration ===");

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in environment.");
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected.");

  // 1. MIGRATE ADMINS
  console.log("\n--- Migrating Admins ---");
  const admins = await mongoose.connection.collection("admins").find().toArray();
  for (const admin of admins) {
    const id = admin._id.toString();
    await prisma.admin.upsert({
      where: { email: admin.email },
      update: {
        name: admin.name,
        passwordHash: admin.passwordHash,
        role: admin.role || "admin",
        active: admin.active ?? true,
      },
      create: {
        id,
        name: admin.name,
        email: admin.email,
        passwordHash: admin.passwordHash,
        role: admin.role || "admin",
        active: admin.active ?? true,
        createdAt: admin.createdAt ? new Date(admin.createdAt) : new Date(),
        updatedAt: admin.updatedAt ? new Date(admin.updatedAt) : new Date(),
      },
    });
    console.log(`Migrated admin: ${admin.email} (id: ${id})`);
  }

  // 2. MIGRATE STORE SETTINGS
  console.log("\n--- Migrating Store Settings ---");
  const settingsList = await mongoose.connection
    .collection("storesettings")
    .find()
    .toArray();

  if (settingsList.length > 0) {
    const s = settingsList[0];
    const existing = await prisma.storeSettings.findFirst();
    if (existing) {
      await prisma.storeSettings.update({
        where: { id: existing.id },
        data: {
          storeName: s.storeName || "BIAX SPORTS",
          tagline: s.tagline || "",
          contactEmail: s.contactEmail || "info@biaxsports.com",
          phone: s.phone || "",
          address: s.address || "",
          shippingCharge: Number(s.shippingCharge) || 0,
          freeShippingThreshold: Number(s.freeShippingThreshold) || 0,
          codEnabled: s.codEnabled ?? true,
        },
      });
    } else {
      await prisma.storeSettings.create({
        data: {
          id: s._id.toString(),
          storeName: s.storeName || "BIAX SPORTS",
          tagline: s.tagline || "",
          contactEmail: s.contactEmail || "info@biaxsports.com",
          phone: s.phone || "",
          address: s.address || "",
          shippingCharge: Number(s.shippingCharge) || 0,
          freeShippingThreshold: Number(s.freeShippingThreshold) || 0,
          codEnabled: s.codEnabled ?? true,
        },
      });
    }
    console.log("Store settings migrated.");
  }

  // 3. MIGRATE COUPONS
  console.log("\n--- Migrating Coupons ---");
  const coupons = await mongoose.connection
    .collection("coupons")
    .find()
    .toArray();
  for (const c of coupons) {
    const id = c._id.toString();
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {
        description: c.description || "",
        discountType: c.discountType || "percentage",
        discountValue: Number(c.discountValue),
        minOrderValue: Number(c.minOrderValue) || 0,
        maxDiscountAmount:
          c.maxDiscountAmount != null ? Number(c.maxDiscountAmount) : null,
        usageLimit: c.usageLimit != null ? Number(c.usageLimit) : null,
        usedCount: Number(c.usedCount) || 0,
        startDate: c.startDate ? new Date(c.startDate) : null,
        endDate: c.endDate ? new Date(c.endDate) : null,
        active: c.active ?? true,
      },
      create: {
        id,
        code: c.code,
        description: c.description || "",
        discountType: c.discountType || "percentage",
        discountValue: Number(c.discountValue),
        minOrderValue: Number(c.minOrderValue) || 0,
        maxDiscountAmount:
          c.maxDiscountAmount != null ? Number(c.maxDiscountAmount) : null,
        usageLimit: c.usageLimit != null ? Number(c.usageLimit) : null,
        usedCount: Number(c.usedCount) || 0,
        startDate: c.startDate ? new Date(c.startDate) : null,
        endDate: c.endDate ? new Date(c.endDate) : null,
        active: c.active ?? true,
        createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
        updatedAt: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      },
    });
    console.log(`Migrated coupon: ${c.code}`);
  }

  // 4. MIGRATE PRODUCT IMAGES (FROM MONGODB AND PUBLIC/UPLOADS/PRODUCTS)
  console.log("\n--- Migrating Images to TiDB ---");
  // 4a. MongoDB ProductImage collection
  const mongoImages = await mongoose.connection
    .collection("productimages")
    .find()
    .toArray();
  for (const img of mongoImages) {
    const id = img._id.toString();
    const existing = await prisma.productImage.findUnique({ where: { id } });
    if (!existing && img.data) {
      const buffer = img.data.buffer
        ? Buffer.from(img.data.buffer)
        : Buffer.from(img.data);
      await prisma.productImage.create({
        data: {
          id,
          filename: img.filename || "image.jpg",
          contentType: img.contentType || "image/jpeg",
          data: buffer,
          size: buffer.length,
          createdAt: img.createdAt ? new Date(img.createdAt) : new Date(),
        },
      });
      console.log(`Migrated MongoDB ProductImage doc: ${img.filename} (${id})`);
    }
  }

  // 4b. Local public/uploads/products/ files
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "products");
  try {
    const files = await fs.readdir(uploadsDir);
    for (const filename of files) {
      const filePath = path.join(uploadsDir, filename);
      const stat = await fs.stat(filePath);
      if (stat.isFile()) {
        const fileBuffer = await fs.readFile(filePath);
        const ext = path.extname(filename).toLowerCase().replace(".", "");
        const contentType =
          ext === "png"
            ? "image/png"
            : ext === "webp"
            ? "image/webp"
            : ext === "svg"
            ? "image/svg+xml"
            : "image/jpeg";

        // Generate or use deterministic ID for filename
        // E.g. filename itself or check if already in TiDB
        const existingByFilename = await prisma.productImage.findFirst({
          where: { filename },
        });

        if (!existingByFilename) {
          const newDoc = await prisma.productImage.create({
            data: {
              filename,
              contentType,
              data: fileBuffer,
              size: fileBuffer.length,
            },
          });
          console.log(`Uploaded local file to TiDB: ${filename} (id: ${newDoc.id})`);
        } else {
          console.log(`Local file already in TiDB: ${filename}`);
        }
      }
    }
  } catch (err) {
    console.warn("Could not read public/uploads/products directory:", err);
  }

  // 5. MIGRATE PRODUCTS
  console.log("\n--- Migrating Products ---");
  const products = await mongoose.connection
    .collection("products")
    .find()
    .toArray();
  for (const p of products) {
    const id = p._id.toString();
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description || "",
        shortDescription: p.shortDescription || "",
        category: p.category,
        price: Number(p.price),
        compareAtPrice:
          p.compareAtPrice != null ? Number(p.compareAtPrice) : null,
        images: Array.isArray(p.images) ? p.images : [],
        sizes: Array.isArray(p.sizes) ? p.sizes : [],
        colors: Array.isArray(p.colors) ? p.colors : [],
        stock: Number(p.stock) || 0,
        sku: p.sku,
        featured: Boolean(p.featured),
        published: Boolean(p.published),
        isComingSoon: Boolean(p.isComingSoon),
      },
      create: {
        id,
        name: p.name,
        slug: p.slug,
        description: p.description || "",
        shortDescription: p.shortDescription || "",
        category: p.category,
        price: Number(p.price),
        compareAtPrice:
          p.compareAtPrice != null ? Number(p.compareAtPrice) : null,
        images: Array.isArray(p.images) ? p.images : [],
        sizes: Array.isArray(p.sizes) ? p.sizes : [],
        colors: Array.isArray(p.colors) ? p.colors : [],
        stock: Number(p.stock) || 0,
        sku: p.sku,
        featured: Boolean(p.featured),
        published: Boolean(p.published),
        isComingSoon: Boolean(p.isComingSoon),
        createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
        updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      },
    });
    console.log(`Migrated product: "${p.name}" (slug: ${p.slug})`);
  }

  // 6. MIGRATE ORDERS & ORDER ITEMS
  console.log("\n--- Migrating Orders ---");
  const orders = await mongoose.connection.collection("orders").find().toArray();
  for (const o of orders) {
    const id = o._id.toString();
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber: o.orderNumber },
    });

    if (!existingOrder) {
      await prisma.order.create({
        data: {
          id,
          orderNumber: o.orderNumber,
          customerName: o.customer?.name || "Customer",
          customerEmail: o.customer?.email || "",
          customerPhone: o.customer?.phone || "",
          addressLine1: o.shippingAddress?.addressLine1 || "",
          addressLine2: o.shippingAddress?.addressLine2 || "",
          city: o.shippingAddress?.city || "",
          state: o.shippingAddress?.state || "",
          postalCode: o.shippingAddress?.postalCode || "",
          country: o.shippingAddress?.country || "India",
          subtotal: Number(o.subtotal) || 0,
          shippingCharge: Number(o.shippingCharge) || 0,
          couponCode: o.couponCode || null,
          discountAmount: Number(o.discountAmount) || 0,
          total: Number(o.total) || 0,
          paymentMethod: o.paymentMethod || "cod",
          paymentStatus: o.paymentStatus || "pending",
          orderStatus: o.orderStatus || "pending",
          customerNotes: o.customerNotes || "",
          createdAt: o.createdAt ? new Date(o.createdAt) : new Date(),
          updatedAt: o.updatedAt ? new Date(o.updatedAt) : new Date(),
          items: {
            create: (Array.isArray(o.items) ? o.items : []).map((it: any) => ({
              productId: it.productId ? it.productId.toString() : null,
              name: it.name,
              slug: it.slug,
              image: it.image || "",
              price: Number(it.price),
              quantity: Number(it.quantity) || 1,
              lineTotal: Number(it.lineTotal) || Number(it.price) * (Number(it.quantity) || 1),
            })),
          },
        },
      });
      console.log(`Migrated order: #${o.orderNumber}`);
    } else {
      console.log(`Order #${o.orderNumber} already exists in TiDB.`);
    }
  }

  console.log("\n=== Migration Completed Successfully! ===");
  await mongoose.disconnect();
  await prisma.$disconnect();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

