import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

export interface FileRef {
  name: string;
  url: string;
  ext: string;
  size: number;
  sha256: string;
}

const ALLOWED_EXTENSIONS = [
  ".lua",
  ".rbxm",
  ".rbxmx",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export async function computeSHA256(buffer: Buffer): Promise<string> {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export function validateFileExtension(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

export function validateFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE;
}

export async function saveFile(
  buffer: Buffer,
  filename: string
): Promise<FileRef> {
  const ext = path.extname(filename).toLowerCase();
  if (!validateFileExtension(filename)) {
    throw new Error(`Invalid file extension: ${ext}`);
  }

  if (!validateFileSize(buffer.length)) {
    throw new Error(`File too large: ${buffer.length} bytes`);
  }

  const sha256 = await computeSHA256(buffer);
  const sanitizedFilename = `${sha256.slice(0, 16)}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, sanitizedFilename);

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(filePath, buffer);

  const url = `/uploads/${sanitizedFilename}`;

  return {
    name: filename,
    url,
    ext,
    size: buffer.length,
    sha256,
  };
}

export async function deleteFile(url: string): Promise<void> {
  try {
    const filename = path.basename(url);
    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    await fs.unlink(filePath);
  } catch (error) {
    // File might not exist, ignore
    console.error("Error deleting file:", error);
  }
}
