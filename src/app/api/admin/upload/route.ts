import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { getAdminSession } from "@/lib/auth";
import Admin from "@/models/Admin";
import { connectToDatabase } from "@/lib/mongodb";

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB limit per file

const SUPPORTED_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "jfif",
  "pjpeg",
  "pjp",
  "png",
  "webp",
  "gif",
  "avif",
  "svg",
]);

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
    // Collect all files from "files" and "file" fields
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
            message: `File "${file.name}" exceeds the 15MB size limit. Please upload a smaller image.`,
          },
          { status: 400 }
        );
      }

      const originalExt = path
        .extname(file.name)
        .toLowerCase()
        .replace(/^\./, "");

      const isLikelyImage =
        (file.type && file.type.startsWith("image/")) ||
        SUPPORTED_EXTENSIONS.has(originalExt);

      if (!isLikelyImage) {
        return NextResponse.json(
          {
            message: `File "${file.name}" is not a recognized image format.`,
          },
          { status: 400 }
        );
      }

      const inputBuffer = Buffer.from(await file.arrayBuffer());
      let outputBuffer: Buffer = inputBuffer;
      let targetExt = "jpg";

      try {
        const imageInstance = sharp(inputBuffer);
        const metadata = await imageInstance.metadata();

        if (!metadata.format) {
          throw new Error("Unrecognized image data");
        }

        if (metadata.format === "svg") {
          targetExt = "svg";
          outputBuffer = inputBuffer;
        } else if (metadata.format === "gif") {
          targetExt = "gif";
          outputBuffer = inputBuffer;
        } else if (metadata.format === "png") {
          targetExt = "png";
          // Auto-rotate according to EXIF for mobile captures and save clean PNG
          outputBuffer = await imageInstance.rotate().toBuffer();
        } else if (metadata.format === "webp") {
          targetExt = "webp";
          outputBuffer = await imageInstance.rotate().toBuffer();
        } else {
          // JPEG, JFIF (common in WhatsApp Web/Desktop), PJPEG, etc.
          // Normalize to universally compatible standard JPG with auto-rotation
          targetExt = "jpg";
          outputBuffer = await imageInstance
            .rotate()
            .jpeg({ quality: 92, mozjpeg: true })
            .toBuffer();
        }
      } catch (procError) {
        // Fallback for SVG or raw formats if sharp fails
        if (originalExt === "svg" || file.type === "image/svg+xml") {
          targetExt = "svg";
          outputBuffer = inputBuffer;
        } else {
          console.warn("Failed to process image buffer with sharp:", procError);
          return NextResponse.json(
            {
              message: `Could not process image "${file.name}". Please ensure it is a valid image.`,
            },
            { status: 400 }
          );
        }
      }

      const uniqueSuffix = `${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
      const filename = `biax_prod_${uniqueSuffix}.${targetExt}`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, outputBuffer);

      const publicUrl = `/uploads/products/${filename}`;
      uploadedResults.push({
        url: publicUrl,
        name: file.name,
        size: outputBuffer.length,
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
