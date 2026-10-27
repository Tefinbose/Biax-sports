
import { NextResponse } from "next/server";
import { z } from "zod";

import { connectToDatabase } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import Admin from "@/models/Admin";
import Product from "@/models/Product";

const productSchema = z
  .object({
    name: z.string().trim().min(2).max(150),
    description: z.string().trim().min(10).max(10000),
    shortDescription: z.string().trim().max(300).optional(),
    category: z.enum([
      "sportswear",
      "martial-arts-uniforms",
      "sports-equipment",
    ]),
    price: z.number().positive().finite().max(100000000),
    compareAtPrice: z.number().positive().finite().max(100000000).optional(),
    images: z.array(z.string().trim().min(1).max(2048)).min(1).max(10),
    sizes: z.array(z.string().trim().min(1).max(30)).max(30),
    colors: z.array(z.string().trim().min(1).max(50)).max(30),
    stock: z.number().int().min(0).max(10000000),
    sku: z.string().trim().min(2).max(80),
    featured: z.boolean().default(false),
    published: z.boolean().default(false),
    isComingSoon: z.boolean().default(false),
  })
  .refine(
    (data) =>
      data.compareAtPrice === undefined ||
      data.compareAtPrice > data.price,
    {
      message: "Compare-at price must be higher than the selling price.",
      path: ["compareAtPrice"],
    },
  );

function makeSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function authorizeAdmin() {
  const session = await getAdminSession();

  if (!session) return false;

  await connectToDatabase();

  const admin = await Admin.findOne({
    _id: session.adminId,
    active: true,
    role: "admin",
  })
    .select("_id")
    .lean();

  return Boolean(admin);
}

export async function GET() {
  try {
    if (!(await authorizeAdmin())) {
      return NextResponse.json(
        { message: "Please sign in with an administrator account." },
        { status: 401 },
      );
    }

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      products: products.map((product) => ({
        ...product,
        _id: String(product._id),
      })),
    });
  } catch (error) {
    console.error("Admin products GET error:", error);

    return NextResponse.json(
      { message: "Unable to load products right now." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await authorizeAdmin())) {
      return NextResponse.json(
        { message: "Please sign in with an administrator account." },
        { status: 401 },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON request body." },
        { status: 400 },
      );
    }

    const result = productSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message:
            result.error.issues[0]?.message ?? "Invalid product details.",
        },
        { status: 400 },
      );
    }

    const data = result.data;
    const sku = data.sku.trim();
    const slug = makeSlug(data.name);

    if (!slug) {
      return NextResponse.json(
        { message: "Enter a valid product name." },
        { status: 400 },
      );
    }

    const escapedSku = sku.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const duplicate = await Product.findOne({
      $or: [
        { sku: { $regex: `^${escapedSku}$`, $options: "i" } },
        { slug },
      ],
    })
      .select("_id sku slug")
      .lean();

    if (duplicate) {
      return NextResponse.json(
        {
          message:
            duplicate.sku.toLowerCase() === sku.toLowerCase()
              ? "A product with this SKU already exists."
              : "A product with this name already exists. Use a different name.",
        },
        { status: 409 },
      );
    }

    const product = await Product.create({
      ...data,
      sku,
      slug,
    });

    return NextResponse.json(
      {
        message: "Product created successfully.",
        product: {
          _id: product._id.toString(),
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          category: product.category,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          images: product.images,
          sizes: product.sizes,
          colors: product.colors,
          stock: product.stock,
          sku: product.sku,
          featured: product.featured,
          published: product.published,
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { message: "A product with this name, slug, or SKU already exists." },
        { status: 409 },
      );
    }

    console.error("Admin products POST error:", error);

    return NextResponse.json(
      { message: "Unable to create the product. Please try again." },
      { status: 500 },
    );
  }
}
