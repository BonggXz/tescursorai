import { createHash } from "crypto";
import { readFile } from "fs/promises";
import { join } from "path";

export interface FileRef {
  name: string;
  url: string;
  size: number;
  ext: string;
  sha256: string;
}

export async function computeSHA256(filePath: string): Promise<string> {
  const buffer = await readFile(filePath);
  return createHash("sha256").update(buffer).digest("hex");
}

export function parseFileRefs(filesJson: string): FileRef[] {
  try {
    return JSON.parse(filesJson);
  } catch {
    return [];
  }
}

export function stringifyFileRefs(files: FileRef[]): string {
  return JSON.stringify(files);
}

export const ALLOWED_EXTENSIONS = {
  images: [".png", ".jpg", ".jpeg", ".webp"],
  assets: [".lua", ".rbxm", ".rbxmx"],
  all: [".png", ".jpg", ".jpeg", ".webp", ".lua", ".rbxm", ".rbxmx"],
};

export function validateFileExtension(filename: string, allowed: string[]): boolean {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf("."));
  return allowed.includes(ext);
}

export function getUploadPath(filename: string): string {
  return join(process.cwd(), "public", "uploads", filename);
}
