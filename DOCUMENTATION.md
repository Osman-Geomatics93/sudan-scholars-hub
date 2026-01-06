# Sudan Scholars Hub - Technical Documentation

## Project Overview

Sudan Scholars Hub is a bilingual (English/Arabic) scholarship discovery platform built with Next.js 14. It helps Sudanese students find and apply for scholarships worldwide.

### Key Features
- Bilingual support (English/Arabic with RTL)
- Admin panel for scholarship management
- Public scholarship listing with filters
- Contact form and newsletter subscription
- Responsive design

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 14.2.21 |
| Language | TypeScript | 5.x |
| Database | PostgreSQL | 18 |
| ORM | Prisma | 5.x |
| Authentication | NextAuth.js | 4.x |
| Styling | Tailwind CSS | 3.x |
| Internationalization | next-intl | latest |
| Icons | Lucide React | latest |

---

## Database Setup

### PostgreSQL Configuration
- **Database Name:** `sudan_scholars_hub`
- **Port:** 5433 (PostgreSQL 18)
- **User:** postgres

> **Important:** If you have multiple PostgreSQL versions installed, ensure you're connecting to the correct port. This project uses port 5433.

### Prisma Schema Location
```
prisma/schema.prisma
```

### Database Models

#### Admin
```prisma
model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String
  role      Role     @default(EDITOR)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  SUPER_ADMIN
  EDITOR
}
```

#### Scholarship
```prisma
model Scholarship {
  id            String   @id @default(cuid())
  slug          String   @unique

  // English content
  title         String
  university    String
  country       String
  countryCode   String
  description   String   @db.Text
  eligibility   String[]
  benefits      String[]
  requirements  String[]
  howToApply    String   @db.Text
  duration      String

  // Arabic content
  titleAr       String
  universityAr  String
  countryAr     String
  descriptionAr String   @db.Text
  eligibilityAr String[]
  benefitsAr    String[]
  requirementsAr String[]
  howToApplyAr  String   @db.Text
  durationAr    String

  // Metadata
  deadline      DateTime
  fundingType   FundingType
  level         StudyLevel
  field         FieldOfStudy
  applicationUrl String
  image         String

  // Flags
  isFeatured    Boolean  @default(false)
  isPublished   Boolean  @default(false)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

#### ContactMessage
```prisma
model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String
  message   String   @db.Text
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

#### Subscriber
```prisma
model Subscriber {
  id           String   @id @default(cuid())
  email        String   @unique
  isActive     Boolean  @default(true)
  subscribedAt DateTime @default(now())
  unsubscribedAt DateTime?
}
```

### Database Commands

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database
npm run db:seed

# Open Prisma Studio (GUI)
npx prisma studio

# Push schema changes (development)
npx prisma db push
```

---

## Environment Variables

File: `.env`

```env
# Database (PostgreSQL 18 on port 5433)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5433/sudan_scholars_hub"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Admin credentials (for seed script)
ADMIN_EMAIL="admin@sudanscholarshub.com"
ADMIN_PASSWORD="Admin@123"
```

---

## Project Structure

```
scholarship-app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed script
│   └── migrations/            # Database migrations
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/    # NextAuth handler
│   │   │   ├── admin/
│   │   │   │   ├── scholarships/      # Admin CRUD
│   │   │   │   ├── contacts/          # Contact messages
│   │   │   │   ├── subscribers/       # Newsletter
│   │   │   │   └── stats/             # Dashboard stats
│   │   │   ├── scholarships/
│   │   │   │   ├── route.ts           # List (public)
│   │   │   │   ├── featured/          # Featured scholarships
│   │   │   │   └── [slug]/            # Single scholarship
│   │   │   ├── contact/               # Contact form submission
│   │   │   └── newsletter/            # Subscribe/unsubscribe
│   │   │
│   │   ├── [locale]/
│   │   │   ├── layout.tsx             # Locale layout
│   │   │   ├── page.tsx               # Home page
│   │   │   ├── scholarships/
│   │   │   │   ├── page.tsx           # Scholarships list
│   │   │   │   └── [slug]/page.tsx    # Scholarship details
│   │   │   ├── about/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── admin/
│   │   │       ├── layout.tsx         # Admin layout (sidebar)
│   │   │       ├── page.tsx           # Dashboard
│   │   │       ├── login/page.tsx     # Admin login
│   │   │       ├── scholarships/
│   │   │       │   ├── page.tsx       # List scholarships
│   │   │       │   ├── new/page.tsx   # Add scholarship
│   │   │       │   └── [id]/edit/     # Edit scholarship
│   │   │       ├── contacts/page.tsx
│   │   │       └── subscribers/page.tsx
│   │   │
│   │   └── layout.tsx                 # Root layout
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   └── scholarship-form.tsx   # Add/Edit form
│   │   ├── features/
│   │   │   ├── scholarship-card.tsx
│   │   │   ├── filter-sidebar.tsx
│   │   │   └── empty-state.tsx
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── container.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       └── skeleton.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts                  # Prisma client singleton
│   │   ├── auth.ts                    # NextAuth config
│   │   ├── utils.ts                   # Utility functions
│   │   └── mock-data.ts               # Static data (testimonials, etc.)
│   │
│   ├── i18n/
│   │   └── request.ts                 # Locale configuration
│   │
│   ├── messages/
│   │   ├── en.json                    # English translations
│   │   └── ar.json                    # Arabic translations
│   │
│   └── middleware.ts                  # Auth & i18n middleware
│
├── public/
├── .env
├── package.json
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

---

## API Routes

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scholarships` | List scholarships with filters & pagination |
| GET | `/api/scholarships/[slug]` | Get single scholarship by slug or ID |
| GET | `/api/scholarships/featured` | Get featured scholarships |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter |
| POST | `/api/newsletter/unsubscribe` | Unsubscribe |

### Admin Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/scholarships` | List all scholarships |
| POST | `/api/admin/scholarships` | Create scholarship |
| GET | `/api/admin/scholarships/[id]` | Get scholarship |
| PUT | `/api/admin/scholarships/[id]` | Update scholarship |
| DELETE | `/api/admin/scholarships/[id]` | Delete scholarship |
| GET | `/api/admin/contacts` | List contact messages |
| PATCH | `/api/admin/contacts/[id]` | Mark as read |
| DELETE | `/api/admin/contacts/[id]` | Delete message |
| GET | `/api/admin/subscribers` | List subscribers |
| GET | `/api/admin/stats` | Dashboard statistics |

### Query Parameters (Scholarships API)

```
GET /api/scholarships?
  page=1
  limit=12
  level=MASTER,PHD
  fundingType=FULLY_FUNDED
  country=uk,usa
  field=ENGINEERING
  search=chevening
  sortBy=deadline|createdAt|title
  sortOrder=asc|desc
```

---

## Authentication

### NextAuth Configuration
- **Provider:** Credentials (email/password)
- **Session Strategy:** JWT
- **Protected Routes:** `/admin/*` (except login)

### Admin Credentials (Default)
```
Email: admin@sudanscholarshub.com
Password: Admin@123
```

### Middleware Protection
File: `src/middleware.ts`

The middleware:
1. Handles internationalization (locale routing)
2. Protects admin routes (requires authentication)
3. Redirects unauthenticated users to login

---

## Admin Panel

### Layout Structure
The admin panel uses a **fixed overlay layout** to hide the main site's navbar/footer:

```tsx
// src/app/[locale]/admin/layout.tsx
<div className="fixed inset-0 z-[100] bg-gray-100">
  {/* Sidebar */}
  <aside className="fixed ... w-64">
    {/* Navigation items */}
  </aside>

  {/* Main content with sidebar offset */}
  <div className="lg:ml-64">
    {/* Header + Content */}
  </div>
</div>
```

### Admin Pages

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard with stats |
| `/admin/login` | Admin login |
| `/admin/scholarships` | List all scholarships |
| `/admin/scholarships/new` | Add new scholarship |
| `/admin/scholarships/[id]/edit` | Edit scholarship |
| `/admin/contacts` | View contact messages |
| `/admin/subscribers` | View newsletter subscribers |

---

## Internationalization (i18n)

### Supported Locales
- `en` - English (LTR)
- `ar` - Arabic (RTL)

### Translation Files
```
src/messages/en.json
src/messages/ar.json
```

### Usage in Components
```tsx
import { useTranslations } from 'next-intl';

function Component() {
  const t = useTranslations('home');
  return <h1>{t('heroTitle')}</h1>;
}
```

### RTL Support
```tsx
const locale = pathname.split('/')[1];
const isRTL = locale === 'ar';

<div dir={isRTL ? 'rtl' : 'ltr'}>
  {/* Content */}
</div>
```

---

## Key Files Explained

### `src/lib/prisma.ts`
Prisma client singleton to prevent multiple instances in development:
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### `src/lib/auth.ts`
NextAuth configuration with credentials provider.

### `src/lib/utils.ts`
Utility functions:
- `cn()` - Tailwind class merging
- `formatDate()` - Date formatting with locale
- `getLocalizedField()` - Get field based on locale (title vs titleAr)

### `src/components/admin/scholarship-form.tsx`
Comprehensive form for creating/editing scholarships with:
- English and Arabic fields
- Array inputs (eligibility, benefits, requirements)
- Enum selectors (level, fundingType, field)
- Image URL input
- Publishing controls

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npx prisma generate      # Generate client
npx prisma migrate dev   # Create migration
npx prisma db push       # Push schema changes
npx prisma studio        # Open GUI
npm run db:seed          # Seed database
```

---

## Common Issues & Solutions

### Issue: Database appears empty in pgAdmin
**Cause:** Multiple PostgreSQL versions installed
**Solution:** Update `.env` to use correct port (5433 for PostgreSQL 18)

### Issue: useContext error on page load
**Cause:** Incorrect params type in Next.js 14
**Solution:** Use `params: { locale: string }` not `params: Promise<{ locale: string }>`

### Issue: Scholarships not showing on public site
**Cause:** Pages were using mock data instead of API
**Solution:** Updated pages to fetch from `/api/scholarships`

### Issue: Admin navbar showing main site navigation
**Cause:** Nested layouts
**Solution:** Admin layout uses `fixed inset-0 z-[100]` to overlay parent

### Issue: Hot reload errors during development
**Cause:** Next.js Fast Refresh limitations
**Solution:** Hard refresh (Ctrl+Shift+R) or restart dev server

---

## Deployment (Vercel)

### Environment Variables to Set
```
DATABASE_URL=postgresql://...     # Use Neon or Supabase
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-password
```

### Database Options
- **Neon** (Recommended) - Serverless PostgreSQL
- **Supabase** - PostgreSQL with extras
- **Railway** - Simple setup

### Build Command
```bash
npx prisma generate && npm run build
```

---

## Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Admin Panel    │────▶│   API Routes    │────▶│   PostgreSQL    │
│  (Create/Edit)  │     │  /api/admin/*   │     │   Database      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Public Pages   │◀────│   API Routes    │◀────│   Prisma ORM    │
│  (View)         │     │  /api/*         │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Version History

| Date | Changes |
|------|---------|
| 2026-01-04 | Initial backend implementation |
| 2026-01-04 | Fixed database connection (port 5432 → 5433) |
| 2026-01-04 | Created admin CRUD for scholarships |
| 2026-01-04 | Fixed admin layout overlay |
| 2026-01-04 | Updated public pages to use API instead of mock data |

---

## Contact

For issues or questions, refer to the project repository or contact the development team.
