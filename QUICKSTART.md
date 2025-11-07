# Quick Start Guide

Get your Roblox Studio Community platform running in 5 minutes!

## ⚡ Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up database
npx prisma generate
npx prisma db push
npm run seed

# 3. Start development server
npm run dev
```

Visit **http://localhost:3000**

## 🔐 Login

**Admin Account:**
- Email: `admin@site.test`
- Password: `Admin123!`

## 📍 Key Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/store` | Product catalog |
| `/store/[slug]` | Product details |
| `/assets` | Free assets catalog |
| `/assets/[slug]` | Asset details with download |
| `/login` | Authentication |
| `/admin` | Admin dashboard (requires login) |
| `/admin/products` | Manage products |
| `/admin/assets` | Manage assets |
| `/admin/settings` | Site configuration |
| `/admin/users` | User management |
| `/admin/audit` | Activity log |

## 🎯 Test Features

1. **Browse Store** - Visit `/store` to see products
2. **Download Asset** - Go to `/assets`, click any asset, download a file
3. **Admin Panel** - Login and visit `/admin` to manage content
4. **Create Product** - In admin, add a new product
5. **Update Settings** - Change site name and social links

## 🛠️ Common Tasks

### Add a New Product
1. Login as admin
2. Go to `/admin/products`
3. Click "Add Product"
4. Fill in details and save

### Add a New Asset
1. Login as admin
2. Go to `/admin/assets`
3. Click "Add Asset"
4. Fill in details and save

### Change Site Settings
1. Login as admin
2. Go to `/admin/settings`
3. Update site name, hero text, or social links
4. Save changes

## 🧪 Testing

```bash
# Run all tests
npm test

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 📦 Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Troubleshooting

**Database Issues:**
```bash
# Reset database
rm prisma/dev.db
npx prisma db push
npm run seed
```

**Port Already in Use:**
```bash
# Change port in package.json dev script:
"dev": "next dev -p 3001"
```

**Missing Dependencies:**
```bash
npm install
```

## 📚 Learn More

- See `README.md` for full documentation
- Check `prisma/schema.prisma` for database schema
- Explore `app/` directory for pages and API routes

## 🎉 You're Ready!

Your Roblox Studio Community platform is now running. Start customizing and building!
