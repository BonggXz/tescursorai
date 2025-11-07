# Roblox Studio Community Web App

A modern, full-stack web application for Roblox Studio creators featuring a landing page, premium store, free assets hub, and comprehensive admin panel.

## 🚀 Features

### Public Features
- **Landing Page**: Modern hero section with dynamic social links and featured content
- **Store**: Browse and purchase premium Roblox assets with search, filter, and sort
- **Assets Hub**: Download free scripts and models with rate-limited downloads
- **Responsive Design**: Mobile-first, modern UI with blue/white theme

### Admin Features
- **Dashboard**: Real-time KPIs and analytics
- **Products Management**: Full CRUD for store products
- **Assets Management**: Full CRUD for free assets with file uploads
- **Settings**: Configure site content and social media links
- **User Management**: View and manage user roles
- **Audit Log**: Track all administrative actions

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Prisma + SQLite (dev) / PostgreSQL (prod)
- **Authentication**: NextAuth with bcrypt
- **Animations**: Framer Motion
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint, Prettier, Husky

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Git

## 🏗️ Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd roblox-studio-community
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# App Config
NODE_ENV="development"
```

4. **Initialize the database**
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

5. **Start the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app!

## 🔑 Default Admin Credentials

After seeding, you can log in with:
- **Email**: admin@site.test
- **Password**: Admin123!

⚠️ **IMPORTANT**: Change these credentials in production!

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler
- `npm test` - Run tests
- `npm run seed` - Seed database with demo data
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create a new migration

## 📁 Project Structure

```
/workspace
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts            # Seed data
├── public/
│   └── uploads/           # File uploads (dev only)
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── admin/        # Admin panel
│   │   ├── api/          # API routes
│   │   ├── assets/       # Assets catalog
│   │   ├── store/        # Store catalog
│   │   └── login/        # Login page
│   ├── components/
│   │   └── ui/           # shadcn/ui components
│   ├── lib/
│   │   ├── auth.ts       # Auth utilities
│   │   ├── db.ts         # Prisma client
│   │   ├── utils.ts      # Helper functions
│   │   └── validations.ts # Zod schemas
│   └── test/             # Test setup
├── .env                   # Environment variables
├── package.json
└── README.md
```

## 🎨 Customization

### Change Brand Colors

Edit `src/app/globals.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Blue-600 */
}
```

Or use the Admin Settings panel to change the primary color.

### Add New Products

1. Log in as admin
2. Navigate to Admin → Products
3. Click "Add Product"
4. Fill in the details and save

### Add New Assets

1. Log in as admin
2. Navigate to Admin → Assets
3. Click "Add Asset"
4. Upload files and save

## 🔒 Security Features

- ✅ Bcrypt password hashing
- ✅ JWT session management
- ✅ RBAC (Role-Based Access Control)
- ✅ Rate limiting on downloads
- ✅ CSRF protection
- ✅ Security headers via middleware
- ✅ Input validation with Zod
- ✅ SQL injection protection (Prisma)
- ✅ Audit logging

## 🚀 Deployment

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_SECRET="<generate-strong-secret>"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"
```

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Database Migration

For production, switch to PostgreSQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Run migrations:
```bash
npx prisma migrate deploy
```

3. Seed production database:
```bash
npm run seed
```

## 📊 Database Schema

### Key Models

- **User**: Authentication and user management
- **Product**: Store products with pricing
- **Asset**: Free downloadable assets
- **FileRef**: File metadata for assets
- **SiteSettings**: Configurable site settings
- **Download**: Download tracking and analytics
- **AuditEvent**: Administrative action logging

See `prisma/schema.prisma` for full schema.

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## 🔧 Troubleshooting

### Database Issues

Reset database:
```bash
rm prisma/dev.db
npx prisma migrate reset
npm run seed
```

### TypeScript Errors

Regenerate Prisma client:
```bash
npx prisma generate
```

### Port Already in Use

Change port:
```bash
PORT=3001 npm run dev
```

## 📚 API Documentation

### Public Endpoints

- `GET /api/products` - List products
- `GET /api/products/[slug]` - Get product details
- `GET /api/assets` - List assets
- `GET /api/assets/[id]/download` - Download asset (rate-limited)

### Admin Endpoints (Require ADMIN role)

- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `POST /api/admin/assets` - Create asset
- `GET /api/admin/settings` - Get settings
- `PUT /api/admin/settings` - Update settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

## 🎯 Roadmap

- [ ] Stripe payment integration
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Asset versioning
- [ ] User reviews and ratings
- [ ] S3 file storage integration

## ⚡ Performance

- Server-side rendering with Next.js
- Optimized images with next/image
- Code splitting and lazy loading
- Database query optimization
- CDN-ready static assets

## 🌟 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [NextAuth](https://next-auth.js.org/)

---

Made with ❤️ for the Roblox Studio community
