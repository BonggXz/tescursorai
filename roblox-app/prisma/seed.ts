import { Prisma, PrismaClient, PublishStatus, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@site.test";
const ADMIN_PASSWORD = "Admin123!";

type SeedProduct = {
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

type SeedAsset = {
  slug: string;
  title: string;
  description: string;
  version: string;
  categories: string[];
  tags: string[];
  license?: string;
  status?: PublishStatus;
  files: {
    name: string;
    url: string;
    ext: string;
    size: number;
    sha256: string;
  }[];
};

const products: SeedProduct[] = [
  {
    slug: "combat-kit-pro",
    title: "Combat Kit Pro",
    description: `
### What's inside

- Modular melee and ranged combat controllers
- Damage, health, and stat tracking services
- Polished hit VFX and SFX hooks

\`\`\`lua
local CombatService = require(ServerScriptService.Combat.Service)
CombatService:registerWeapon(tool, {
  comboWindow = 0.45,
  damage = 35,
  stunDuration = 0.2,
})
\`\`\`

> Tweak the configuration file to enable stamina, parry frames, and PvP safe zones.
    `,
    priceCents: 2499,
    images: ["/seed/products/combat-kit-pro.svg"],
    robloxAssetId: "123456789",
    categories: ["Systems"],
    tags: ["Combat", "NPC", "Utility"],
    status: PublishStatus.PUBLISHED,
  },
  {
    slug: "sci-fi-ui-pack",
    title: "Sci-Fi UI Pack",
    description:
      "Responsive UI components with futuristic styling, perfect for sci-fi worlds and simulator games.",
    priceCents: 1499,
    images: ["/seed/products/sci-fi-ui-pack.svg"],
    categories: ["UI Kits"],
    tags: ["UI", "Utility"],
    status: PublishStatus.PUBLISHED,
  },
  {
    slug: "dynamic-weather-engine",
    title: "Dynamic Weather Engine",
    description:
      "Server/client synced weather cycles with volumetric clouds, storms, and ambient audio cues.",
    priceCents: 1999,
    images: ["/seed/products/dynamic-weather-engine.svg"],
    robloxAssetId: "987654321",
    categories: ["Systems"],
    tags: ["Environment", "Utility"],
    status: PublishStatus.PUBLISHED,
  },
  {
    slug: "advanced-npc-behavior-pack",
    title: "Advanced NPC Behavior Pack",
    description:
      "Smart NPC behaviors with patrols, dialog trees, and combat heuristics ready to drop into your world.",
    priceCents: 1799,
    images: ["/seed/products/advanced-npc-behavior-pack.svg"],
    categories: ["Characters"],
    tags: ["NPC", "AI"],
    status: PublishStatus.PUBLISHED,
  },
  {
    slug: "builder-mega-kit",
    title: "Builder Mega Kit",
    description:
      "600+ modular building parts and materials to speed up environment construction.",
    priceCents: 1299,
    images: ["/seed/products/builder-mega-kit.svg"],
    categories: ["Environment"],
    tags: ["Building", "Utility"],
    status: PublishStatus.PUBLISHED,
  },
  {
    slug: "economy-simulator-framework",
    title: "Economy Simulator Framework",
    description: `
### Ship a simulator faster

- Inventory, crafting, and marketplace bindings
- Daily rewards, streaks, and retention utilities
- Opinionated data-store structure with guards

Integrate with Roblox's policy system via the included compliance helpers.
    `,
    priceCents: 2999,
    images: ["/seed/products/economy-simulator-framework.svg"],
    categories: ["Systems"],
    tags: ["Utility", "Economy"],
    status: PublishStatus.PUBLISHED,
  },
];

const assets: SeedAsset[] = [
  {
    slug: "procedural-terrain-suite",
    title: "Procedural Terrain Suite",
    description: `
### Rapid terrain iteration

1. Choose a **biome preset** (island, valley, plain, crater).
2. Apply erosion filters to blend rock and sand layers.
3. Hook into the included lighting scripts for time-of-day ambience.

\`\`\`lua
local TerrainSuite = require(ReplicatedStorage.TerrainSuite)
TerrainSuite:generate({
  seed = os.time(),
  biome = "island",
  resolution = 256,
})
\`\`\`
    `,
    version: "2.0.0",
    categories: ["Environment"],
    tags: ["Utility", "Building"],
    license: "MIT",
    status: PublishStatus.PUBLISHED,
    files: [
      {
        name: "terrain-suite-v2.rbxm",
        url: "/uploads/terrain-suite-v2.rbxm",
        ext: "rbxm",
        size: 540000,
        sha256:
          "4d2fcb5750aea0f2b6f2f60a0f1fa7f08f0bc44193a0645f69d6938f20f3e8a4",
      },
      {
        name: "terrain-readme.pdf",
        url: "/uploads/terrain-readme.pdf",
        ext: "pdf",
        size: 120000,
        sha256:
          "cce53b776fb3c5146a1bfa4d0d93926f40916b7ee9458e9a1351b1e6de7800ea",
      },
    ],
  },
  {
    slug: "modular-ui-kit",
    title: "Modular UI Kit",
    description: `
### UI components

- Responsive grids, stack layouts, toasts, and modals
- Theme tokens for light/dark variations
- Built-in support for \`Roact\` and vanilla Roblox UI objects
    `,
    version: "1.4.3",
    categories: ["UI"],
    tags: ["UI", "Utility"],
    license: "CC-BY-4.0",
    status: PublishStatus.PUBLISHED,
    files: [
      {
        name: "modular-ui-kit.rbxm",
        url: "/uploads/modular-ui-kit.rbxm",
        ext: "rbxm",
        size: 280000,
        sha256:
          "2e8f3b1062a1d48077b9df0a5f25ba06c0ff1b0190d1063e4d6edaf4f3a4af11",
      },
    ],
  },
  {
    slug: "npc-dialogue-system",
    title: "NPC Dialogue System",
    description: `
### Branching conversations

Supports conditions, quest hooks, and localization-ready strings.

\`\`\`lua
DialogueService:register("Blacksmith", {
  greeting = "Need your gear repaired?",
  options = {
    {
      text = "Show me what you've got.",
      action = "open_shop",
    },
    {
      text = "Any work available?",
      condition = function(player)
        return player.Level >= 5
      end,
      action = "start_quest",
    },
  },
})
\`\`\`
    `,
    version: "1.1.0",
    categories: ["NPC"],
    tags: ["NPC", "Utility"],
    files: [
      {
        name: "npc-dialogue-system.lua",
        url: "/uploads/npc-dialogue-system.lua",
        ext: "lua",
        size: 50000,
        sha256:
          "ab0d5eb7d2e45d6c8e119c2bb0f979f77a91d598a6d3b3c5e41c42b06d44b5be",
      },
    ],
  },
  {
    slug: "combat-vfx-pack",
    title: "Combat VFX Pack",
    description:
      "High-impact combat visual effects optimized for Roblox with configurable color palettes.",
    version: "1.0.2",
    categories: ["Combat"],
    tags: ["Combat", "Utility"],
    files: [
      {
        name: "combat-vfx-pack.rbxm",
        url: "/uploads/combat-vfx-pack.rbxm",
        ext: "rbxm",
        size: 210000,
        sha256:
          "6ba7234cc1d2904a30cd2abefc2f3f32c6f6de32805d1f8c0deaee4ecf2fbd25",
      },
    ],
  },
  {
    slug: "building-automation-scripts",
    title: "Building Automation Scripts",
    description:
      "Automate repetitive building tasks with snapping helpers, alignment tools, and prefab generators.",
    version: "1.3.1",
    categories: ["Building"],
    tags: ["Building", "Utility"],
    files: [
      {
        name: "building-automation.lua",
        url: "/uploads/building-automation.lua",
        ext: "lua",
        size: 72000,
        sha256:
          "ed8e410b55298b2ccb3168f9a3f6b1262b47195ebc12242e9de50465a1cdfc83",
      },
    ],
  },
  {
    slug: "lighting-atmosphere-pack",
    title: "Lighting Atmosphere Pack",
    description:
      "Atmosphere presets and scripts that bring cinematic lighting to any Roblox experience.",
    version: "2.1.0",
    categories: ["Environment"],
    tags: ["Utility"],
    files: [
      {
        name: "lighting-atmosphere-pack.rbxm",
        url: "/uploads/lighting-atmosphere-pack.rbxm",
        ext: "rbxm",
        size: 180000,
        sha256:
          "40c5fbb651d4c7c1e4b3d78bbf9d9f1dcf4c8de4466330238d96e206cedde94f",
      },
    ],
  },
  {
    slug: "animation-toolbox",
    title: "Animation Toolbox",
    description:
      "Curated animation scripts and rigs ready for customization with Roblox Studio.",
    version: "1.0.0",
    categories: ["Utility"],
    tags: ["Utility"],
    files: [
      {
        name: "animation-toolbox.rbxm",
        url: "/uploads/animation-toolbox.rbxm",
        ext: "rbxm",
        size: 160000,
        sha256:
          "e6f66e3db598b1d84fda199d8ecdd3d5c5bd7f6a85d5653c4f1f6c6edc6f837c",
      },
    ],
  },
  {
    slug: "npc-combat-behaviors",
    title: "NPC Combat Behaviors",
    description:
      "Lua behaviors for combat NPCs supporting melee, ranged, and boss mechanics.",
    version: "1.2.0",
    categories: ["NPC"],
    tags: ["Combat", "NPC"],
    files: [
      {
        name: "npc-combat-behaviors.lua",
        url: "/uploads/npc-combat-behaviors.lua",
        ext: "lua",
        size: 96000,
        sha256:
          "9fc37754fe4c924f8f8fd3214bf0d5a1cc3c348fc403dd5219182530d801f3f0",
      },
    ],
  },
  {
    slug: "ui-motion-presets",
    title: "UI Motion Presets",
    description:
      "Framer Motion-inspired animation presets tailored to Roblox GUIs.",
    version: "1.0.5",
    categories: ["UI"],
    tags: ["UI", "Utility"],
    files: [
      {
        name: "ui-motion-presets.lua",
        url: "/uploads/ui-motion-presets.lua",
        ext: "lua",
        size: 48000,
        sha256:
          "bcde279eb6ca1aa7951b74b0cbd748873f3994fdb56e2d5b51f9564d55cbe1e1",
      },
    ],
  },
  {
    slug: "soundscape-collection",
    title: "Soundscape Collection",
    description: `
### Ambient loops

- Biome-ready ambient beds for forests, caves, and sci-fi interiors
- Short-form SFX for UI feedback and interaction cues

All files are normalized and tagged for fast lookup.
    `,
    version: "1.0.0",
    categories: ["Audio"],
    tags: ["Utility"],
    files: [
      {
        name: "soundscape-collection.zip",
        url: "/uploads/soundscape-collection.zip",
        ext: "zip",
        size: 1024000,
        sha256:
          "bd62159fb05b43d05dcb190add7f9158867c1a8f9edc203f9cb0f4c88fece7f6",
      },
    ],
  },
];

async function seedUsers() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      email: ADMIN_EMAIL,
      name: "Community Admin",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  return admin;
}

async function seedProducts() {
  await prisma.product.deleteMany();

  const created = await Promise.all(
    products.map((product) =>
      prisma.product.create({
        data: {
          slug: product.slug,
          title: product.title,
          description: product.description,
          priceCents: product.priceCents,
          images: product.images as Prisma.JsonArray,
          robloxAssetId: product.robloxAssetId,
          categories: product.categories as Prisma.JsonArray,
          tags: product.tags as Prisma.JsonArray,
          status: product.status ?? PublishStatus.DRAFT,
        },
      }),
    ),
  );

  return created;
}

async function seedAssets() {
  await prisma.download.deleteMany();
  await prisma.fileRef.deleteMany();
  await prisma.asset.deleteMany();

  const createdAssets = [];

  for (const asset of assets) {
    const created = await prisma.asset.create({
      data: {
        slug: asset.slug,
        title: asset.title,
        description: asset.description,
        version: asset.version,
        categories: asset.categories as Prisma.JsonArray,
        tags: asset.tags as Prisma.JsonArray,
        license: asset.license ?? "MIT",
        status: asset.status ?? PublishStatus.DRAFT,
        files: {
          create: asset.files.map((file) => ({
            name: file.name,
            url: file.url,
            ext: file.ext,
            size: file.size,
            sha256: file.sha256,
          })),
        },
      },
    });
    createdAssets.push(created);
  }

  return createdAssets;
}

async function seedSiteSettings(productIds: string[], assetIds: string[]) {
  const socials = {
    discord: "https://discord.com/invite/roblox-community",
    whatsapp: "https://chat.whatsapp.com/example",
    youtube: "https://youtube.com/@robloxcommunity",
    x: "https://x.com/robloxcommunity",
  } satisfies Record<string, string>;

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      featuredProductIds: productIds.slice(0, 4) as Prisma.JsonArray,
      featuredAssetIds: assetIds.slice(0, 6) as Prisma.JsonArray,
      socials: socials as Prisma.JsonObject,
    },
    create: {
      featuredProductIds: productIds.slice(0, 4) as Prisma.JsonArray,
      featuredAssetIds: assetIds.slice(0, 6) as Prisma.JsonArray,
      socials: socials as Prisma.JsonObject,
    },
  });
}

async function clearAuditLog() {
  await prisma.auditEvent.deleteMany();
}

async function main() {
  await clearAuditLog();

  const admin = await seedUsers();
  const seededProducts = await seedProducts();
  const seededAssets = await seedAssets();

  await seedSiteSettings(
    seededProducts.map((product) => product.id),
    seededAssets.map((asset) => asset.id),
  );

  console.info(
    `✅ Seeded ${seededProducts.length} products, ${seededAssets.length} assets, and admin user ${admin.email}`,
  );
}

main()
  .catch((error) => {
    console.error("❌ Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
