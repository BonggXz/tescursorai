# Roblox Studio Community - 3-in-1 Web Platform

A modern, production-ready full-stack web application for the Roblox Studio community featuring:

- **Landing Page** - Modern homepage with hero section, features, and dynamic content
- **Store** - E-commerce platform for premium Roblox products
- **Assets Hub** - Free downloadable assets and scripts with rate-limited downloads
- **Admin Panel** - Comprehensive management dashboard with RBAC

## 🚀 Tech Stack

### Core
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Authentication**: NextAuth.js with Credentials provider
- **Password Hashing**: bcryptjs
- **Validation**: Zod

### Features
- **File Uploads**: Local storage (dev), S3-ready (prod)
- **Downloads**: Rate-limited API with tracking
- **Security**: RBAC middleware, CSRF protection, input validation
- **Audit Trail**: Full activity logging for admin actions

### Development
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky (pre-commit lint & typecheck)

## 📦 Project Structure

```
/workspace
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel (protected)
│   │   ├── products/      # Product management
│   │   ├── assets/        # Asset management
│   │   ├── settings/      # Site configuration
│   │   ├── users/         # User management
│   │   └── audit/         # Audit log
│   ├── assets/            # Public assets catalog
│   ├── store/             # Product store
│   ├── login/             # Authentication
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── upload/        # File upload handler
│   │   └── admin/         # Admin API endpoints
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Site header
│   └── providers.tsx     # Context providers
├── lib/                  # Utilities & config
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Prisma client
│   ├── utils.ts         # Helper functions
│   └── validations.ts   # Zod schemas
├── prisma/              # Database
│   ├── schema.prisma    # Database schema
│   ├── seed.ts          # Seed script
│   └── dev.db           # SQLite database (dev)
├── public/              # Static assets
│   └── uploads/         # File uploads directory
├── tests/               # Test files
│   ├── setup.ts         # Test configuration
│   ├── utils.test.ts    # Unit tests
│   └── components/      # Component tests
├── middleware.ts        # Next.js middleware (RBAC)
└── package.json         # Dependencies & scripts
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- Git

### 1. Clone & Install

```bash
cd /workspace
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Upload directory (for local dev)
UPLOAD_DIR="./public/uploads"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with demo data
npm run seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit **http://localhost:3000**

## 🔑 Demo Credentials

After seeding, use these credentials to login:

- **Email**: `admin@site.test`
- **Password**: `Admin123!`

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm test` | Run Vitest tests |
| `npm run seed` | Seed database with demo data |

## 🗄️ Database Schema

### Key Models

- **User** - User accounts with role-based access (USER, ADMIN)
- **Product** - Store products with pricing, images, tags
- **Asset** - Free downloadable assets with version tracking
- **FileRef** - File metadata with SHA-256 hashes
- **SiteSettings** - Singleton for site configuration
- **Download** - Download tracking with rate limiting
- **AuditEvent** - Admin action audit trail

### Schema Migrations

```bash
# Create migration
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy
```

## 🔐 Security Features

### Authentication & Authorization
- NextAuth with secure credential provider
- bcrypt password hashing (10 rounds)
- JWT session management
- Role-based access control (RBAC)
- Protected admin routes via middleware

### Input Validation
- Zod schemas for all forms
- Server-side validation on all mutations
- File type & size validation
- Slug format validation

### File Upload Security
- Whitelist file extensions: `.lua`, `.rbxm`, `.rbxmx`, `.png`, `.jpg`, `.webp`
- 25MB file size limit
- SHA-256 hash computation
- Unique filename generation

### Rate Limiting
- Download endpoint: 20 requests/minute per IP
- In-memory tracking (use Redis in production)

### Headers & CSRF
- Next.js middleware for route protection
- Origin validation on mutations
- Secure cookie settings

## 🎨 UI Components

Built with **shadcn/ui** for consistency:

- Button, Input, Textarea, Label
- Card, Badge, Dialog, Tabs
- Select, Form (React Hook Form integration)
- Toast notifications
- Responsive layouts

## 📊 Admin Panel Features

### Dashboard
- KPIs: Total products, assets, downloads, users
- Recent activity feed
- 7-day download trends

### Products Management
- CRUD operations
- Rich text descriptions (Markdown)
- Category & tag management
- Status workflow (Draft → Published → Archived)
- Roblox Asset ID linking

### Assets Management
- CRUD operations
- MDX support for documentation
- File upload with metadata
- Version tracking
- License management
- Download statistics

### Settings
- Site branding (name, logo, hero copy)
- Social media links (Discord, WhatsApp, YouTube, X)
- Featured products & assets
- Primary color customization

### Users
- User list with roles
- Promote/demote functionality
- Account creation date

### Audit Log
- Complete action history
- Actor tracking
- Entity & action details
- JSON diff storage

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Coverage

- **Unit Tests**: Utility functions (formatting, parsing, slugify)
- **Component Tests**: UI component behavior
- **Integration Tests**: Ready to add API & auth flows

### Test Configuration

- **Framework**: Vitest
- **Library**: React Testing Library
- **Environment**: jsdom
- **Mocks**: Next.js navigation, NextAuth

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables (Production)

Update `.env` for production:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_SECRET="<generate-strong-secret>"
NEXTAUTH_URL="https://yourdomain.com"
UPLOAD_DIR="/var/uploads" # Or S3 bucket path
```

### Deployment Platforms

**Recommended**:
- **Vercel** (optimal for Next.js)
- **Railway** (easy Postgres + deployment)
- **DigitalOcean App Platform**

**Database**:
- Switch from SQLite to PostgreSQL in production
- Update Prisma schema datasource provider

**File Storage**:
- Implement S3 adapter in upload API
- Update file serving to use CDN URLs

### Pre-deployment Checklist

- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Configure PostgreSQL database
- [ ] Set up S3 or cloud storage
- [ ] Enable HTTPS
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Seed initial admin user
- [ ] Test authentication flow
- [ ] Verify file uploads/downloads
- [ ] Check rate limiting
- [ ] Review security headers

## 🔧 Customization

### Branding

1. Update site name in `/app/admin/settings`
2. Replace logo in header component
3. Customize primary color (Tailwind config)

### Add New Categories

Edit seed data in `prisma/seed.ts` and re-run `npm run seed`

### Extend Models

1. Update `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Update TypeScript types
4. Add new admin pages

## 📄 License

This project is provided as-is for educational and commercial use.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

- **Discord**: Join our community
- **Issues**: GitHub Issues
- **Docs**: In-code JSDoc comments

## 🎯 Roadmap

- [ ] Stripe payment integration
- [ ] Email notifications
- [ ] Advanced search (Algolia/MeiliSearch)
- [ ] Asset versioning system
- [ ] User profiles & favorites
- [ ] Comments & ratings
- [ ] Analytics dashboard
- [ ] API documentation (Swagger)

---

Built with ❤️ for the Roblox Studio Community
