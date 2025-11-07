import { createHash } from "crypto";
import { readFile } from "fs/promises";
import path from "path";

export async function computeSHA256(filePath: string): Promise<string> {
  const buffer = await readFile(filePath);
  return createHash("sha256").update(buffer).digest("hex");
}

export function validateFileExtension(filename: string, allowedExtensions: string[]): boolean {
  const ext = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(ext);
}

export const ALLOWED_UPLOAD_EXTENSIONS = [".lua", ".rbxm", ".rbxmx", ".png", ".jpg", ".jpeg", ".webp"];
export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
