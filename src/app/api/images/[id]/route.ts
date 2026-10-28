import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import ProductImage from "@/models/ProductImage";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const cleanId = id.replace(/\.[a-zA-Z0-9]+$/, "");

    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      return new NextResponse("Invalid image ID", { status: 400 });
    }

    await connectToDatabase();
    const doc = await ProductImage.findById(cleanId).select("data contentType size");

    if (!doc || !doc.data) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", doc.contentType || "image/jpeg");
    headers.set("Content-Length", String(doc.data.length));
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new NextResponse(new Uint8Array(doc.data), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error serving image from MongoDB:", error);
    return new NextResponse("Error fetching image", { status: 500 });
  }
}
