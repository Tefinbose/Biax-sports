
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { slug } = await params;

    await connectToDatabase();

    const product = await Product.findOne({
      slug,
      published: true,
    })
      .select(
        "name slug description shortDescription category price compareAtPrice images sizes colors stock sku featured isComingSoon",
      )
      .lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      product: {
        ...product,
        _id: String(product._id),
      },
    });
  } catch (error) {
    console.error("Failed to fetch product:", error);

    return NextResponse.json(
      { error: "Unable to load product." },
      { status: 500 },
    );
  }
}
