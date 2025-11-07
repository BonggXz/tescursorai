import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-helpers";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { computeSHA256, validateFileExtension, ALLOWED_UPLOAD_EXTENSIONS, MAX_FILE_SIZE } from "@/lib/file-utils";
import { createAuditEvent } from "@/lib/audit";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    if (!validateFileExtension(file.name, ALLOWED_UPLOAD_EXTENSIONS)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${sanitizedName}`;
    const filePath = join(uploadsDir, fileName);

    // Write file
    await writeFile(filePath, buffer);

    // Compute SHA-256
    const sha256 = await computeSHA256(filePath);

    const fileUrl = `/uploads/${fileName}`;
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    return NextResponse.json({
      url: fileUrl,
      name: file.name,
      size: file.size,
      ext: `.${ext}`,
      sha256,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
