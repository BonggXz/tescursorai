import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@site.test" },
    update: {},
    create: {
      email: "admin@site.test",
      name: "Admin User",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log("Created admin user:", admin.email);

  // Create site settings
  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "Roblox Studio Community",
      heroTitle: "Build together. Share faster.",
      heroSubtitle: "A modern hub for Roblox Studio creators.",
      socials: JSON.stringify({
        discord: "https://discord.gg/example",
        whatsapp: "https://wa.me/1234567890",
        youtube: "https://youtube.com/@example",
        x: "https://x.com/example",
      }),
    },
  });
  console.log("Created site settings");

  // Create demo products
  const products = [
    {
      slug: "advanced-ui-framework",
      title: "Advanced UI Framework",
      description: "A comprehensive UI framework for Roblox games with modern components and animations.",
      priceCents: 1999,
      robloxAssetId: "123456789",
      status: "PUBLISHED",
      images: JSON.stringify([]),
      tags: JSON.stringify(["UI", "Framework", "Premium"]),
      categories: JSON.stringify(["UI"]),
    },
    {
      slug: "npc-dialogue-system",
      title: "NPC Dialogue System",
      description: "Interactive dialogue system for NPCs with branching conversations and quest integration.",
      priceCents: 1499,
      status: "PUBLISHED",
      images: JSON.stringify([]),
      tags: JSON.stringify(["NPC", "Dialogue", "Quest"]),
      categories: JSON.stringify(["NPC"]),
    },
    {
      slug: "combat-system-pro",
      title: "Combat System Pro",
      description: "Professional combat system with hit detection, damage calculation, and special abilities.",
      priceCents: 2499,
      status: "PUBLISHED",
      images: JSON.stringify([]),
      tags: JSON.stringify(["Combat", "Gameplay", "Premium"]),
      categories: JSON.stringify(["Combat"]),
    },
    {
      slug: "building-tools-pack",
      title: "Building Tools Pack",
      description: "Essential building tools for Roblox Studio with advanced placement and snapping features.",
      priceCents: 999,
      status: "PUBLISHED",
      images: JSON.stringify([]),
      tags: JSON.stringify(["Building", "Tools", "Utility"]),
      categories: JSON.stringify(["Building"]),
    },
    {
      slug: "data-store-manager",
      title: "Data Store Manager",
      description: "Robust data persistence system with caching, error handling, and retry logic.",
      priceCents: 1799,
      status: "PUBLISHED",
      images: JSON.stringify([]),
      tags: JSON.stringify(["Data", "Storage", "Utility"]),
      categories: JSON.stringify(["Utility"]),
    },
    {
      slug: "inventory-system",
      title: "Inventory System",
      description: "Complete inventory management system with drag-and-drop, stacking, and item categories.",
      priceCents: 2199,
      status: "PUBLISHED",
      images: JSON.stringify([]),
      tags: JSON.stringify(["Inventory", "UI", "Gameplay"]),
      categories: JSON.stringify(["UI", "Gameplay"]),
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log(`Created ${products.length} products`);

  // Create demo assets
  const assets = [
    {
      slug: "utility-helper-functions",
      title: "Utility Helper Functions",
      description: "A collection of commonly used utility functions for Roblox Lua development.\n\n## Features\n- String manipulation\n- Table utilities\n- Math helpers\n- Type checking",
      version: "1.0.0",
      license: "MIT",
      status: "PUBLISHED",
      files: JSON.stringify([]),
      tags: JSON.stringify(["Utility", "Lua", "Helper"]),
      categories: JSON.stringify(["Utility"]),
      downloadCount: 0,
    },
    {
      slug: "simple-ui-button",
      title: "Simple UI Button Component",
      description: "A reusable button component for Roblox UI with hover effects and click animations.",
      version: "1.2.0",
      license: "MIT",
      status: "PUBLISHED",
      files: JSON.stringify([]),
      tags: JSON.stringify(["UI", "Component", "Button"]),
      categories: JSON.stringify(["UI"]),
      downloadCount: 0,
    },
    {
      slug: "basic-npc-controller",
      title: "Basic NPC Controller",
      description: "Simple NPC controller script for pathfinding and basic AI behavior.",
      version: "1.0.0",
      license: "MIT",
      status: "PUBLISHED",
      files: JSON.stringify([]),
      tags: JSON.stringify(["NPC", "AI", "Pathfinding"]),
      categories: JSON.stringify(["NPC"]),
      downloadCount: 0,
    },
    {
      slug: "health-bar-ui",
      title: "Health Bar UI",
      description: "Animated health bar UI component with smooth transitions and customizable styling.",
      version: "2.0.0",
      license: "MIT",
      status: "PUBLISHED",
      files: JSON.stringify([]),
      tags: JSON.stringify(["UI", "Health", "Component"]),
      categories: JSON.stringify(["UI"]),
      downloadCount: 0,
    },
    {
      slug: "simple-combat-damage",
      title: "Simple Combat Damage System",
      description: "Basic damage calculation system for combat mechanics.",
      version: "1.0.0",
      license: "MIT",
      status: "PUBLISHED",
      files: JSON.stringify([]),
      tags: JSON.stringify(["Combat", "Damage", "Gameplay"]),
      categories: JSON.stringify(["Combat"]),
      downloadCount: 0,
    },
    {
      slug: "building-snap-tool",
      title: "Building Snap Tool",
      description: "Snap-to-grid tool for precise building in Roblox Studio.",
      version: "1.1.0",
      license: "MIT",
      status: "PUBLISHED",
      files: JSON.stringify([]),
      tags: JSON.stringify(["Building", "Tools", "Snap"]),
      categories: JSON.stringify(["Building"]),
      downloadCount: 0,
    },
    {
      slug: "player-spawn-system",
      title: "Player Spawn System",
      description: "Configurable player spawning system with spawn point management.",
      version: "1.0.0",
      license: "MIT",
      status: "PUBLISHED",
      files: JSON.stringify([]),
      tags: JSON.stringify(["Spawn", "Player", "Utility"]),
      categories: JSON.stringify(["Utility"]),
      downloadCount: 0,
    },
    {
      slug: "simple-inventory-ui",
      title: "Simple Inventory UI",
      description: "Basic inventory UI with grid layout and item display.",
      version: "1.0.0",
      license: "MIT",
      status: "PUBLISHED",
      files: JSON.stringify([]),
      tags: JSON.stringify(["UI", "Inventory", "Component"]),
      categories: JSON.stringify(["UI"]),
      downloadCount: 0,
    },
    {
      slug: "chat-command-handler",
      title: "Chat Command Handler",
      description: "Simple chat command system for executing game commands.",
      version: "1.0.0",
      license: "MIT",
      status: "PUBLISHED",
      files: JSON.stringify([]),
      tags: JSON.stringify(["Chat", "Commands", "Utility"]),
      categories: JSON.stringify(["Utility"]),
      downloadCount: 0,
    },
    {
      slug: "day-night-cycle",
      title: "Day/Night Cycle",
      description: "Dynamic lighting system that cycles between day and night.",
      version: "1.3.0",
      license: "MIT",
      status: "PUBLISHED",
      files: JSON.stringify([]),
      tags: JSON.stringify(["Lighting", "Environment", "Cycle"]),
      categories: JSON.stringify(["Utility"]),
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
  console.log(`Created ${assets.length} assets`);

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
