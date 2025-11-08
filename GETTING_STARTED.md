# Getting Started - Quick Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Git (optional)

## 🚀 Installation (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

This installs all required packages including Next.js, Prisma, NextAuth, Tailwind CSS, and more.

### 2. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init

# Seed with demo data
npm run seed
```

This creates a SQLite database with:
- 1 admin user
- 6 demo products  
- 10 demo assets
- Configured site settings

### 3. Start Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

## 🔐 Admin Access

Login at **http://localhost:3000/login**

- **Email**: `admin@site.test`
- **Password**: `Admin123!`

## 📱 What You'll See

### Public Pages
- **Home** (`/`) - Landing page with featured products and assets
- **Store** (`/store`) - Browse premium products
- **Assets** (`/assets`) - Download free scripts and models

### Admin Panel (`/admin`)
- **Dashboard** - KPIs and recent activity
- **Products** - Manage store products
- **Assets** - Manage free downloads
- **Settings** - Configure site and social links
- **Users** - View all users
- **Audit** - Track admin actions

## 🎨 Customization

### Change Site Content

1. Login as admin
2. Go to **Settings**
3. Update:
   - Site name
   - Hero title and subtitle
   - Primary color
   - Social media links

### Add Products

1. Go to **Admin → Products**
2. Click **Add Product**
3. Fill in details (title, price, description)
4. Set status to "Published"

### Add Assets

1. Go to **Admin → Assets**  
2. Click **Add Asset**
3. Fill in details and upload files
4. Publish

## 🛠️ Development Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server

# Database
npx prisma studio    # Open database GUI
npx prisma migrate dev --name <name>  # Create new migration
npm run seed         # Re-seed database

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
npm test             # Run tests

# Database Reset (if needed)
rm prisma/dev.db
npx prisma migrate reset
npm run seed
```

## 📁 Project Structure

```
/workspace
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
├── src/
│   ├── app/             # Next.js pages
│   │   ├── admin/       # Admin panel
│   │   ├── api/         # API routes
│   │   ├── assets/      # Assets catalog
│   │   ├── store/       # Store catalog
│   │   └── page.tsx     # Landing page
│   ├── components/      # React components
│   │   └── ui/          # shadcn/ui components
│   └── lib/             # Utilities
├── public/
│   └── uploads/         # File uploads
└── .env                 # Environment variables
```

## 🔍 Explore the Code

### Key Files to Check Out

1. **`src/app/page.tsx`** - Landing page (Server Component)
2. **`src/app/admin/page.tsx`** - Admin dashboard
3. **`src/lib/auth-options.ts`** - NextAuth configuration
4. **`prisma/schema.prisma`** - Database schema
5. **`src/middleware.ts`** - RBAC and security

### Understanding the Flow

**Product Purchase Flow** (when implemented):
```
1. User browses /store
2. Clicks product → /store/[slug]
3. Clicks "Purchase" → Stripe checkout
4. Payment succeeds → Webhook creates order
5. User gets download link
```

**Asset Download Flow**:
```
1. User browses /assets
2. Clicks asset → /assets/[slug]
3. Clicks "Download" → /api/assets/[id]/download
4. Rate limit check (20/min)
5. Download logged → count incremented
6. File download initiated
```

**Admin Product Management**:
```
1. Admin logs in → /login
2. Goes to /admin/products
3. Clicks "Add Product" → /admin/products/new
4. Fills form, submits → API creates product
5. Audit log recorded
6. Redirects to products list
```

## 🎯 Next Steps

### For Developers

1. **Complete File Upload System**
   - Create `/src/app/api/upload/route.ts`
   - Add file upload UI in admin forms
   - Test with actual files

2. **Add Payment Integration**
   - Set up Stripe account
   - Install Stripe SDK
   - Create checkout flow

3. **Write Tests**
   - Auth flows
   - CRUD operations
   - Download functionality

### For Designers

1. **Customize Theme**
   - Edit `src/app/globals.css`
   - Update color scheme
   - Add custom fonts

2. **Add Animations**
   - Use Framer Motion (already installed)
   - Add page transitions
   - Hover effects

3. **Improve UX**
   - Loading states
   - Error messages
   - Success toasts

## 📚 Learn More

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **NextAuth**: https://next-auth.js.org
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
npm install
npx prisma generate
```

### Database errors
```bash
rm prisma/dev.db
npx prisma migrate reset
npm run seed
```

### Port 3000 already in use
```bash
PORT=3001 npm run dev
```

### TypeScript errors
```bash
npm run typecheck
```

## 💬 Get Help

1. Check `README.md` for detailed documentation
2. Review `PROJECT_STATUS.md` for current features
3. See `DEPLOYMENT.md` for deployment guide
4. Check existing issues in the repository

## ✨ Tips

- Use **Prisma Studio** to view/edit database: `npx prisma studio`
- Check **Audit Log** in admin to track all changes
- Use **Download endpoint** with rate limiting for testing
- Customize **Site Settings** in admin panel
- Test with different **user roles** (USER vs ADMIN)

---

**Happy Coding! 🚀**
