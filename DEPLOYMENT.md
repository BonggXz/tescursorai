# Deployment Guide

## Quick Start (Development)

```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma migrate dev
npm run seed

# Start development server
npm run dev
```

Visit `http://localhost:3000`

**Admin Login**: `admin@site.test` / `Admin123!`

## Production Deployment

### 1. Database Setup

For production, use PostgreSQL instead of SQLite.

**Update `prisma/schema.prisma`:**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Set DATABASE_URL:**
```
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
```

**Run migrations:**
```bash
npx prisma migrate deploy
npm run seed  # Optional: seed with demo data
```

### 2. Environment Variables

Create `.env.production`:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# NextAuth - CRITICAL: Generate a strong secret!
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
NEXTAUTH_URL="https://yourdomain.com"

# App
NODE_ENV="production"
```

### 3. Vercel Deployment (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

**Vercel will automatically:**
- Build the application
- Set up serverless functions for API routes
- Configure CDN for static assets

### 4. Manual Deployment (VPS/Docker)

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

**Using PM2 (recommended):**
```bash
npm install -g pm2
pm2 start npm --name "roblox-community" -- start
pm2 save
pm2 startup
```

### 5. Nginx Configuration (if using VPS)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com
```

## File Storage for Production

The app currently stores files in `/public/uploads` (dev only).

**For production, integrate with:**

1. **AWS S3**
   - Update upload API to use AWS SDK
   - Store file URLs in database
   - Configure CORS and bucket policies

2. **Cloudflare R2**
   - S3-compatible API
   - Lower egress costs

3. **DigitalOcean Spaces**
   - S3-compatible
   - Simple pricing

**Example S3 integration point:**
- Update `/src/app/api/upload/route.ts` (to be created)
- Modify FileRef model to store S3 URLs

## Post-Deployment Checklist

- [ ] Change default admin password
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Configure production DATABASE_URL
- [ ] Set up file storage (S3/R2)
- [ ] Enable SSL/HTTPS
- [ ] Configure backup strategy
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Test payment integration (when implemented)
- [ ] Configure email service (when implemented)
- [ ] Set up CDN for assets
- [ ] Enable rate limiting at infrastructure level
- [ ] Configure CORS policies
- [ ] Set up database backups

## Monitoring & Maintenance

### Health Checks

Add a health check endpoint:

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'healthy' })
  } catch {
    return NextResponse.json({ status: 'unhealthy' }, { status: 500 })
  }
}
```

### Database Backups

**PostgreSQL:**
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

**Automate with cron:**
```bash
0 2 * * * /path/to/backup-script.sh
```

### Log Monitoring

Use PM2 logs:
```bash
pm2 logs roblox-community
```

Or integrate with:
- Logtail
- Papertrail
- CloudWatch (AWS)

## Scaling Considerations

1. **Database**
   - Use connection pooling (PgBouncer)
   - Add read replicas for queries
   - Index frequently queried fields

2. **Application**
   - Use Redis for sessions (optional)
   - Implement caching strategy
   - Use CDN for static assets

3. **File Storage**
   - Use S3 or equivalent
   - Configure CloudFront/CloudFlare CDN
   - Implement signed URLs for downloads

## Troubleshooting

### Build Errors

If you encounter useState errors during build:
- Pages using client hooks are marked with `export const dynamic = 'force-dynamic'`
- This prevents static optimization but ensures hooks work correctly

### Database Connection Issues

- Check DATABASE_URL format
- Verify network/firewall rules
- Test connection with `npx prisma db pull`

### NextAuth Issues

- Ensure NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain
- Check session strategy in auth config

## Security Hardening

1. **Rate Limiting**
   - Implement at nginx/load balancer level
   - Or use middleware like `express-rate-limit`

2. **CORS**
   - Configure allowed origins
   - Set in Next.js middleware

3. **Headers**
   - Already configured in middleware
   - Verify with securityheaders.com

4. **Database**
   - Use read-only user for queries
   - Implement row-level security (PostgreSQL)

5. **Secrets**
   - Never commit .env files
   - Use secret management (Vault, AWS Secrets Manager)
   - Rotate secrets regularly

## Performance Optimization

1. **Image Optimization**
   - Use next/image for all images
   - Configure remote patterns in next.config.js

2. **Database Queries**
   - Use Prisma's select to limit fields
   - Implement pagination everywhere
   - Add database indexes

3. **Caching**
   - Enable Next.js ISR for static pages
   - Cache API responses with SWR/React Query
   - Use CDN for static assets

4. **Bundle Size**
   - Analyze with `npm run build`
   - Dynamic import for large components
   - Tree-shake unused code

## Cost Optimization

**Free Tier Options:**
- Vercel (hobby plan): Free hosting
- Neon (PostgreSQL): Free tier with 0.5GB storage
- Cloudflare R2: 10GB free storage
- Cloudflare CDN: Free tier

**Estimated Monthly Costs (paid tier):**
- Vercel Pro: $20/mo
- Database (Neon/Railway): $10-25/mo
- S3 Storage: ~$5/mo (depends on usage)
- **Total: ~$35-50/mo** for small-medium traffic

## Support & Updates

- Check GitHub for updates
- Review Prisma migrations before applying
- Test in staging before production
- Keep dependencies updated monthly
