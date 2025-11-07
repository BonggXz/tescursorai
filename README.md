# Roblox Studio Community Web App

A production-ready, full-stack web application for a Roblox Studio community that combines a modern landing page, a store for paid items, and a public Assets & Scripts download hub, plus a secure admin panel.

## Features

### Public Pages
- **Landing Page**: Hero section, community highlights, featured products/assets, social links
- **Store**: Product catalog with search, filters, sorting, and pagination
- **Assets & Scripts**: Free download hub with search, filters, and download tracking

### Admin Panel
- **Dashboard**: KPIs and quick actions
- **Products Management**: Full CRUD for store products
- **Assets Management**: Full CRUD for downloadable assets
- **Site Settings**: Configure site name, hero text, social links, featured content
- **User Management**: View users and roles
- **Audit Log**: Track all admin actions

## Tech Stack

- **Framework**: Next.js 15 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS + custom components
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Auth**: NextAuth.js (Credentials provider)
- **Database**: Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- **Validation**: Zod
- **Testing**: Vitest + React Testing Library
- **Tooling**: ESLint, Prettier, Husky

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

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
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Admin Credentials

After seeding:
- **Email**: `admin@site.test`
- **Password**: `Admin123!`

**⚠️ Change these credentials immediately in production!**

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type check with TypeScript
- `npm run test` - Run tests
- `npm run format` - Format code with Prettier
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with demo data
- `npm run prisma:studio` - Open Prisma Studio

## Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin pages (protected)
│   ├── api/               # API routes
│   ├── assets/            # Assets pages
│   ├── store/              # Store pages
│   ├── login/              # Login page
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── admin/             # Admin components
│   └── ui/                 # UI components
├── lib/                    # Utility functions
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client
│   └── ...
├── prisma/                 # Prisma schema and migrations
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed script
├── public/                 # Static files
│   └── uploads/           # Uploaded files (dev)
└── middleware.ts          # Next.js middleware

```

## Database Schema

### Models
- **User**: Authentication and authorization
- **Product**: Store products
- **Asset**: Downloadable assets/scripts
- **SiteSettings**: Site configuration (singleton)
- **Download**: Download tracking
- **AuditEvent**: Audit log entries
- **Account/Session/VerificationToken**: NextAuth models

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Download endpoints (20/min per IP)
- **RBAC**: Role-based access control (USER/ADMIN)
- **CSRF Protection**: NextAuth built-in
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, etc.
- **File Validation**: Extension whitelist, size limits (25MB)
- **SHA-256 Hashing**: File integrity verification
- **Audit Logging**: All admin actions logged

## API Routes

### Public
- `GET /api/products` - List products (with filters)
- `GET /api/products/[slug]` - Get product details
- `GET /api/assets` - List assets (with filters)
- `GET /api/assets/[slug]` - Get asset details
- `POST /api/assets/[id]/download` - Download asset file

### Admin (Protected)
- `POST /api/admin/products` - Create product
- `PATCH /api/admin/products?id=[id]` - Update product
- `DELETE /api/admin/products?id=[id]` - Delete product
- `POST /api/admin/assets` - Create asset
- `PATCH /api/admin/assets?id=[id]` - Update asset
- `DELETE /api/admin/assets?id=[id]` - Delete asset
- `PATCH /api/admin/settings` - Update site settings
- `POST /api/upload` - Upload file (admin only)

## Deployment

### Production Checklist

1. **Environment Variables**:
   - Set `DATABASE_URL` to PostgreSQL connection string
   - Set `NEXTAUTH_SECRET` to a secure random value
   - Set `NEXTAUTH_URL` to your production domain

2. **Database**:
   - Run migrations: `npx prisma migrate deploy`
   - Seed initial data if needed: `npm run prisma:seed`

3. **File Storage**:
   - Configure S3 or similar for production uploads
   - Update upload handler in `/app/api/upload/route.ts`

4. **Security**:
   - Change default admin credentials
   - Enable HTTPS
   - Configure CORS if needed
   - Set up rate limiting (consider Redis for production)

5. **Build**:
   ```bash
   npm run build
   npm run start
   ```

### Recommended Platforms

- **Vercel**: Optimized for Next.js
- **Railway**: Easy PostgreSQL setup
- **Render**: Full-stack hosting
- **AWS/GCP**: For enterprise deployments

## Testing

Run tests:
```bash
npm run test
```

Run tests with UI:
```bash
npm run test:ui
```

## Contributing

1. Follow the existing code style
2. Run linting and type checking before committing
3. Write tests for new features
4. Update documentation as needed

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
