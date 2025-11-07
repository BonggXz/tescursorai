import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role, PublishStatus } from "@prisma/client";

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@site.test" },
    update: {},
    create: {
      email: "admin@site.test",
      name: "Admin User",
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create demo products
  const products = [
    {
      slug: "advanced-ui-framework",
      title: "Advanced UI Framework",
      description: "A comprehensive UI framework for Roblox Studio with modern components and animations.",
      priceCents: 1999,
      images: JSON.stringify(["/uploads/product-ui.jpg"]),
      robloxAssetId: "123456789",
      categories: JSON.stringify(["UI", "Framework"]),
      tags: JSON.stringify(["ui", "framework", "components"]),
      status: PublishStatus.PUBLISHED,
    },
    {
      slug: "npc-ai-system",
      title: "NPC AI System",
      description: "Intelligent NPC system with pathfinding, combat, and dialogue systems.",
      priceCents: 2999,
      images: JSON.stringify(["/uploads/product-npc.jpg"]),
      robloxAssetId: "987654321",
      categories: JSON.stringify(["NPC", "AI"]),
      tags: JSON.stringify(["npc", "ai", "combat"]),
      status: PublishStatus.PUBLISHED,
    },
    {
      slug: "building-tools-pro",
      title: "Building Tools Pro",
      description: "Professional building tools for efficient Roblox Studio development.",
      priceCents: 1499,
      images: JSON.stringify(["/uploads/product-building.jpg"]),
      robloxAssetId: "456789123",
      categories: JSON.stringify(["Building", "Tools"]),
      tags: JSON.stringify(["building", "tools", "utility"]),
      status: PublishStatus.PUBLISHED,
    },
    {
      slug: "combat-system",
      title: "Combat System",
      description: "Full-featured combat system with hit detection, damage calculation, and effects.",
      priceCents: 2499,
      images: JSON.stringify(["/uploads/product-combat.jpg"]),
      robloxAssetId: "789123456",
      categories: JSON.stringify(["Combat", "Gameplay"]),
      tags: JSON.stringify(["combat", "gameplay", "system"]),
      status: PublishStatus.PUBLISHED,
    },
    {
      slug: "data-manager",
      title: "Data Manager",
      description: "Robust data persistence system for player data and game state.",
      priceCents: 1799,
      images: JSON.stringify(["/uploads/product-data.jpg"]),
      robloxAssetId: "321654987",
      categories: JSON.stringify(["Utility", "Data"]),
      tags: JSON.stringify(["data", "utility", "persistence"]),
      status: PublishStatus.PUBLISHED,
    },
    {
      slug: "animation-pack",
      title: "Animation Pack",
      description: "Collection of professional animations for characters and NPCs.",
      priceCents: 1299,
      images: JSON.stringify(["/uploads/product-anim.jpg"]),
      robloxAssetId: "654987321",
      categories: JSON.stringify(["Animation", "Assets"]),
      tags: JSON.stringify(["animation", "assets", "characters"]),
      status: PublishStatus.PUBLISHED,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log(`✅ Created ${products.length} products`);

  // Create demo assets
  const assets = [
    {
      slug: "utility-helper-functions",
      title: "Utility Helper Functions",
      description: "Collection of commonly used utility functions for Roblox Lua development.",
      version: "1.0.0",
      files: JSON.stringify([
        {
          name: "utils.lua",
          url: "/uploads/utils.lua",
          size: 10240,
          ext: ".lua",
          sha256: "abc123def456",
        },
      ]),
      categories: JSON.stringify(["Utility"]),
      tags: JSON.stringify(["utility", "lua", "helpers"]),
      license: "MIT",
      status: PublishStatus.PUBLISHED,
      downloadCount: 0,
    },
    {
      slug: "ui-button-component",
      title: "UI Button Component",
      description: "Reusable button component with hover effects and animations.",
      version: "1.2.0",
      files: JSON.stringify([
        {
          name: "Button.lua",
          url: "/uploads/Button.lua",
          size: 8192,
          ext: ".lua",
          sha256: "def456ghi789",
        },
      ]),
      categories: JSON.stringify(["UI"]),
      tags: JSON.stringify(["ui", "component", "button"]),
      license: "MIT",
      status: PublishStatus.PUBLISHED,
      downloadCount: 0,
    },
    {
      slug: "npc-basic-ai",
      title: "Basic NPC AI",
      description: "Simple NPC AI script with basic movement and interaction.",
      version: "1.0.0",
      files: JSON.stringify([
        {
          name: "NPCAI.lua",
          url: "/uploads/NPCAI.lua",
          size: 15360,
          ext: ".lua",
          sha256: "ghi789jkl012",
        },
      ]),
      categories: JSON.stringify(["NPC"]),
      tags: JSON.stringify(["npc", "ai", "script"]),
      license: "MIT",
      status: PublishStatus.PUBLISHED,
      downloadCount: 0,
    },
    {
      slug: "combat-damage-system",
      title: "Combat Damage System",
      description: "Damage calculation and application system for combat mechanics.",
      version: "2.1.0",
      files: JSON.stringify([
        {
          name: "DamageSystem.lua",
          url: "/uploads/DamageSystem.lua",
          size: 20480,
          ext: ".lua",
          sha256: "jkl012mno345",
        },
      ]),
      categories: JSON.stringify(["Combat"]),
      tags: JSON.stringify(["combat", "damage", "system"]),
      license: "MIT",
      status: PublishStatus.PUBLISHED,
      downloadCount: 0,
    },
    {
      slug: "building-snap-tool",
      title: "Building Snap Tool",
      description: "Snap-to-grid tool for precise building in Roblox Studio.",
      version: "1.5.0",
      files: JSON.stringify([
        {
          name: "SnapTool.lua",
          url: "/uploads/SnapTool.lua",
          size: 12288,
          ext: ".lua",
          sha256: "mno345pqr678",
        },
      ]),
      categories: JSON.stringify(["Building"]),
      tags: JSON.stringify(["building", "tools", "snap"]),
      license: "MIT",
      status: PublishStatus.PUBLISHED,
      downloadCount: 0,
    },
    {
      slug: "data-store-wrapper",
      title: "DataStore Wrapper",
      description: "Safe wrapper for Roblox DataStore with retry logic and error handling.",
      version: "1.3.0",
      files: JSON.stringify([
        {
          name: "DataStoreWrapper.lua",
          url: "/uploads/DataStoreWrapper.lua",
          size: 18432,
          ext: ".lua",
          sha256: "pqr678stu901",
        },
      ]),
      categories: JSON.stringify(["Utility"]),
      tags: JSON.stringify(["utility", "datastore", "data"]),
      license: "MIT",
      status: PublishStatus.PUBLISHED,
      downloadCount: 0,
    },
    {
      slug: "ui-notification-system",
      title: "UI Notification System",
      description: "Toast notification system for displaying messages to players.",
      version: "1.1.0",
      files: JSON.stringify([
        {
          name: "NotificationSystem.lua",
          url: "/uploads/NotificationSystem.lua",
          size: 14336,
          ext: ".lua",
          sha256: "stu901vwx234",
        },
      ]),
      categories: JSON.stringify(["UI"]),
      tags: JSON.stringify(["ui", "notification", "toast"]),
      license: "MIT",
      status: PublishStatus.PUBLISHED,
      downloadCount: 0,
    },
    {
      slug: "npc-dialogue-system",
      title: "NPC Dialogue System",
      description: "Interactive dialogue system for NPCs with branching conversations.",
      version: "1.0.0",
      files: JSON.stringify([
        {
          name: "DialogueSystem.lua",
          url: "/uploads/DialogueSystem.lua",
          size: 25600,
          ext: ".lua",
          sha256: "vwx234yza567",
        },
      ]),
      categories: JSON.stringify(["NPC"]),
      tags: JSON.stringify(["npc", "dialogue", "conversation"]),
      license: "MIT",
      status: PublishStatus.PUBLISHED,
      downloadCount: 0,
    },
    {
      slug: "combat-hit-detection",
      title: "Combat Hit Detection",
      description: "Precise hit detection system for melee and ranged combat.",
      version: "1.2.0",
      files: JSON.stringify([
        {
          name: "HitDetection.lua",
          url: "/uploads/HitDetection.lua",
          size: 22528,
          ext: ".lua",
          sha256: "yza567bcd890",
        },
      ]),
      categories: JSON.stringify(["Combat"]),
      tags: JSON.stringify(["combat", "hit", "detection"]),
      license: "MIT",
      status: PublishStatus.PUBLISHED,
      downloadCount: 0,
    },
    {
      slug: "building-place-tool",
      title: "Building Place Tool",
      description: "Custom place tool for quickly placing parts and models.",
      version: "1.0.0",
      files: JSON.stringify([
        {
          name: "PlaceTool.lua",
          url: "/uploads/PlaceTool.lua",
          size: 16384,
          ext: ".lua",
          sha256: "bcd890efg123",
        },
      ]),
      categories: JSON.stringify(["Building"]),
      tags: JSON.stringify(["building", "tools", "place"]),
      license: "MIT",
      status: PublishStatus.PUBLISHED,
      downloadCount: 0,
    },
  ];

  for (const asset of assets) {
    await prisma.asset.upsert({
      where: { slug: asset.slug },
      update: {},
      create: asset,
    });
  }
  console.log(`✅ Created ${assets.length} assets`);

  // Create site settings
  const siteSettings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "Roblox Studio Community",
      heroTitle: "Build together. Share faster.",
      heroSubtitle: "A modern hub for Roblox Studio creators.",
      featuredProductIds: JSON.stringify(products.slice(0, 4).map((_, i) => products[i].slug)),
      featuredAssetIds: JSON.stringify(assets.slice(0, 6).map((_, i) => assets[i].slug)),
      socials: JSON.stringify({
        discord: "https://discord.gg/robloxstudio",
        whatsapp: "https://wa.me/1234567890",
        youtube: "https://youtube.com/@robloxstudio",
        x: "https://x.com/robloxstudio",
      }),
      primaryColor: "#2563EB",
    },
  });
  console.log("✅ Created site settings");

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
