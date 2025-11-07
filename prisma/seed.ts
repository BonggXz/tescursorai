import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

import bcrypt from "bcrypt";
import { PrismaClient, PublishStatus, Role } from "@prisma/client";

const prisma = new PrismaClient();

type ProductSeed = {
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  images: string[];
  robloxAssetId?: string;
  categories: string[];
  tags: string[];
  status?: PublishStatus;
};

type AssetFileSeed = {
  fileName: string;
  relativePath: string;
};

type AssetSeed = {
  slug: string;
  title: string;
  description: string;
  version: string;
  categories: string[];
  tags: string[];
  license: string;
  status?: PublishStatus;
  files: AssetFileSeed[];
};

const productSeeds: ProductSeed[] = [
  {
    slug: "quantum-spawner-pack",
    title: "Quantum Spawner Pack",
    description:
      "A modular spawner system with queue management, cooldowns, and rich Roblox Studio integrations. Perfect for complex combat worlds.",
    priceCents: 1500,
    images: [
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80",
    ],
    robloxAssetId: "15839204712",
    categories: ["Systems", "Combat"],
    tags: ["Spawner", "AI", "Utility"],
    status: PublishStatus.PUBLISHED,
  },
  {
    slug: "stellar-ui-framework",
    title: "Stellar UI Framework",
    description:
      "Responsive UI kit featuring inventory grids, notifications, radial menus, and controller-friendly navigation.",
    priceCents: 2200,
    images: [
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80",
    ],
    robloxAssetId: "15839211234",
    categories: ["UI"],
    tags: ["UI", "Framework", "Responsive"],
    status: PublishStatus.PUBLISHED,
  },
  {
    slug: "aerial-pathfinding-suite",
    title: "Aerial Pathfinding Suite",
    description:
      "Advanced 3D pathfinding for flying NPCs with obstacle avoidance, dynamic re-targeting, and debug visualizers.",
    priceCents: 2600,
    images: [
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
    ],
    robloxAssetId: "15839217890",
    categories: ["AI", "Systems"],
    tags: ["Pathfinding", "NPC", "Flight"],
    status: PublishStatus.PUBLISHED,
  },
  {
    slug: "procedural-terrain-kit",
    title: "Procedural Terrain Kit",
    description:
      "Generate stylized, optimized terrain chunks with biome presets, water carving, and dynamic foliage streaming.",
    priceCents: 3200,
    images: [
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80",
    ],
    categories: ["Environment"],
    tags: ["Terrain", "Worldbuilding", "Procedural"],
    status: PublishStatus.PUBLISHED,
  },
  {
    slug: "hyperloop-transport-pack",
    title: "Hyperloop Transport Pack",
    description:
      "Fast-travel system with spline-based tracks, custom animations, and monetization-ready ticketing flows.",
    priceCents: 2800,
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    ],
    categories: ["Systems"],
    tags: ["Transport", "Monetization", "Utility"],
    status: PublishStatus.PUBLISHED,
  },
  {
    slug: "nebula-particle-library",
    title: "Nebula Particle Library",
    description:
      "60+ high-fidelity particle presets ready for Roblox Studio. Includes sci-fi trails, weather FX, and cinematic bursts.",
    priceCents: 1800,
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    ],
    categories: ["VFX"],
    tags: ["Particles", "Visual", "FX"],
    status: PublishStatus.PUBLISHED,
  },
];

const assetSeeds: AssetSeed[] = [
  {
    slug: "advanced-npc-controller",
    title: "Advanced NPC Controller",
    description:
      "A feature-rich NPC controller with combat states, dialogue hooks, and analytics events for Roblox experiences.",
    version: "1.1.0",
    categories: ["NPC", "Combat"],
    tags: ["AI", "Utility", "Combat"],
    license: "MIT",
    status: PublishStatus.PUBLISHED,
    files: [
      {
        fileName: "advanced-npc-controller.lua",
        relativePath: "public/uploads/assets/advanced-npc-controller.lua",
      },
    ],
  },
  {
    slug: "dynamic-hud-kit",
    title: "Dynamic HUD Kit",
    description:
      "Modular HUD widgets including minimaps, quest trackers, and energy bars with reactive data bindings.",
    version: "1.0.2",
    categories: ["UI"],
    tags: ["HUD", "UI", "Bindings"],
    license: "MIT",
    status: PublishStatus.PUBLISHED,
    files: [
      {
        fileName: "dynamic-hud-kit.lua",
        relativePath: "public/uploads/assets/dynamic-hud-kit.lua",
      },
    ],
  },
  {
    slug: "modular-sci-fi-doors",
    title: "Modular Sci-Fi Doors",
    description:
      "High polish sci-fi door pack with keycards, animations, sound effects, and replication-safe triggers.",
    version: "2.0.0",
    categories: ["Building", "Utility"],
    tags: ["Doors", "Sci-Fi", "Building"],
    license: "CC-BY-4.0",
    status: PublishStatus.PUBLISHED,
    files: [
      {
        fileName: "modular-sci-fi-doors.rbxm",
        relativePath: "public/uploads/assets/modular-sci-fi-doors.rbxm",
      },
    ],
  },
  {
    slug: "combat-ability-toolkit",
    title: "Combat Ability Toolkit",
    description:
      "Ready-to-ship toolkit featuring ability cooldowns, damage types, and animation blending for melee combat.",
    version: "0.9.5",
    categories: ["Combat", "Utility"],
    tags: ["Combat", "Abilities", "Framework"],
    license: "MIT",
    status: PublishStatus.PUBLISHED,
    files: [
      {
        fileName: "combat-ability-toolkit.lua",
        relativePath: "public/uploads/assets/combat-ability-toolkit.lua",
      },
    ],
  },
  {
    slug: "volumetric-weather-suite",
    title: "Volumetric Weather Suite",
    description:
      "Dynamic weather controller with volumetric fog, lightning, precipitation, and server-driven schedules.",
    version: "1.3.0",
    categories: ["Environment", "Utility"],
    tags: ["Weather", "Environment", "Atmosphere"],
    license: "MIT",
    status: PublishStatus.PUBLISHED,
    files: [
      {
        fileName: "volumetric-weather-suite.rbxm",
        relativePath: "public/uploads/assets/volumetric-weather-suite.rbxm",
      },
    ],
  },
  {
    slug: "creator-analytics-hooks",
    title: "Creator Analytics Hooks",
    description:
      "Capture creator analytics events, retention funnels, and monetization KPIs with minimal setup.",
    version: "0.5.0",
    categories: ["Utility"],
    tags: ["Analytics", "Utility", "Monetization"],
    license: "MIT",
    status: PublishStatus.PUBLISHED,
    files: [
      {
        fileName: "creator-analytics-hooks.lua",
        relativePath: "public/uploads/assets/creator-analytics-hooks.lua",
      },
    ],
  },
  {
    slug: "procedural-lighting-kit",
    title: "Procedural Lighting Kit",
    description:
      "Automate Roblox lighting states with day/night cycles, interior zones, and reactionary lighting triggers.",
    version: "1.4.1",
    categories: ["Utility", "Environment"],
    tags: ["Lighting", "Environment", "Automation"],
    license: "MIT",
    status: PublishStatus.PUBLISHED,
    files: [
      {
        fileName: "procedural-lighting-kit.lua",
        relativePath: "public/uploads/assets/procedural-lighting-kit.lua",
      },
    ],
  },
  {
    slug: "questline-graph-engine",
    title: "Questline Graph Engine",
    description:
      "Graph-based quest system with branching logic, prerequisites, and reward handlers for Roblox experiences.",
    version: "1.2.0",
    categories: ["Utility", "Systems"],
    tags: ["Quest", "Systems", "Graph"],
    license: "MIT",
    status: PublishStatus.PUBLISHED,
    files: [
      {
        fileName: "questline-graph-engine.lua",
        relativePath: "public/uploads/assets/questline-graph-engine.lua",
      },
    ],
  },
  {
    slug: "creator-onboarding-kit",
    title: "Creator Onboarding Kit",
    description:
      "Welcome new players with guided flows, tooltips, and progression tracking instrumentation.",
    version: "0.8.2",
    categories: ["UI", "Utility"],
    tags: ["Onboarding", "UI", "Utility"],
    license: "MIT",
    status: PublishStatus.PUBLISHED,
    files: [
      {
        fileName: "creator-onboarding-kit.lua",
        relativePath: "public/uploads/assets/creator-onboarding-kit.lua",
      },
    ],
  },
  {
    slug: "creator-collaboration-tools",
    title: "Creator Collaboration Tools",
    description:
      "Suite of collaboration helpers for creator teams including task boards, retros, and version snapshots.",
    version: "0.4.0",
    categories: ["Utility"],
    tags: ["Collaboration", "Utility", "Workflow"],
    license: "MIT",
    status: PublishStatus.PUBLISHED,
    files: [
      {
        fileName: "creator-collaboration-tools.lua",
        relativePath: "public/uploads/assets/creator-collaboration-tools.lua",
      },
    ],
  },
];

async function hashFile(filePath: string) {
  const data = await readFile(filePath);
  const hash = createHash("sha256");
  hash.update(data);
  return { sha256: hash.digest("hex"), size: data.byteLength };
}

async function buildFileMetadata(fileSeed: AssetFileSeed) {
  const absolutePath = path.resolve(process.cwd(), fileSeed.relativePath);
  const { sha256, size } = await hashFile(absolutePath);
  const ext = path.extname(fileSeed.fileName).replace(".", "");

  return {
    url: `/${fileSeed.relativePath.replace(/^public\//, "")}`,
    name: fileSeed.fileName,
    ext,
    size,
    sha256,
  };
}

async function main() {
  await prisma.auditEvent.deleteMany();
  await prisma.download.deleteMany();
  await prisma.fileRef.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siteSettings.deleteMany();

  const passwordHash = await bcrypt.hash("Admin123!", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@site.test",
      name: "Community Admin",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const createdProducts = await Promise.all(
    productSeeds.map((product) =>
      prisma.product.create({
        data: {
          ...product,
          images: JSON.stringify(product.images),
          categories: JSON.stringify(product.categories),
          tags: JSON.stringify(product.tags),
          status: product.status ?? PublishStatus.PUBLISHED,
        },
      }),
    ),
  );

  const createdAssets = [];
  for (const asset of assetSeeds) {
    const files = await Promise.all(asset.files.map((file) => buildFileMetadata(file)));
    const created = await prisma.asset.create({
      data: {
        slug: asset.slug,
        title: asset.title,
        description: asset.description,
        version: asset.version,
        categories: JSON.stringify(asset.categories),
        tags: JSON.stringify(asset.tags),
        license: asset.license,
        status: asset.status ?? PublishStatus.PUBLISHED,
        files: {
          create: files,
        },
      },
      include: { files: true },
    });
    createdAssets.push(created);
  }

  await prisma.siteSettings.create({
    data: {
      siteName: "Roblox Studio Collective",
      heroTitle: "Build together. Share faster.",
      heroSubtitle: "A modern hub for Roblox Studio creators.",
      socials: JSON.stringify({
        discord: "https://discord.gg/roblox-community",
        whatsapp: "https://chat.whatsapp.com/roblox-community",
        youtube: "https://youtube.com/@robloxcommunity",
        x: "https://x.com/robloxcommunity",
      }),
      featuredProductIds: JSON.stringify(createdProducts.slice(0, 3).map((product) => product.id)),
      featuredAssetIds: JSON.stringify(createdAssets.slice(0, 4).map((asset) => asset.id)),
      primaryColor: "#2563EB",
    },
  });

  await prisma.auditEvent.create({
    data: {
      actorId: admin.id,
      entity: "Seed",
      entityId: "initial",
      action: "CREATE",
      diff: {
        message: "Database seeded with initial content.",
      },
    },
  });

  // eslint-disable-next-line no-console
  console.log("Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seeding failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
