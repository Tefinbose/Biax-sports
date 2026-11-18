import { NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { formatProduct } from "@/lib/db-helpers";

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

  const admin = await prisma.admin.findFirst({
    where: {
      id: session.adminId,
      active: true,
      role: "admin",
    },
    select: { id: true },
  });

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

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      products: products.map(formatProduct),
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

    const duplicate = await prisma.product.findFirst({
      where: {
        OR: [{ sku }, { slug }],
      },
      select: { id: true, sku: true, slug: true },
    });

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

    const product = await prisma.product.create({
      data: {
        ...data,
        sku,
        slug,
      },
    });

    return NextResponse.json(
      {
        message: "Product created successfully.",
        product: formatProduct(product),
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Admin products POST error:", error);

    return NextResponse.json(
      { message: "Unable to create the product. Please try again." },
      { status: 500 },
    );
  }
}
