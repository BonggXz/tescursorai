import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@site.test' },
    update: {},
    create: {
      email: 'admin@site.test',
      name: 'Admin User',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create site settings
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      siteName: 'Roblox Studio Community',
      heroTitle: 'Build together. Share faster.',
      heroSubtitle: 'A modern hub for Roblox Studio creators.',
      socials: JSON.stringify({
        discord: 'https://discord.gg/robloxcommunity',
        whatsapp: 'https://wa.me/1234567890',
        youtube: 'https://youtube.com/@robloxcommunity',
        x: 'https://x.com/robloxcommunity',
      }),
      primaryColor: '#2563EB',
    },
  })
  console.log('✅ Site settings created')

  // Create demo products
  const products = [
    {
      slug: 'advanced-ui-kit',
      title: 'Advanced UI Kit Pro',
      description: '**Premium UI system** for Roblox Studio.\n\n- 50+ customizable components\n- Modern design\n- Easy to integrate\n- Full documentation',
      priceCents: 1999,
      images: JSON.stringify(['/uploads/product1.jpg']),
      robloxAssetId: '123456789',
      categories: JSON.stringify(['UI', 'Tools']),
      tags: JSON.stringify(['ui', 'interface', 'premium', 'professional']),
      status: 'PUBLISHED',
    },
    {
      slug: 'npc-ai-system',
      title: 'NPC AI System',
      description: '**Intelligent NPC system** with pathfinding and behavior trees.\n\n- Advanced AI behaviors\n- Customizable personalities\n- Combat & patrol modes\n- Easy setup',
      priceCents: 2499,
      images: JSON.stringify(['/uploads/product2.jpg']),
      robloxAssetId: '987654321',
      categories: JSON.stringify(['AI', 'NPCs']),
      tags: JSON.stringify(['ai', 'npc', 'behavior', 'pathfinding']),
      status: 'PUBLISHED',
    },
    {
      slug: 'building-tools-plus',
      title: 'Building Tools Plus',
      description: '**Enhanced building tools** for creators.\n\n- Advanced placement\n- Grid snapping\n- Rotation helpers\n- Undo/redo system',
      priceCents: 1499,
      images: JSON.stringify(['/uploads/product3.jpg']),
      categories: JSON.stringify(['Building', 'Tools']),
      tags: JSON.stringify(['building', 'tools', 'creation', 'editor']),
      status: 'PUBLISHED',
    },
    {
      slug: 'combat-framework',
      title: 'Combat Framework',
      description: '**Complete combat system** with hitboxes and combos.\n\n- Weapon system\n- Combo chains\n- Hitbox detection\n- Damage calculation',
      priceCents: 2999,
      images: JSON.stringify(['/uploads/product4.jpg']),
      robloxAssetId: '456789123',
      categories: JSON.stringify(['Combat', 'Systems']),
      tags: JSON.stringify(['combat', 'weapons', 'pvp', 'framework']),
      status: 'PUBLISHED',
    },
    {
      slug: 'data-manager-pro',
      title: 'Data Manager Pro',
      description: '**Robust data persistence** system.\n\n- Auto-save\n- Cloud backup\n- Profile service\n- Easy migration',
      priceCents: 1799,
      images: JSON.stringify(['/uploads/product5.jpg']),
      categories: JSON.stringify(['Data', 'Systems']),
      tags: JSON.stringify(['data', 'save', 'persistence', 'cloud']),
      status: 'PUBLISHED',
    },
    {
      slug: 'admin-commands',
      title: 'Admin Commands Suite',
      description: '**Powerful admin panel** for game management.\n\n- 100+ commands\n- Permission system\n- Logs & analytics\n- Custom commands',
      priceCents: 999,
      images: JSON.stringify(['/uploads/product6.jpg']),
      categories: JSON.stringify(['Admin', 'Tools']),
      tags: JSON.stringify(['admin', 'commands', 'moderation', 'management']),
      status: 'PUBLISHED',
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }
  console.log(`✅ Created ${products.length} demo products`)

  // Create demo assets
  const assets = [
    {
      slug: 'simple-health-bar',
      title: 'Simple Health Bar UI',
      description: '# Simple Health Bar\n\nA clean and customizable health bar for your Roblox game.\n\n## Features\n- Smooth animations\n- Color transitions\n- Easy to customize\n- Lightweight\n\n## Usage\n```lua\nlocal HealthBar = require(script.HealthBar)\nHealthBar:SetHealth(75)\n```',
      version: '1.0.0',
      categories: JSON.stringify(['UI', 'Free']),
      tags: JSON.stringify(['ui', 'health', 'hud', 'free']),
      license: 'MIT',
      status: 'PUBLISHED',
      downloadCount: 245,
    },
    {
      slug: 'button-click-sound',
      title: 'Button Click Sound Effect',
      description: '# Button Click Sound\n\nHigh-quality button click sound effect.\n\n## Details\n- Format: MP3\n- Duration: 0.2s\n- Professional quality\n- Royalty-free',
      version: '1.0.0',
      categories: JSON.stringify(['Audio', 'Free']),
      tags: JSON.stringify(['sound', 'sfx', 'button', 'ui']),
      license: 'CC0',
      status: 'PUBLISHED',
      downloadCount: 532,
    },
    {
      slug: 'npc-patrol-script',
      title: 'NPC Patrol Script',
      description: '# NPC Patrol Script\n\nSimple waypoint-based NPC patrol system.\n\n## Features\n- Waypoint following\n- Configurable speed\n- Loop or reverse\n- Easy setup\n\n## Installation\n1. Place script in NPC\n2. Create waypoints folder\n3. Configure settings',
      version: '2.1.0',
      categories: JSON.stringify(['NPC', 'Scripts']),
      tags: JSON.stringify(['npc', 'patrol', 'ai', 'movement']),
      license: 'MIT',
      status: 'PUBLISHED',
      downloadCount: 1203,
    },
    {
      slug: 'coin-pickup-system',
      title: 'Coin Pickup System',
      description: '# Coin Pickup System\n\nComplete coin collection system with animations.\n\n## Features\n- Auto-detection\n- Sound effects\n- Score tracking\n- Particle effects\n\n## Code Example\n```lua\nlocal CoinSystem = require(game.ReplicatedStorage.CoinSystem)\nCoinSystem:AddCoins(player, 10)\n```',
      version: '1.5.0',
      categories: JSON.stringify(['Utility', 'Systems']),
      tags: JSON.stringify(['coins', 'collectibles', 'pickup', 'currency']),
      license: 'MIT',
      status: 'PUBLISHED',
      downloadCount: 892,
    },
    {
      slug: 'day-night-cycle',
      title: 'Day/Night Cycle',
      description: '# Day/Night Cycle\n\nRealistic day and night cycle system.\n\n## Features\n- Smooth transitions\n- Configurable speed\n- Time events\n- Lighting control',
      version: '1.0.0',
      categories: JSON.stringify(['Environment', 'Scripts']),
      tags: JSON.stringify(['lighting', 'time', 'environment', 'atmosphere']),
      license: 'MIT',
      status: 'PUBLISHED',
      downloadCount: 678,
    },
    {
      slug: 'teleport-pads',
      title: 'Teleport Pads',
      description: '# Teleport Pads\n\nSimple teleportation system between pads.\n\n## Setup\n- Place pads in workspace\n- Link source to destination\n- Configure cooldown\n- Add effects',
      version: '1.2.0',
      categories: JSON.stringify(['Utility', 'Building']),
      tags: JSON.stringify(['teleport', 'transport', 'pads', 'utility']),
      license: 'MIT',
      status: 'PUBLISHED',
      downloadCount: 1456,
    },
    {
      slug: 'inventory-system',
      title: 'Basic Inventory System',
      description: '# Inventory System\n\nFlexible inventory management.\n\n## Features\n- Grid-based UI\n- Drag & drop\n- Item stacking\n- Save/load support\n\n```lua\nlocal Inventory = require(script.Inventory)\nInventory:AddItem(player, "Sword", 1)\n```',
      version: '2.0.0',
      categories: JSON.stringify(['UI', 'Systems']),
      tags: JSON.stringify(['inventory', 'items', 'ui', 'storage']),
      license: 'MIT',
      status: 'PUBLISHED',
      downloadCount: 2341,
    },
    {
      slug: 'chat-commands',
      title: 'Chat Commands Framework',
      description: '# Chat Commands\n\nExtensible chat command system.\n\n## Usage\n```lua\nChatCommands:Register("/help", function(player)\n  print("Help requested")\nend)\n```',
      version: '1.3.0',
      categories: JSON.stringify(['Utility', 'Scripts']),
      tags: JSON.stringify(['chat', 'commands', 'utility', 'framework']),
      license: 'MIT',
      status: 'PUBLISHED',
      downloadCount: 567,
    },
    {
      slug: 'loading-screen',
      title: 'Custom Loading Screen',
      description: '# Loading Screen\n\nCustomizable loading screen with progress.\n\n## Features\n- Progress bar\n- Custom branding\n- Tip rotation\n- Smooth fade',
      version: '1.0.0',
      categories: JSON.stringify(['UI', 'Free']),
      tags: JSON.stringify(['loading', 'ui', 'screen', 'startup']),
      license: 'MIT',
      status: 'PUBLISHED',
      downloadCount: 823,
    },
    {
      slug: 'particle-effects-pack',
      title: 'Particle Effects Pack',
      description: '# Particle Effects\n\n10 pre-made particle effects.\n\n## Includes\n- Explosion\n- Magic sparkles\n- Smoke\n- Fire\n- And more!',
      version: '1.1.0',
      categories: JSON.stringify(['Effects', 'Free']),
      tags: JSON.stringify(['particles', 'effects', 'vfx', 'visual']),
      license: 'CC-BY',
      status: 'PUBLISHED',
      downloadCount: 1890,
    },
  ]

  for (const asset of assets) {
    const created = await prisma.asset.upsert({
      where: { slug: asset.slug },
      update: {},
      create: asset,
    })

    // Add a demo file for each asset
    await prisma.fileRef.create({
      data: {
        assetId: created.id,
        url: `/uploads/assets/${asset.slug}.lua`,
        name: `${asset.slug}.lua`,
        ext: '.lua',
        size: 2048,
        sha256: `demo-hash-${asset.slug}`,
      },
    })
  }
  console.log(`✅ Created ${assets.length} demo assets`)

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
