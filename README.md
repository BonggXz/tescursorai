# Roblox Studio Community Web App

A production-ready, full-stack web application for a Roblox Studio community featuring a landing page, store, free assets hub, and secure admin panel.

## Features

- **Landing Page**: Modern hero section with featured products and assets
- **Store**: Product catalog with search, filters, sorting, and pagination
- **Assets Hub**: Free downloads of scripts and assets with version tracking
- **Admin Panel**: Complete CRUD for products, assets, settings, users, and audit logs
- **Authentication**: NextAuth with email/password and role-based access control
- **Security**: Rate limiting, CSRF protection, secure headers, file validation
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod) support

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components + Lucide icons
- **Auth**: NextAuth.js v5 (beta) with Credentials provider
- **Database**: Prisma + SQLite (dev) / PostgreSQL (prod)
- **Validation**: Zod
- **Testing**: Vitest + React Testing Library
- **Tooling**: ESLint, Prettier, Husky

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd roblox-community-web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npm run prisma:migrate
npm run prisma:seed
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with demo data
- `npm run prisma:studio` - Open Prisma Studio

## Default Admin Credentials

After seeding:
- Email: `admin@site.test`
- Password: `Admin123!`

**⚠️ Change these in production!**

## Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── (routes)/           # Public routes
│   ├── admin/              # Admin routes (protected)
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   └── admin/              # Admin-specific components
├── lib/                    # Utility functions
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # NextAuth config
│   └── file-utils.ts       # File handling utilities
├── prisma/                 # Prisma schema and migrations
│   └── seed.ts             # Database seed script
└── public/                 # Static assets
    └── uploads/            # Uploaded files
```

## Environment Variables

### Development (.env)
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### Production
For production, update:
- `DATABASE_URL` to your PostgreSQL connection string
- `NEXTAUTH_SECRET` to a strong random secret
- `NEXTAUTH_URL` to your production domain

## Database Schema

- **User**: Authentication and user management
- **Product**: Store products with pricing and metadata
- **Asset**: Free downloadable assets with versioning
- **SiteSettings**: Site configuration (singleton)
- **Download**: Download tracking and analytics
- **AuditEvent**: Admin action audit trail

## API Routes

### Public
- `GET /api/products` - List products (with filters)
- `GET /api/products/[slug]` - Get product by slug
- `GET /api/assets` - List assets (with filters)
- `GET /api/assets/[slug]` - Get asset by slug
- `POST /api/assets/[id]/download` - Download asset (rate-limited)

### Admin (Protected)
- `POST /api/products` - Create product
- `PATCH /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `POST /api/assets` - Create asset
- `PATCH /api/assets/[id]` - Update asset
- `DELETE /api/assets/[id]` - Delete asset
- `POST /api/upload` - Upload file

## Security Features

- **Authentication**: NextAuth with bcrypt password hashing
- **Authorization**: Role-based access control (USER/ADMIN)
- **Rate Limiting**: Download endpoints (20/min per IP)
- **File Validation**: Extension whitelist, size limits (25MB), SHA-256 hashing
- **Security Headers**: HSTS, X-Frame-Options, CSP, etc.
- **Input Validation**: Zod schemas for all API inputs
- **Audit Logging**: All admin actions are logged

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Other Platforms

1. Build the project: `npm run build`
2. Set environment variables
3. Run migrations: `npm run prisma:migrate`
4. Seed (optional): `npm run prisma:seed`
5. Start: `npm start`

### Database Migration

For production PostgreSQL:
```bash
DATABASE_URL="postgresql://..." npm run prisma:migrate deploy
```

## File Uploads

In development, files are stored in `/public/uploads`. For production, you can:

1. Use a cloud storage service (S3, Cloudinary, etc.)
2. Update `lib/file-utils.ts` to use your storage provider
3. Update upload API route accordingly

## Testing

Run tests:
```bash
npm run test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
