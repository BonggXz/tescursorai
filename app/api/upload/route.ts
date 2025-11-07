import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { saveFile, validateFileExtension, validateFileSize } from "@/lib/files";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!validateFileExtension(file.name)) {
      return NextResponse.json(
        { error: "Invalid file extension" },
        { status: 400 }
      );
    }

    if (!validateFileSize(file.size)) {
      return NextResponse.json(
        { error: "File too large (max 25MB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileRef = await saveFile(buffer, file.name);

    return NextResponse.json(fileRef);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
