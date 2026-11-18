import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const cleanId = id.replace(/\.[a-zA-Z0-9]+$/, "");

    const doc = await prisma.productImage.findFirst({
      where: {
        OR: [
          { id: cleanId },
          { id: id },
          { filename: id },
          { filename: cleanId },
        ],
      },
      select: { data: true, contentType: true, size: true },
    });

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
    console.error("Error serving image from TiDB:", error);
    return new NextResponse("Error fetching image", { status: 500 });
  }
}
