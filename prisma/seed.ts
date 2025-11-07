import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@site.test" },
    update: {},
    create: {
      email: "admin@site.test",
      passwordHash: adminPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });
  console.log("Created admin user:", admin.email);

  // Create demo products
  const products = [
    {
      slug: "advanced-ui-framework",
      title: "Advanced UI Framework",
      description: "A comprehensive UI framework for Roblox Studio with modern components and animations.",
      priceCents: 1999,
      images: JSON.stringify(["/uploads/placeholder-product-1.png"]),
      categories: JSON.stringify(["UI", "Framework"]),
      tags: JSON.stringify(["UI", "Framework", "Premium"]),
      status: "PUBLISHED",
      robloxAssetId: "123456789",
    },
    {
      slug: "npc-dialogue-system",
      title: "NPC Dialogue System",
      description: "Complete dialogue system for NPCs with branching conversations and quest integration.",
      priceCents: 1499,
      images: JSON.stringify(["/uploads/placeholder-product-2.png"]),
      categories: JSON.stringify(["NPC", "Gameplay"]),
      tags: JSON.stringify(["NPC", "Dialogue", "Quest"]),
      status: "PUBLISHED",
    },
    {
      slug: "combat-system-pro",
      title: "Combat System Pro",
      description: "Professional combat system with hit detection, damage calculation, and special abilities.",
      priceCents: 2499,
      images: JSON.stringify(["/uploads/placeholder-product-3.png"]),
      categories: JSON.stringify(["Combat", "Gameplay"]),
      tags: JSON.stringify(["Combat", "Pro", "Gameplay"]),
      status: "PUBLISHED",
    },
    {
      slug: "building-tools-pack",
      title: "Building Tools Pack",
      description: "Essential building tools for efficient game development.",
      priceCents: 999,
      images: JSON.stringify(["/uploads/placeholder-product-4.png"]),
      categories: JSON.stringify(["Building", "Tools"]),
      tags: JSON.stringify(["Building", "Tools"]),
      status: "PUBLISHED",
    },
    {
      slug: "data-store-manager",
      title: "Data Store Manager",
      description: "Robust data store management system with caching and error handling.",
      priceCents: 1799,
      images: JSON.stringify(["/uploads/placeholder-product-5.png"]),
      categories: JSON.stringify(["Utility", "Data"]),
      tags: JSON.stringify(["Data", "Storage", "Utility"]),
      status: "PUBLISHED",
    },
    {
      slug: "inventory-system",
      title: "Inventory System",
      description: "Complete inventory management system with drag-and-drop and item stacking.",
      priceCents: 2199,
      images: JSON.stringify(["/uploads/placeholder-product-6.png"]),
      categories: JSON.stringify(["UI", "Gameplay"]),
      tags: JSON.stringify(["Inventory", "UI", "Gameplay"]),
      status: "PUBLISHED",
    },
  ];

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    });
    console.log(`Created product: ${product.title}`);
  }

  // Create demo assets
  const assets = [
    {
      slug: "simple-button-component",
      title: "Simple Button Component",
      description: "A clean, reusable button component for UI elements.\n\nUsage:\n```lua\nlocal Button = require(script.Button)\nButton.new(buttonFrame)\n```",
      version: "1.0.0",
      files: JSON.stringify([
        {
          name: "Button.lua",
          url: "/uploads/Button.lua",
          size: 2048,
          ext: ".lua",
          sha256: "abc123",
        },
      ]),
      categories: JSON.stringify(["UI"]),
      tags: JSON.stringify(["UI", "Component", "Button"]),
      license: "MIT",
      status: "PUBLISHED",
      downloadCount: 42,
    },
    {
      slug: "npc-patrol-script",
      title: "NPC Patrol Script",
      description: "Basic NPC patrol script that makes NPCs walk between waypoints.\n\nFeatures:\n- Configurable waypoints\n- Smooth movement\n- Idle animations",
      version: "1.2.0",
      files: JSON.stringify([
        {
          name: "Patrol.lua",
          url: "/uploads/Patrol.lua",
          size: 4096,
          ext: ".lua",
          sha256: "def456",
        },
      ]),
      categories: JSON.stringify(["NPC"]),
      tags: JSON.stringify(["NPC", "AI", "Movement"]),
      license: "MIT",
      status: "PUBLISHED",
      downloadCount: 89,
    },
    {
      slug: "damage-number-display",
      title: "Damage Number Display",
      description: "Display floating damage numbers above characters when they take damage.",
      version: "2.0.0",
      files: JSON.stringify([
        {
          name: "DamageDisplay.lua",
          url: "/uploads/DamageDisplay.lua",
          size: 3072,
          ext: ".lua",
          sha256: "ghi789",
        },
      ]),
      categories: JSON.stringify(["Combat", "UI"]),
      tags: JSON.stringify(["Combat", "UI", "Visual"]),
      license: "MIT",
      status: "PUBLISHED",
      downloadCount: 156,
    },
    {
      slug: "grid-snap-tool",
      title: "Grid Snap Tool",
      description: "Snap parts to a grid for precise building.",
      version: "1.0.0",
      files: JSON.stringify([
        {
          name: "GridSnap.lua",
          url: "/uploads/GridSnap.lua",
          size: 1536,
          ext: ".lua",
          sha256: "jkl012",
        },
      ]),
      categories: JSON.stringify(["Building", "Utility"]),
      tags: JSON.stringify(["Building", "Tool", "Utility"]),
      license: "MIT",
      status: "PUBLISHED",
      downloadCount: 73,
    },
    {
      slug: "player-data-loader",
      title: "Player Data Loader",
      description: "Efficiently load and save player data with error handling.",
      version: "1.1.0",
      files: JSON.stringify([
        {
          name: "DataLoader.lua",
          url: "/uploads/DataLoader.lua",
          size: 5120,
          ext: ".lua",
          sha256: "mno345",
        },
      ]),
      categories: JSON.stringify(["Utility"]),
      tags: JSON.stringify(["Data", "Utility", "Storage"]),
      license: "MIT",
      status: "PUBLISHED",
      downloadCount: 201,
    },
    {
      slug: "health-bar-ui",
      title: "Health Bar UI",
      description: "Animated health bar component with smooth transitions.",
      version: "1.0.0",
      files: JSON.stringify([
        {
          name: "HealthBar.lua",
          url: "/uploads/HealthBar.lua",
          size: 2560,
          ext: ".lua",
          sha256: "pqr678",
        },
      ]),
      categories: JSON.stringify(["UI"]),
      tags: JSON.stringify(["UI", "Health", "Component"]),
      license: "MIT",
      status: "PUBLISHED",
      downloadCount: 134,
    },
    {
      slug: "weapon-switching-system",
      title: "Weapon Switching System",
      description: "Smooth weapon switching system with animations.",
      version: "1.3.0",
      files: JSON.stringify([
        {
          name: "WeaponSwitcher.lua",
          url: "/uploads/WeaponSwitcher.lua",
          size: 6144,
          ext: ".lua",
          sha256: "stu901",
        },
      ]),
      categories: JSON.stringify(["Combat"]),
      tags: JSON.stringify(["Combat", "Weapon", "Gameplay"]),
      license: "MIT",
      status: "PUBLISHED",
      downloadCount: 98,
    },
    {
      slug: "teleport-pad",
      title: "Teleport Pad",
      description: "Interactive teleport pad system for fast travel.",
      version: "1.0.0",
      files: JSON.stringify([
        {
          name: "TeleportPad.lua",
          url: "/uploads/TeleportPad.lua",
          size: 2048,
          ext: ".lua",
          sha256: "vwx234",
        },
      ]),
      categories: JSON.stringify(["Utility", "Gameplay"]),
      tags: JSON.stringify(["Teleport", "Utility", "Gameplay"]),
      license: "MIT",
      status: "PUBLISHED",
      downloadCount: 67,
    },
    {
      slug: "inventory-grid-ui",
      title: "Inventory Grid UI",
      description: "Grid-based inventory UI with item slots and drag functionality.",
      version: "1.0.0",
      files: JSON.stringify([
        {
          name: "InventoryGrid.lua",
          url: "/uploads/InventoryGrid.lua",
          size: 8192,
          ext: ".lua",
          sha256: "yza567",
        },
      ]),
      categories: JSON.stringify(["UI"]),
      tags: JSON.stringify(["UI", "Inventory", "Grid"]),
      license: "MIT",
      status: "PUBLISHED",
      downloadCount: 112,
    },
    {
      slug: "day-night-cycle",
      title: "Day/Night Cycle",
      description: "Dynamic lighting system that cycles between day and night.",
      version: "2.1.0",
      files: JSON.stringify([
        {
          name: "DayNightCycle.lua",
          url: "/uploads/DayNightCycle.lua",
          size: 4096,
          ext: ".lua",
          sha256: "bcd890",
        },
      ]),
      categories: JSON.stringify(["Utility"]),
      tags: JSON.stringify(["Lighting", "Environment", "Utility"]),
      license: "MIT",
      status: "PUBLISHED",
      downloadCount: 145,
    },
  ];

  for (const assetData of assets) {
    const asset = await prisma.asset.upsert({
      where: { slug: assetData.slug },
      update: {},
      create: assetData,
    });
    console.log(`Created asset: ${asset.title}`);
  }

  // Create site settings
  const settings = await prisma.siteSettings.upsert({
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
        discord: "https://discord.gg/example",
        whatsapp: "https://wa.me/1234567890",
        youtube: "https://youtube.com/@example",
        x: "https://x.com/example",
      }),
      primaryColor: "#2563EB",
    },
  });
  console.log("Created site settings");

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
