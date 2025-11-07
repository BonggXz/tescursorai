import { hashPassword } from "../lib/password";
import { prisma } from "../lib/prisma";

const ADMIN_EMAIL = "admin@site.test";
const ADMIN_PASSWORD = "Admin123!";

async function main() {
  const passwordHash = await hashPassword(ADMIN_PASSWORD);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "ADMIN" },
    create: {
      email: ADMIN_EMAIL,
      name: "Site Admin",
      role: "ADMIN",
      passwordHash,
    },
  });

  console.log(`✅ Admin ready: ${admin.email} / ${ADMIN_PASSWORD}`);

  const productsData = [
    {
      slug: "starter-studio-kit",
      title: "Starter Studio Kit",
      description:
        "Kickstart your Roblox studio workflow with reusable templates, modular scripts, and polished UI components.",
      priceCents: 1900,
      images: JSON.stringify([
        "/uploads/products/starter-kit-1.png",
        "/uploads/products/starter-kit-2.png",
      ]),
      categories: JSON.stringify(["Starter", "Templates"]),
      tags: JSON.stringify(["ui", "workflow", "templates"]),
      status: "PUBLISHED" as const,
    },
    {
      slug: "action-combat-pack",
      title: "Action Combat Pack",
      description:
        "Highly tunable melee and ranged combat system with hit detection, VFX hooks, and enemy AI stubs.",
      priceCents: 3200,
      images: JSON.stringify([
        "/uploads/products/combat-pack-1.png",
        "/uploads/products/combat-pack-2.png",
      ]),
      categories: JSON.stringify(["Combat"]),
      tags: JSON.stringify(["combat", "npc", "ai"]),
      status: "PUBLISHED" as const,
    },
    {
      slug: "economy-pro-bundle",
      title: "Economy Pro Bundle",
      description:
        "Complete economy system with shops, currencies, leaderboards, and telemetry-ready analytics.",
      priceCents: 4500,
      images: JSON.stringify([
        "/uploads/products/economy-1.png",
        "/uploads/products/economy-2.png",
      ]),
      categories: JSON.stringify(["Systems"]),
      tags: JSON.stringify(["economy", "data", "analytics"]),
      status: "PUBLISHED" as const,
    },
    {
      slug: "sci-fi-ui-suite",
      title: "Sci-Fi UI Suite",
      description:
        "Responsive, controller-friendly UI kit with holographic visuals, toast notifications, and modals.",
      priceCents: 2600,
      images: JSON.stringify([
        "/uploads/products/scifi-ui-1.png",
        "/uploads/products/scifi-ui-2.png",
      ]),
      categories: JSON.stringify(["UI"]),
      tags: JSON.stringify(["ui", "theme", "responsive"]),
      status: "PUBLISHED" as const,
    },
    {
      slug: "open-world-tools-pack",
      title: "Open World Tools Pack",
      description:
        "Terraforming brushes, building prefabs, and density-optimized foliage tools for open world projects.",
      priceCents: 3800,
      images: JSON.stringify([
        "/uploads/products/openworld-1.png",
        "/uploads/products/openworld-2.png",
      ]),
      categories: JSON.stringify(["Building"]),
      tags: JSON.stringify(["building", "environment"]),
      status: "PUBLISHED" as const,
    },
    {
      slug: "creator-automation-suite",
      title: "Creator Automation Suite",
      description:
        "CI-ready automation scripts for asset publishing, QA reporting, and localization syncing.",
      priceCents: 5200,
      images: JSON.stringify([
        "/uploads/products/automation-1.png",
        "/uploads/products/automation-2.png",
      ]),
      categories: JSON.stringify(["Automation"]),
      tags: JSON.stringify(["automation", "devops"]),
      status: "PUBLISHED" as const,
    },
  ];

  const productIds: string[] = [];

  for (const product of productsData) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });

    productIds.push(created.id);
  }

  const assetsData = [
    {
      slug: "utility-task-runner",
      title: "Utility Task Runner",
      description:
        "MDX description for utility task runner.\n\n```lua\nprint(\"Task Runner Ready\")\n```",
      version: "1.0.0",
      categories: JSON.stringify(["Utility"]),
      tags: JSON.stringify(["utility", "automation"]),
      license: "MIT",
      status: "PUBLISHED" as const,
      files: [
        {
          name: "task-runner.lua",
          url: "/uploads/assets/task-runner.lua",
          ext: ".lua",
          size: 4096,
          sha256:
            "802c419ce24a8ef2bb5aa2f99b1d2a3c7c9dc8a74dcbcb7658b7d5b3630d4f1f",
        },
      ],
    },
    {
      slug: "npc-behavior-suite",
      title: "NPC Behavior Suite",
      description:
        "Composable behavior trees for adversaries, civilians, and followers.\n\n- Patrol routes\n- Combat engagement\n- Dialogue triggers",
      categories: JSON.stringify(["NPC"]),
      tags: JSON.stringify(["npc", "ai"]),
      license: "MIT",
      status: "PUBLISHED" as const,
      files: [
        {
          name: "npc-suite.rbxm",
          url: "/uploads/assets/npc-suite.rbxm",
          ext: ".rbxm",
          size: 128000,
          sha256:
            "eac87c08743808448076a6fb5c01d5f645dd5bb58ee8152ef749398a422d66b2",
        },
      ],
    },
    {
      slug: "combat-animations-pack",
      title: "Combat Animations Pack",
      description:
        "Hand-crafted melee combat animations and state machine scripts ready to drop into your projects.",
      categories: JSON.stringify(["Combat"]),
      tags: JSON.stringify(["combat", "animation"]),
      license: "CC-BY-4.0",
      status: "PUBLISHED" as const,
      files: [
        {
          name: "combat-pack.rbxm",
          url: "/uploads/assets/combat-pack.rbxm",
          ext: ".rbxm",
          size: 98000,
          sha256:
            "9f3a847a5c2d04c2565aab74160febbcb35df8ae152dc04e8ebba07e3f77bb8a",
        },
      ],
    },
    {
      slug: "creator-analytics-template",
      title: "Creator Analytics Template",
      description:
        "Telemetry dashboards with pre-built widgets and data-layer scripts for DataStores.",
      categories: JSON.stringify(["Utility"]),
      tags: JSON.stringify(["analytics", "data"]),
      license: "Apache-2.0",
      status: "PUBLISHED" as const,
      files: [
        {
          name: "analytics-template.rbxm",
          url: "/uploads/assets/analytics-template.rbxm",
          ext: ".rbxm",
          size: 76000,
          sha256:
            "12aa4ddaa40302f7c8ab6d4fe26d6c40e3dc7d4a4fb4f5c7bff60c11b42a7c47",
        },
      ],
    },
    {
      slug: "sci-fi-interface-drops",
      title: "Sci-Fi Interface Drops",
      description:
        "Free sci-fi inspired HUD elements with gradient overlays and responsive layout examples.",
      categories: JSON.stringify(["UI"]),
      tags: JSON.stringify(["ui", "theme"]),
      license: "MIT",
      status: "PUBLISHED" as const,
      files: [
        {
          name: "scifi-ui.rbxm",
          url: "/uploads/assets/scifi-ui.rbxm",
          ext: ".rbxm",
          size: 65000,
          sha256:
            "b44e4ba6a3b61631104e0c44d26b0eb6532acbd940b2d795cdf0f99dcfae0c30",
        },
      ],
    },
    {
      slug: "open-world-props-pack",
      title: "Open World Props Pack",
      description:
        "Large library of optimized props and modular structures for expansive maps.",
      categories: JSON.stringify(["Building"]),
      tags: JSON.stringify(["building", "environment"]),
      license: "CC0-1.0",
      status: "PUBLISHED" as const,
      files: [
        {
          name: "openworld-props.rbxm",
          url: "/uploads/assets/openworld-props.rbxm",
          ext: ".rbxm",
          size: 210000,
          sha256:
            "29ab82d8c0eeb274a89d0b82da2206c191bd4b6f1571318dd43259c59eaeedc4",
        },
      ],
    },
    {
      slug: "voice-chat-controller",
      title: "Voice Chat Controller",
      description:
        "Voice chat moderation scripts with UI overlays and fallback chat system.",
      categories: JSON.stringify(["Utility"]),
      tags: JSON.stringify(["voice", "chat"]),
      license: "MIT",
      status: "PUBLISHED" as const,
      files: [
        {
          name: "voice-controller.lua",
          url: "/uploads/assets/voice-controller.lua",
          ext: ".lua",
          size: 5400,
          sha256:
            "a85c9a1f0576b3df14ab1b7cb74db34608bc78ce2b2393e080b8bd0f455df1c3",
        },
      ],
    },
    {
      slug: "weather-system-lite",
      title: "Weather System Lite",
      description:
        "Scripted weather events with lightning triggers, dynamic fog, and wind zones.",
      categories: JSON.stringify(["Utility"]),
      tags: JSON.stringify(["weather", "environment"]),
      license: "MIT",
      status: "PUBLISHED" as const,
      files: [
        {
          name: "weather-system.lua",
          url: "/uploads/assets/weather-system.lua",
          ext: ".lua",
          size: 8600,
          sha256:
            "bc7a9bbf941592ba9625ede1bfa4b5d3a59d56300bcf4d4f1c5c2d2b4cd5a391",
        },
      ],
    },
    {
      slug: "pvp-scoreboard-ui",
      title: "PvP Scoreboard UI",
      description:
        "Responsive scoreboard with team balancing logic and match history storage.",
      categories: JSON.stringify(["UI"]),
      tags: JSON.stringify(["ui", "scoreboard"]),
      license: "MIT",
      status: "PUBLISHED" as const,
      files: [
        {
          name: "pvp-scoreboard.rbxm",
          url: "/uploads/assets/pvp-scoreboard.rbxm",
          ext: ".rbxm",
          size: 49500,
          sha256:
            "f68ed5c5d5cdb2a4b0c7e9e2e5153a1a1ea0a9d4f5b82f30f5a5a93c76dcb74c",
        },
      ],
    },
    {
      slug: "community-badge-pack",
      title: "Community Badge Pack",
      description:
        "Set of creator achievement badges with vector sources for customization.",
      categories: JSON.stringify(["UI"]),
      tags: JSON.stringify(["badge", "marketing"]),
      license: "MIT",
      status: "PUBLISHED" as const,
      files: [
        {
          name: "badge-pack.zip",
          url: "/uploads/assets/badge-pack.zip",
          ext: ".zip",
          size: 12500,
          sha256:
            "6bbd378a16733d49b5b1b2e9ac4f4f4a203594beeb7c4fda1113215fe7c7259e",
        },
      ],
    },
  ];

  const assetIds: string[] = [];

  for (const asset of assetsData) {
    const created = await prisma.asset.upsert({
      where: { slug: asset.slug },
      update: {
        ...asset,
        files: {
          deleteMany: {},
          create: asset.files,
        },
      },
      create: {
        ...asset,
        files: {
          create: asset.files,
        },
      },
    });

    assetIds.push(created.id);
  }

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      featuredProductIds: JSON.stringify(productIds.slice(0, 4)),
      featuredAssetIds: JSON.stringify(assetIds.slice(0, 6)),
      socials: JSON.stringify({
        discord: "https://discord.gg/roblox-community",
        whatsapp: "https://chat.whatsapp.com/example",
        youtube: "https://youtube.com/@robloxcommunity",
        x: "https://x.com/robloxcommunity",
      }),
    },
    create: {
      featuredProductIds: JSON.stringify(productIds.slice(0, 4)),
      featuredAssetIds: JSON.stringify(assetIds.slice(0, 6)),
      socials: JSON.stringify({
        discord: "https://discord.gg/roblox-community",
        whatsapp: "https://chat.whatsapp.com/example",
        youtube: "https://youtube.com/@robloxcommunity",
        x: "https://x.com/robloxcommunity",
      }),
    },
  });

  console.log("✅ Seed data created.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
