import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { getAdminSession } from "@/lib/auth";
import Admin from "@/models/Admin";
import { connectToDatabase } from "@/lib/mongodb";


const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file

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

function getExtension(filename: string, mimeType: string): string {
  const ext = path.extname(filename).toLowerCase().replace(/^\./, "");
  if (ext && ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"].includes(ext)) {
    return ext === "jpeg" ? "jpg" : ext;
  }
  switch (mimeType) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/svg+xml":
      return "svg";
    case "image/avif":
      return "avif";
    case "image/jpeg":
    default:
      return "jpg";
  }
}

export async function POST(request: Request) {
  try {
    const isAuthorized = await authorizeAdmin();
    if (!isAuthorized) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in as admin." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    // Support both single "file" and multi "files" field names
    const fileEntries = [
      ...formData.getAll("files"),
      ...formData.getAll("file"),
    ].filter((item): item is File => item instanceof File && item.size > 0);

    if (fileEntries.length === 0) {
      return NextResponse.json(
        { message: "No image files were uploaded." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(uploadDir, { recursive: true });

    const uploadedResults: { url: string; name: string; size: number }[] = [];

    for (const file of fileEntries) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            message: `File "${file.name}" exceeds the 10MB size limit. Please upload a smaller image.`,
          },
          { status: 400 }
        );
      }

      if (!ALLOWED_MIME_TYPES.has(file.type) && !file.type.startsWith("image/")) {
        return NextResponse.json(
          {
            message: `File "${file.name}" is not a supported image format. Supported formats: JPG, PNG, WebP, GIF, SVG, AVIF.`,
          },
          { status: 400 }
        );
      }

      const ext = getExtension(file.name, file.type);
      const uniqueSuffix = `${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
      const filename = `biax_prod_${uniqueSuffix}.${ext}`;
      const filepath = path.join(uploadDir, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filepath, buffer);

      const publicUrl = `/uploads/products/${filename}`;
      uploadedResults.push({
        url: publicUrl,
        name: file.name,
        size: file.size,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedResults.length} image(s).`,
      urls: uploadedResults.map((r) => r.url),
      files: uploadedResults,
    });
  } catch (error) {
    console.error("Admin image upload error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while saving the image(s).",
      },
      { status: 500 }
    );
  }
}
