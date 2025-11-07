import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const SUPPORTED_PROVIDERS = new Set(["sqlite", "postgresql"]);

async function ensurePrismaSchema() {
  const providerFromEnv = process.env.DATABASE_PROVIDER?.toLowerCase() ?? "sqlite";
  if (!SUPPORTED_PROVIDERS.has(providerFromEnv)) {
    throw new Error(
      `Unsupported DATABASE_PROVIDER "${providerFromEnv}". Expected one of: ${[
        ...SUPPORTED_PROVIDERS,
      ].join(", ")}`,
    );
  }

  const templatePath = path.resolve(process.cwd(), "prisma/schema.template.prisma");
  const schemaPath = path.resolve(process.cwd(), "prisma/schema.prisma");

  const template = await readFile(templatePath, "utf8");
  const providerLine = `provider = "${providerFromEnv}"`;
  const nextSchema = template.replace("provider = __PROVIDER__", providerLine);

  let currentSchema: string | null = null;
  try {
    await stat(schemaPath);
    currentSchema = await readFile(schemaPath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  if (currentSchema !== nextSchema) {
    await writeFile(schemaPath, nextSchema, "utf8");
    console.warn(`Prisma schema synced with provider "${providerFromEnv}".`);
  }
}

ensurePrismaSchema().catch((error) => {
  console.error("[sync-prisma-provider] Failed to sync Prisma schema.");
  console.error(error);
  process.exit(1);
});
