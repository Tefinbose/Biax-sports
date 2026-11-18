import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatProduct } from "@/lib/db-helpers";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findFirst({
      where: {
        slug,
        published: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      product: formatProduct(product),
    });
  } catch (error) {
    console.error("Failed to fetch product:", error);

    return NextResponse.json(
      { error: "Unable to load product." },
      { status: 500 },
    );
  }
}
