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
  console.log('✅ Created admin user:', admin.email)

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
        discord: 'https://discord.gg/example',
        whatsapp: 'https://wa.me/1234567890',
        youtube: 'https://youtube.com/@example',
        x: 'https://x.com/example',
      }),
      primaryColor: '#2563EB',
      featuredProductIds: JSON.stringify([]),
      featuredAssetIds: JSON.stringify([]),
    },
  })
  console.log('✅ Created site settings')

  // Create 6 demo products
  const products = [
    {
      slug: 'advanced-combat-system',
      title: 'Advanced Combat System',
      description: `# Advanced Combat System

A fully-featured combat system with combos, special moves, and health management.

## Features
- Combo system with 5+ moves
- Health and stamina bars
- Block and parry mechanics
- Customizable damage values
- Mobile-friendly controls

Perfect for action games and RPGs!`,
      priceCents: 1499,
      images: JSON.stringify([
        '/uploads/demo/combat-1.jpg',
        '/uploads/demo/combat-2.jpg',
      ]),
      robloxAssetId: '12345678',
      categories: JSON.stringify(['Combat', 'Gameplay']),
      tags: JSON.stringify(['combat', 'pvp', 'rpg', 'action']),
      status: 'PUBLISHED' as const,
    },
    {
      slug: 'ui-kit-modern',
      title: 'Modern UI Kit',
      description: `# Modern UI Kit

Beautiful, responsive UI components for your Roblox game.

## Includes
- 20+ pre-built screens
- Animated transitions
- Mobile responsive
- Easy to customize
- Documentation included`,
      priceCents: 999,
      images: JSON.stringify([
        '/uploads/demo/ui-1.jpg',
        '/uploads/demo/ui-2.jpg',
      ]),
      robloxAssetId: '12345679',
      categories: JSON.stringify(['UI', 'Design']),
      tags: JSON.stringify(['ui', 'interface', 'modern', 'responsive']),
      status: 'PUBLISHED' as const,
    },
    {
      slug: 'inventory-system-pro',
      title: 'Inventory System Pro',
      description: `# Inventory System Pro

Professional inventory management with drag-and-drop.

## Features
- Drag and drop items
- Item stacking
- Custom slots
- Save/load system
- Equip system`,
      priceCents: 1299,
      images: JSON.stringify(['/uploads/demo/inventory-1.jpg']),
      robloxAssetId: '12345680',
      categories: JSON.stringify(['Gameplay', 'Systems']),
      tags: JSON.stringify(['inventory', 'items', 'storage', 'rpg']),
      status: 'PUBLISHED' as const,
    },
    {
      slug: 'admin-commands-suite',
      title: 'Admin Commands Suite',
      description: `# Admin Commands Suite

Complete admin panel with 50+ commands.

## Commands Include
- Player management
- Server controls
- Game moderation
- Permissions system
- Command logs`,
      priceCents: 1999,
      images: JSON.stringify(['/uploads/demo/admin-1.jpg']),
      robloxAssetId: '12345681',
      categories: JSON.stringify(['Admin', 'Moderation']),
      tags: JSON.stringify(['admin', 'commands', 'moderation', 'management']),
      status: 'PUBLISHED' as const,
    },
    {
      slug: 'pet-system-complete',
      title: 'Complete Pet System',
      description: `# Complete Pet System

Collect, upgrade, and battle with pets!

## Features
- 10 unique pets included
- Leveling system
- Pet abilities
- Following AI
- Customization options`,
      priceCents: 1799,
      images: JSON.stringify(['/uploads/demo/pet-1.jpg']),
      robloxAssetId: '12345682',
      categories: JSON.stringify(['Gameplay', 'Pets']),
      tags: JSON.stringify(['pets', 'companions', 'rpg', 'collecting']),
      status: 'PUBLISHED' as const,
    },
    {
      slug: 'weather-system-realistic',
      title: 'Realistic Weather System',
      description: `# Realistic Weather System

Dynamic weather with rain, snow, fog, and more.

## Features
- 7 weather types
- Smooth transitions
- Performance optimized
- Customizable settings
- Day/night cycle integration`,
      priceCents: 899,
      images: JSON.stringify(['/uploads/demo/weather-1.jpg']),
      robloxAssetId: '12345683',
      categories: JSON.stringify(['Environment', 'Effects']),
      tags: JSON.stringify(['weather', 'atmosphere', 'effects', 'immersion']),
      status: 'PUBLISHED' as const,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }
  console.log('✅ Created 6 demo products')

  // Create 10 demo assets
  const assets = [
    {
      slug: 'simple-health-bar',
      title: 'Simple Health Bar UI',
      description: `# Simple Health Bar UI

A clean, customizable health bar for your game.

## Features
- Smooth animations
- Easy to integrate
- Multiple color schemes
- Mobile-friendly

\`\`\`lua
-- Example usage
local HealthBar = require(script.HealthBar)
HealthBar:SetHealth(75)
\`\`\``,
      version: '1.0.0',
      categories: JSON.stringify(['UI']),
      tags: JSON.stringify(['ui', 'health', 'hud', 'interface']),
      license: 'MIT',
      status: 'PUBLISHED' as const,
      downloadCount: 245,
    },
    {
      slug: 'npc-pathfinding-ai',
      title: 'NPC Pathfinding AI',
      description: `# NPC Pathfinding AI

Smart NPC movement with obstacle avoidance.

## Usage
Drop into your NPC model and configure waypoints.

\`\`\`lua
local PathfindingAI = require(script.PathfindingAI)
PathfindingAI:MoveTo(targetPosition)
\`\`\``,
      version: '2.1.0',
      categories: JSON.stringify(['NPC']),
      tags: JSON.stringify(['npc', 'ai', 'pathfinding', 'movement']),
      license: 'MIT',
      status: 'PUBLISHED' as const,
      downloadCount: 512,
    },
    {
      slug: 'coin-collect-system',
      title: 'Coin Collection System',
      description: `# Coin Collection System

Simple coin collection with particle effects.

## Features
- Touch to collect
- Particle effects
- Sound effects
- Leaderboard integration`,
      version: '1.2.0',
      categories: JSON.stringify(['Utility']),
      tags: JSON.stringify(['coins', 'collectibles', 'currency', 'effects']),
      license: 'MIT',
      status: 'PUBLISHED' as const,
      downloadCount: 389,
    },
    {
      slug: 'door-system-advanced',
      title: 'Advanced Door System',
      description: `# Advanced Door System

Doors with permissions, keys, and animations.

## Features
- Smooth animations
- Key/badge access
- Team restrictions
- Sound effects`,
      version: '1.0.0',
      categories: JSON.stringify(['Building']),
      tags: JSON.stringify(['doors', 'building', 'access', 'security']),
      license: 'MIT',
      status: 'PUBLISHED' as const,
      downloadCount: 178,
    },
    {
      slug: 'combat-damage-system',
      title: 'Combat Damage System',
      description: `# Combat Damage System

Flexible damage calculation system.

## Features
- Critical hits
- Damage types
- Armor calculation
- Hit markers`,
      version: '3.0.0',
      categories: JSON.stringify(['Combat']),
      tags: JSON.stringify(['combat', 'damage', 'pvp', 'fighting']),
      license: 'MIT',
      status: 'PUBLISHED' as const,
      downloadCount: 673,
    },
    {
      slug: 'teleport-pads',
      title: 'Teleport Pads',
      description: `# Teleport Pads

Customizable teleport pads for easy navigation.

## Setup
1. Place two pads
2. Set matching IDs
3. Done!`,
      version: '1.1.0',
      categories: JSON.stringify(['Utility']),
      tags: JSON.stringify(['teleport', 'transport', 'utility', 'navigation']),
      license: 'MIT',
      status: 'PUBLISHED' as const,
      downloadCount: 421,
    },
    {
      slug: 'notification-system',
      title: 'Notification System',
      description: `# Notification System

Show beautiful notifications to players.

\`\`\`lua
NotificationSystem:Show("Achievement Unlocked!", "success")
\`\`\``,
      version: '2.0.0',
      categories: JSON.stringify(['UI']),
      tags: JSON.stringify(['ui', 'notifications', 'alerts', 'messages']),
      license: 'MIT',
      status: 'PUBLISHED' as const,
      downloadCount: 556,
    },
    {
      slug: 'zone-detection-script',
      title: 'Zone Detection Script',
      description: `# Zone Detection Script

Detect when players enter/exit zones.

## Events
- PlayerEntered
- PlayerLeft
- GetPlayersInZone()`,
      version: '1.0.0',
      categories: JSON.stringify(['Utility']),
      tags: JSON.stringify(['zones', 'detection', 'regions', 'triggers']),
      license: 'MIT',
      status: 'PUBLISHED' as const,
      downloadCount: 298,
    },
    {
      slug: 'weapon-tool-template',
      title: 'Weapon Tool Template',
      description: `# Weapon Tool Template

Template for creating custom weapons.

## Includes
- Equip/unequip
- Damage system
- Cooldown
- Effects`,
      version: '1.3.0',
      categories: JSON.stringify(['Combat']),
      tags: JSON.stringify(['weapons', 'tools', 'combat', 'template']),
      license: 'MIT',
      status: 'PUBLISHED' as const,
      downloadCount: 734,
    },
    {
      slug: 'data-save-module',
      title: 'Data Save Module',
      description: `# Data Save Module

Reliable data saving with auto-retry.

## Features
- Auto-save
- Retry on failure
- Data validation
- Session locking`,
      version: '4.2.0',
      categories: JSON.stringify(['Utility']),
      tags: JSON.stringify(['data', 'saving', 'persistence', 'storage']),
      license: 'MIT',
      status: 'PUBLISHED' as const,
      downloadCount: 891,
    },
  ]

  const createdAssets = []
  for (const asset of assets) {
    const created = await prisma.asset.upsert({
      where: { slug: asset.slug },
      update: {},
      create: asset,
    })
    createdAssets.push(created)

    // Add a demo file for each asset
    await prisma.fileRef.create({
      data: {
        url: `/uploads/demo/${asset.slug}.lua`,
        name: `${asset.slug}.lua`,
        ext: '.lua',
        size: Math.floor(Math.random() * 50000) + 5000,
        sha256: 'demo-sha256-' + Math.random().toString(36).substring(7),
        assetId: created.id,
      },
    })
  }
  console.log('✅ Created 10 demo assets with files')

  // Update site settings with featured items
  const featuredProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
  })
  const featuredAssets = await prisma.asset.findMany({
    take: 6,
    orderBy: { downloadCount: 'desc' },
  })

  await prisma.siteSettings.update({
    where: { id: 'singleton' },
    data: {
      featuredProductIds: JSON.stringify(
        featuredProducts.map((p) => p.id)
      ),
      featuredAssetIds: JSON.stringify(featuredAssets.map((a) => a.id)),
    },
  })
  console.log('✅ Updated featured items')

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
