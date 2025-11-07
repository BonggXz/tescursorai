import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
import { computeSHA256, validateFileExtension, ALLOWED_EXTENSIONS, stringifyFileRefs, FileRef } from "@/lib/file-utils";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!validateFileExtension(file.name, ALLOWED_EXTENSIONS.all)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 25MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const filePath = join(process.cwd(), "public", "uploads", filename);

    await writeFile(filePath, buffer);

    const sha256 = await computeSHA256(filePath);
    const ext = file.name.substring(file.name.lastIndexOf("."));

    const fileRef: FileRef = {
      name: file.name,
      url: `/uploads/${filename}`,
      size: file.size,
      ext,
      sha256,
    };

    return NextResponse.json(fileRef);
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message.includes("Admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
