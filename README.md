# Roblox Studio Community Web App

A production-ready, full-stack web application for a Roblox Studio community that combines a modern landing page, a store for paid items, and a public Assets & Scripts download hub, plus a secure admin panel.

## Features

### Public Pages
- **Landing Page**: Hero section, community highlights, latest products and assets, social links
- **Store**: Product catalog with search, filters, sorting, and pagination
- **Assets Hub**: Free downloads with search, filters, and download tracking

### Admin Panel
- **Dashboard**: KPIs and overview statistics
- **Products Management**: Full CRUD for store products
- **Assets Management**: Full CRUD for free assets
- **Site Settings**: Configure branding, hero content, and social links
- **User Management**: View and manage users, promote to admin
- **Audit Log**: Track all admin actions

## Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui + Lucide React icons
- **Auth**: NextAuth.js (Credentials provider) with bcrypt
- **Database**: Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- **Validation**: Zod schema validation
- **Testing**: Vitest + React Testing Library
- **File Storage**: Local `/public/uploads` (dev), S3-ready (prod)

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
npm run db:push
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Admin Credentials

- **Email**: `admin@site.test`
- **Password**: `Admin123!`

⚠️ **Important**: Change these credentials in production!

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run format` - Format code with Prettier
- `npm run db:push` - Push Prisma schema to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:seed` - Seed database with demo data
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public routes
│   │   ├── store/        # Store pages
│   │   └── assets/       # Assets pages
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── login/             # Login page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── admin/            # Admin-specific components
├── lib/                   # Utility functions
│   ├── auth.ts           # Auth helpers
│   ├── prisma.ts         # Prisma client
│   ├── files.ts          # File handling
│   └── utils.ts          # General utilities
├── prisma/               # Prisma schema and migrations
│   └── seed.ts           # Database seed script
├── public/               # Static files
│   └── uploads/          # Uploaded files (dev)
└── middleware.ts         # Next.js middleware

```

## Environment Variables

### Required

- `DATABASE_URL` - Database connection string
  - SQLite (dev): `file:./dev.db`
  - PostgreSQL (prod): `postgresql://user:password@host:port/database`
- `NEXTAUTH_SECRET` - Secret key for NextAuth.js (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Base URL of your application (e.g., `http://localhost:3000`)

### Optional

- `NODE_ENV` - Environment (`development` or `production`)

## Database Schema

### Models

- **User**: Authentication and authorization
- **Product**: Store products with pricing and metadata
- **Asset**: Free downloadable assets
- **SiteSettings**: Site configuration (singleton)
- **Download**: Download tracking and analytics
- **AuditEvent**: Admin action audit log

See `prisma/schema.prisma` for full schema definition.

## Security Features

- **Authentication**: NextAuth.js with bcrypt password hashing
- **Authorization**: Role-based access control (USER, ADMIN)
- **Rate Limiting**: Download endpoints (20 requests/minute per IP)
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, etc.
- **Input Validation**: Zod schema validation on all API routes
- **File Validation**: File type and size restrictions on uploads
- **Audit Logging**: All admin actions are logged

## File Uploads

### Development
Files are stored in `/public/uploads` directory.

### Production
The upload system is abstracted to allow easy integration with S3 or similar services. Update `lib/files.ts` to use your preferred storage solution.

### Supported File Types
- Images: `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`
- Roblox Assets: `.lua`, `.rbxm`, `.rbxmx`

### File Size Limit
Maximum file size: 25MB

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy!

### Other Platforms

1. Build the application:
```bash
npm run build
```

2. Set environment variables
3. Run migrations:
```bash
npm run db:migrate
```

4. Seed database (optional):
```bash
npm run db:seed
```

5. Start the server:
```bash
npm start
```

### Production Database

For production, use PostgreSQL:

1. Set up a PostgreSQL database (e.g., on Railway, Supabase, or AWS RDS)
2. Update `DATABASE_URL` in environment variables
3. Update `prisma/schema.prisma` datasource provider to `postgresql`
4. Run migrations:
```bash
npm run db:migrate
```

## Testing

Run tests:
```bash
npm run test
```

Run tests with UI:
```bash
npm run test:ui
```

## Code Quality

- **ESLint**: Code linting (Next.js config)
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Husky**: Git hooks (pre-commit linting)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for the Roblox Studio community
