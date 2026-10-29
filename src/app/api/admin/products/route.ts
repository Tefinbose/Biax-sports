
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import Admin from "@/models/Admin";
import Product from "@/models/Product";

const productSchema = z
  .object({
    name: z.string().trim().min(2).max(150),
    description: z.string().trim().max(10000).optional().default(""),
    shortDescription: z.string().trim().max(300).optional(),
    category: z.enum([
      "sportswear",
      "martial-arts-uniforms",
      "sports-equipment",
      "lifestyle",
    ]),
    price: z.number().positive().finite(),
    compareAtPrice: z.number().positive().finite().optional(),
    images: z.array(z.string().trim().min(1)).min(1).max(10),
    sizes: z.array(z.string().trim().min(1)).max(30),
    colors: z.array(z.string().trim().min(1)).max(30),
    stock: z.number().int().min(0),
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

function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

function errorResponse(error: unknown, action: string) {
  if (isDuplicateKeyError(error)) {
    return NextResponse.json(
      { message: "A product with this name, slug, or SKU already exists." },
      { status: 409 },
    );
  }

  console.error(`Admin products ${action} error:`, error);

  return NextResponse.json(
    { message: `Unable to ${action.toLowerCase()} the product. Please try again.` },
    { status: 500 },
  );
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
    return errorResponse(error, "load");
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
        { message: result.error.issues[0]?.message ?? "Invalid product details." },
        { status: 400 },
      );
    }

    const data = result.data;
    const slug = makeSlug(data.name);

    if (!slug) {
      return NextResponse.json(
        { message: "Enter a valid product name." },
        { status: 400 },
      );
    }

    const escapedSku = data.sku.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const duplicate = await Product.findOne({
      $or: [
        { sku: { $regex: `^${escapedSku}$`, $options: "i" } },
        { slug },
      ],
    })
      .select("_id")
      .lean();

    if (duplicate) {
      return NextResponse.json(
        { message: "A product with this name or SKU already exists." },
        { status: 409 },
      );
    }

    const product = await Product.create({
      ...data,
      sku: data.sku.trim(),
      slug,
    });

    return NextResponse.json(
      {
        message: "Product created successfully.",
        product: { ...product.toObject(), _id: product._id.toString() },
      },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error, "create");
  }
}

export async function PUT(request: Request) {
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

    if (
      typeof body !== "object" ||
      body === null ||
      !("id" in body) ||
      typeof body.id !== "string" ||
      !mongoose.isValidObjectId(body.id)
    ) {
      return NextResponse.json(
        { message: "A valid product ID is required." },
        { status: 400 },
      );
    }

    const { id, ...productBody } = body;
    const result = productSchema.safeParse(productBody);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0]?.message ?? "Invalid product details." },
        { status: 400 },
      );
    }

    const data = result.data;
    const slug = makeSlug(data.name);

    if (!slug) {
      return NextResponse.json(
        { message: "Enter a valid product name." },
        { status: 400 },
      );
    }

    const existingProduct = await Product.findById(id).select("_id").lean();

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 },
      );
    }

    const escapedSku = data.sku.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const duplicate = await Product.findOne({
      _id: { $ne: id },
      $or: [
        { sku: { $regex: `^${escapedSku}$`, $options: "i" } },
        { slug },
      ],
    })
      .select("_id")
      .lean();

    if (duplicate) {
      return NextResponse.json(
        { message: "Another product already uses this name or SKU." },
        { status: 409 },
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { ...data, sku: data.sku.trim(), slug },
      { new: true, runValidators: true },
    ).lean();

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Product updated successfully.",
      product: { ...product, _id: String(product._id) },
    });
  } catch (error) {
    return errorResponse(error, "update");
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await authorizeAdmin())) {
      return NextResponse.json(
        { message: "Please sign in with an administrator account." },
        { status: 401 },
      );
    }

    const id = new URL(request.url).searchParams.get("id");

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "A valid product ID is required." },
        { status: 400 },
      );
    }

    const product = await Product.findByIdAndDelete(id).lean();

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Product deleted successfully." });
  } catch (error) {
    return errorResponse(error, "delete");
  }
}
