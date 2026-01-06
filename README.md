# Sudan Scholars Hub

A modern, bilingual (English/Arabic) scholarship discovery platform built with Next.js 14, helping Sudanese students find and track international scholarship opportunities.

**Live Demo:** [sudan-scholars-hub.vercel.app](https://sudan-scholars-hub.vercel.app)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Components](#components)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [Internationalization](#internationalization)
- [Theming](#theming)
- [Deployment](#deployment)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)

---

## Overview

Sudan Scholars Hub is a comprehensive scholarship platform designed specifically for Sudanese students seeking international education opportunities. The platform provides:

- **Scholarship Discovery**: Browse, search, and filter scholarships from around the world
- **Bilingual Support**: Full Arabic and English support with RTL layout
- **User Accounts**: Save scholarships, track applications, manage profiles
- **Admin Dashboard**: Complete content management system for administrators
- **Dark Mode**: System-aware theme with manual toggle
- **Comparison Tool**: Compare up to 3 scholarships side-by-side

---

## Tech Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org) | 14.2.x | React framework with App Router |
| [React](https://react.dev) | 18.3.x | UI library |
| [TypeScript](https://typescriptlang.org) | 5.7.x | Type safety |

### Database & ORM
| Technology | Purpose |
|------------|---------|
| [PostgreSQL](https://postgresql.org) | Primary database |
| [Prisma](https://prisma.io) | ORM & database toolkit |

### Authentication
| Technology | Purpose |
|------------|---------|
| [NextAuth.js v5](https://authjs.dev) | Authentication framework |
| Google OAuth | User authentication |
| OTP (Email) | Admin authentication |

### Styling & UI
| Technology | Purpose |
|------------|---------|
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark mode support |
| [Lucide React](https://lucide.dev) | Icon library |

### Internationalization
| Technology | Purpose |
|------------|---------|
| [next-intl](https://next-intl-docs.vercel.app) | i18n framework |

### Utilities
| Technology | Purpose |
|------------|---------|
| [Zod](https://zod.dev) | Schema validation |
| [Resend](https://resend.com) | Email delivery |
| [clsx](https://github.com/lukeed/clsx) | Conditional classes |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | Merge Tailwind classes |

---

## Features

### Public Features
- Browse and search scholarships with advanced filters
- Filter by study level, field, funding type, country, and deadline
- View detailed scholarship information
- Read blog articles with tips and guides
- Access resources (FAQ, Application Tips, Study Guides)
- Turkey study guide with downloadable resources
- Contact form for inquiries
- Newsletter subscription
- Full bilingual support (English/Arabic with RTL)
- Responsive design for all devices
- Dark/Light mode with system preference detection

### User Features (Google OAuth)
- Sign in with Google account
- Save/bookmark scholarships
- Track application status (Saved → Applying → Applied → Accepted/Rejected)
- Manage profile information
- Upload custom profile picture
- Add social media links
- View saved scholarships dashboard

### Scholarship Comparison
- Compare up to 3 scholarships side-by-side
- Floating comparison bar showing selected items
- Modal view with detailed comparison
- Compare: funding type, deadlines, benefits, eligibility, requirements

### Admin Features
- Secure OTP-based login (no password stored)
- Full CRUD for scholarships (create, read, update, delete)
- Full CRUD for blog posts
- Manage testimonials
- View contact messages
- View newsletter subscribers
- Dashboard with real-time statistics

---

## Project Structure

```
scholarship-app/
├── prisma/
│   ├── schema.prisma           # Database schema definition
│   └── seed.ts                 # Database seeding script
│
├── messages/
│   ├── en.json                 # English translations
│   └── ar.json                 # Arabic translations
│
├── public/
│   └── icon.svg                # App icon
│
├── src/
│   ├── app/
│   │   ├── globals.css         # Global styles & CSS variables
│   │   ├── layout.tsx          # Root layout (metadata, fonts)
│   │   │
│   │   ├── [locale]/           # Localized pages (en/ar)
│   │   │   ├── layout.tsx      # Locale layout (Navbar, Footer)
│   │   │   ├── page.tsx        # Home page
│   │   │   │
│   │   │   ├── scholarships/
│   │   │   │   ├── page.tsx    # Scholarship listing with filters
│   │   │   │   └── [slug]/page.tsx  # Scholarship detail
│   │   │   │
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx    # Blog listing
│   │   │   │   └── [slug]/page.tsx  # Blog article
│   │   │   │
│   │   │   ├── about/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   ├── application-tips/page.tsx
│   │   │   ├── study-guides/page.tsx
│   │   │   ├── turkey/page.tsx
│   │   │   │
│   │   │   ├── login/page.tsx      # User login (Google OAuth)
│   │   │   ├── profile/page.tsx    # User profile & saved scholarships
│   │   │   │
│   │   │   └── admin/              # Admin panel
│   │   │       ├── layout.tsx      # Admin layout with sidebar
│   │   │       ├── login/page.tsx  # Admin OTP login
│   │   │       ├── page.tsx        # Dashboard
│   │   │       ├── scholarships/   # Scholarship management
│   │   │       ├── blog/           # Blog management
│   │   │       ├── testimonials/   # Testimonial management
│   │   │       ├── contacts/       # Contact messages
│   │   │       └── subscribers/    # Newsletter subscribers
│   │   │
│   │   └── api/                    # API routes
│   │       ├── auth/[...nextauth]/ # NextAuth endpoints
│   │       ├── scholarships/       # Public scholarship API
│   │       ├── blog/               # Public blog API
│   │       ├── user/               # User API (authenticated)
│   │       │   ├── profile/
│   │       │   └── saved-scholarships/
│   │       ├── admin/              # Admin API (protected)
│   │       │   ├── scholarships/
│   │       │   ├── blog/
│   │       │   ├── testimonials/
│   │       │   ├── contacts/
│   │       │   ├── subscribers/
│   │       │   ├── stats/
│   │       │   └── otp/
│   │       ├── contact/
│   │       └── newsletter/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── navbar.tsx          # Main navigation
│   │   │   ├── footer.tsx          # Site footer
│   │   │   ├── container.tsx       # Layout container
│   │   │   └── main-layout.tsx     # Main layout wrapper
│   │   │
│   │   ├── ui/                     # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── badge.tsx
│   │   │   └── skeleton.tsx
│   │   │
│   │   ├── features/               # Feature components
│   │   │   ├── scholarship-card.tsx
│   │   │   ├── filter-sidebar.tsx
│   │   │   ├── save-button.tsx
│   │   │   ├── share-button.tsx
│   │   │   ├── share-modal.tsx
│   │   │   ├── compare-button.tsx
│   │   │   ├── comparison-bar.tsx
│   │   │   ├── comparison-modal.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   ├── language-switcher.tsx
│   │   │   ├── profile-edit-form.tsx
│   │   │   └── empty-state.tsx
│   │   │
│   │   ├── admin/                  # Admin components
│   │   │   ├── scholarship-form.tsx
│   │   │   ├── blog-form.tsx
│   │   │   └── testimonial-form.tsx
│   │   │
│   │   └── providers.tsx           # React context providers
│   │
│   ├── contexts/
│   │   └── comparison-context.tsx  # Scholarship comparison state
│   │
│   ├── lib/
│   │   ├── auth.ts                 # NextAuth configuration
│   │   ├── auth-utils.ts           # Admin session utilities
│   │   ├── prisma.ts               # Prisma client singleton
│   │   ├── email.ts                # Email sending utilities
│   │   ├── utils.ts                # General utilities (cn, formatDate, etc.)
│   │   ├── share-utils.ts          # Social sharing utilities
│   │   └── validations/            # Zod validation schemas
│   │       ├── scholarship.ts
│   │       ├── blog.ts
│   │       ├── contact.ts
│   │       ├── newsletter.ts
│   │       ├── profile.ts
│   │       └── testimonial.ts
│   │
│   ├── i18n/
│   │   └── request.ts              # i18n configuration
│   │
│   ├── types/
│   │   └── scholarship.ts          # TypeScript type definitions
│   │
│   └── middleware.ts               # Auth & i18n middleware
│
├── .env                            # Environment variables (not in git)
├── .env.example                    # Environment template
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## Database Schema

### Entity Relationship

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│    Admin    │     │  SavedScholarship │     │    User     │
├─────────────┤     ├──────────────────┤     ├─────────────┤
│ id          │     │ id               │     │ id          │
│ email       │     │ userId      ────────── │ email       │
│ name        │     │ scholarshipId ───┐     │ name        │
│ role        │     │ status           │     │ image       │
│ otpCode     │     │ notes            │     │ phone       │
│ otpExpiresAt│     │ savedAt          │     │ location    │
└─────────────┘     └──────────────────┘     │ bio         │
                            │                 │ educationLevel
┌─────────────┐             │                 │ fieldOfStudy │
│ Scholarship │─────────────┘                 │ socialLinks  │
├─────────────┤                              └─────────────┘
│ id          │                                     │
│ slug        │                              ┌─────────────┐
│ title/Ar    │                              │   Account   │
│ university/Ar                              ├─────────────┤
│ country/Ar  │                              │ id          │
│ description/Ar                             │ userId      │
│ eligibility/Ar[]                           │ provider    │
│ benefits/Ar[]                              │ access_token│
│ requirements/Ar[]                          └─────────────┘
│ howToApply/Ar
│ duration/Ar │
│ deadline    │
│ fundingType │     ┌─────────────┐     ┌─────────────┐
│ level       │     │  BlogPost   │     │ Testimonial │
│ field       │     ├─────────────┤     ├─────────────┤
│ applicationUrl    │ id          │     │ id          │
│ image       │     │ slug        │     │ name/Ar     │
│ isFeatured  │     │ title/Ar    │     │ university/Ar
│ isPublished │     │ excerpt/Ar  │     │ country/Ar  │
└─────────────┘     │ content/Ar  │     │ quote/Ar    │
                    │ category/Ar │     │ avatar      │
┌─────────────┐     │ author/Ar   │     │ scholarshipYear
│  Country    │     │ readTime/Ar │     │ isPublished │
├─────────────┤     │ image       │     └─────────────┘
│ id          │     │ tags[]      │
│ code        │     │ isFeatured  │     ┌─────────────┐
│ name/Ar     │     │ isPublished │     │ Subscriber  │
│ flag        │     │ publishedAt │     ├─────────────┤
└─────────────┘     └─────────────┘     │ id          │
                                        │ email       │
┌─────────────┐                         │ isActive    │
│ContactMessage                         │ subscribedAt│
├─────────────┤                         └─────────────┘
│ id          │
│ name        │
│ email       │
│ subject     │
│ message     │
│ isRead      │
└─────────────┘
```

### Enums

```typescript
// Admin Roles
enum Role {
  SUPER_ADMIN
  EDITOR
}

// Funding Types
enum FundingType {
  FULLY_FUNDED
  PARTIALLY_FUNDED
}

// Study Levels
enum StudyLevel {
  BACHELOR
  MASTER
  PHD
}

// Fields of Study
enum FieldOfStudy {
  ENGINEERING
  MEDICINE
  BUSINESS
  ARTS
  SCIENCE
  LAW
  EDUCATION
  TECHNOLOGY
}

// Application Status (for saved scholarships)
enum ApplicationStatus {
  SAVED
  APPLYING
  APPLIED
  ACCEPTED
  REJECTED
}
```

---

## API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/scholarships` | List scholarships with pagination & filters |
| `GET` | `/api/scholarships/featured` | Get featured scholarships |
| `GET` | `/api/scholarships/[slug]` | Get scholarship by slug |
| `GET` | `/api/blog` | List published blog posts |
| `GET` | `/api/blog/[slug]` | Get blog post by slug |
| `POST` | `/api/contact` | Submit contact form |
| `POST` | `/api/newsletter/subscribe` | Subscribe to newsletter |
| `POST` | `/api/newsletter/unsubscribe` | Unsubscribe from newsletter |

### Scholarship Query Parameters

```
GET /api/scholarships?page=1&limit=12&level=MASTER&fundingType=FULLY_FUNDED&country=uk&search=engineering&sortBy=deadline&sortOrder=asc
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 12) |
| `level` | string | Filter by study level (comma-separated) |
| `fundingType` | string | Filter by funding type (comma-separated) |
| `country` | string | Filter by country code (comma-separated) |
| `field` | string | Filter by field of study |
| `search` | string | Search in title, university, description |
| `sortBy` | string | Sort field: `createdAt`, `deadline` |
| `sortOrder` | string | Sort direction: `asc`, `desc` |

### User Endpoints (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/user/profile` | Get user profile |
| `PATCH` | `/api/user/profile` | Update user profile |
| `POST` | `/api/user/profile/upload` | Upload profile picture |
| `GET` | `/api/user/saved-scholarships` | Get saved scholarships |
| `POST` | `/api/user/saved-scholarships` | Save a scholarship |
| `GET` | `/api/user/saved-scholarships/check?scholarshipId=xxx` | Check if scholarship is saved |
| `PATCH` | `/api/user/saved-scholarships/[id]` | Update application status/notes |
| `DELETE` | `/api/user/saved-scholarships/[id]` | Remove saved scholarship |

### Admin Endpoints (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/otp` | Request OTP for login |
| `GET` | `/api/admin/stats` | Get dashboard statistics |
| `GET/POST` | `/api/admin/scholarships` | List/Create scholarships |
| `GET/PUT/DELETE` | `/api/admin/scholarships/[id]` | Get/Update/Delete scholarship |
| `GET/POST` | `/api/admin/blog` | List/Create blog posts |
| `GET/PUT/DELETE` | `/api/admin/blog/[id]` | Get/Update/Delete blog post |
| `GET/POST` | `/api/admin/testimonials` | List/Create testimonials |
| `GET/PUT/DELETE` | `/api/admin/testimonials/[id]` | Get/Update/Delete testimonial |
| `GET` | `/api/admin/contacts` | List contact messages |
| `PATCH` | `/api/admin/contacts/[id]` | Mark message as read |
| `GET` | `/api/admin/subscribers` | List newsletter subscribers |

---

## Components

### Layout Components

#### Navbar (`src/components/layout/navbar.tsx`)
- Logo with home link
- Navigation links (Scholarships, Resources dropdown, About, Contact)
- Theme toggle (Light/Dark/System)
- Language switcher (EN/AR)
- User authentication menu (Sign In / Profile / Sign Out)
- Mobile responsive hamburger menu
- Sticky positioning with blur backdrop

#### Footer (`src/components/layout/footer.tsx`)
- Quick links section
- Resources section
- Newsletter signup form
- Social media links
- Copyright notice
- Dark mode compatible

### UI Components

| Component | Location | Description |
|-----------|----------|-------------|
| `Button` | `/ui/button.tsx` | Primary, outline, ghost, destructive variants |
| `Card` | `/ui/card.tsx` | Flexible card container with hover effects |
| `Input` | `/ui/input.tsx` | Form input with icon support |
| `Textarea` | `/ui/textarea.tsx` | Multi-line text input |
| `Select` | `/ui/select.tsx` | Dropdown select input |
| `Checkbox` | `/ui/checkbox.tsx` | Checkbox with label |
| `Badge` | `/ui/badge.tsx` | Status badges (success, warning, info, default) |
| `Skeleton` | `/ui/skeleton.tsx` | Loading placeholder |

### Feature Components

| Component | Description |
|-----------|-------------|
| `ScholarshipCard` | Displays scholarship preview with image, badges, save/share/compare buttons |
| `FilterSidebar` | Collapsible filter panel for scholarships (level, funding, country) |
| `SaveButton` | Toggle button to save/unsave scholarships |
| `ShareButton` | Opens share modal with social options |
| `ShareModal` | Social sharing options (Twitter, Facebook, WhatsApp, LinkedIn, copy link) |
| `CompareButton` | Add/remove scholarship from comparison |
| `ComparisonBar` | Fixed bottom bar showing selected scholarships |
| `ComparisonModal` | Side-by-side scholarship comparison view |
| `ThemeToggle` | Light/Dark/System theme selector |
| `LanguageSwitcher` | EN/AR language toggle |
| `EmptyState` | Shown when no results found |

### Admin Components

| Component | Description |
|-----------|-------------|
| `ScholarshipForm` | Full scholarship create/edit form with bilingual fields |
| `BlogForm` | Blog post create/edit form with bilingual fields |
| `TestimonialForm` | Testimonial create/edit form |

---

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** database (local or cloud like Neon, Supabase, Railway)
- **Google Cloud Console** account (for OAuth)
- **Resend** account (for email delivery)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Osman-Geomatics93/sudan-scholars-hub.git
   cd sudan-scholars-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your values (see [Environment Variables](#environment-variables))

4. **Set up the database**
   ```bash
   # Push schema to database
   npx prisma db push

   # Generate Prisma client
   npx prisma generate

   # Seed with sample data (optional)
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# ============ DATABASE ============
# PostgreSQL connection string
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://username:password@localhost:5432/sudan_scholars_hub"

# ============ NEXTAUTH ============
# Secret for JWT encryption (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-super-secret-key-here"

# Your app URL (no trailing slash)
NEXTAUTH_URL="http://localhost:3000"

# ============ GOOGLE OAUTH ============
# Get from Google Cloud Console > APIs & Services > Credentials
GOOGLE_CLIENT_ID="123456789-abcdef.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-client-secret"

# ============ EMAIL (RESEND) ============
# Get from resend.com dashboard
RESEND_API_KEY="re_123456789"

# ============ ADMIN (OPTIONAL) ============
# Only for initial admin setup
ADMIN_EMAIL="admin@example.com"
```

### Variable Details

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Random string for JWT encryption |
| `NEXTAUTH_URL` | Yes | Full URL of your app |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `RESEND_API_KEY` | Yes | Resend.com API key for emails |
| `ADMIN_EMAIL` | No | Email for initial admin account |

---

## Authentication

### User Authentication (Google OAuth)

Users sign in with their Google account:

1. Click "Sign In" in navbar
2. Click "Continue with Google"
3. Authorize the application
4. User profile is created/updated in database
5. Session stored in JWT cookie

### Admin Authentication (OTP)

Admins use passwordless OTP authentication:

1. Go to `/admin/login`
2. Enter admin email
3. Receive 6-digit OTP via email
4. Enter OTP to authenticate
5. OTP expires after 10 minutes
6. Session stored in JWT cookie

### Route Protection

Protected routes are handled by middleware (`src/middleware.ts`):

- `/profile` - Requires user authentication
- `/admin/*` - Requires admin authentication (except `/admin/login`)

---

## Internationalization

### Supported Languages

| Code | Language | Direction |
|------|----------|-----------|
| `en` | English | LTR (Left-to-Right) |
| `ar` | Arabic | RTL (Right-to-Left) |

### URL Structure

All pages are prefixed with locale:
- English: `/en/scholarships`, `/en/about`
- Arabic: `/ar/scholarships`, `/ar/about`

Default locale is Arabic (`ar`).

### Translation Files

Located in `/messages/`:

```json
// messages/en.json
{
  "nav": {
    "home": "Home",
    "scholarships": "Scholarships",
    "about": "About"
  },
  "hero": {
    "title": "Find Your Dream Scholarship",
    "subtitle": "Discover opportunities worldwide"
  }
}

// messages/ar.json
{
  "nav": {
    "home": "الرئيسية",
    "scholarships": "المنح الدراسية",
    "about": "من نحن"
  },
  "hero": {
    "title": "اعثر على منحتك المثالية",
    "subtitle": "اكتشف الفرص حول العالم"
  }
}
```

### Using Translations in Components

```tsx
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('nav');
  return <h1>{t('home')}</h1>; // "Home" or "الرئيسية"
}
```

### RTL Support

RTL is automatically applied for Arabic:

```tsx
// In [locale]/layout.tsx
const dir = locale === 'ar' ? 'rtl' : 'ltr';
return <div dir={dir}>...</div>;
```

Use logical properties in Tailwind:
- `start` instead of `left` → `ps-4`, `ms-2`, `start-0`
- `end` instead of `right` → `pe-4`, `me-2`, `end-0`

---

## Theming

### Dark Mode

The app supports three theme modes:

| Mode | Description |
|------|-------------|
| Light | Always light theme |
| Dark | Always dark theme |
| System | Follows OS preference |

Theme is managed by `next-themes` and persisted in localStorage.

### Color Scheme

```css
/* Light Mode */
--background: white
--foreground: gray-900
--card: white
--border: gray-200
--primary: blue-600

/* Dark Mode */
--background: gray-950
--foreground: gray-50
--card: gray-900
--border: gray-800
--primary: blue-500
```

### Custom Colors (Tailwind)

```typescript
// tailwind.config.ts
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    // ...
  },
  secondary: {
    // Green shades
  },
  accent: {
    // Amber/Yellow shades
  }
}
```

### Using Dark Mode in Components

```tsx
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-gray-50">
    This text adapts to theme
  </p>
</div>
```

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

Vercel auto-deploys on every push to `main`.

### Environment Variables in Vercel

Add all variables from `.env` to Vercel:
- Project Settings → Environment Variables
- Add each variable for Production/Preview/Development

### Production Considerations

1. **Database**: Use a production PostgreSQL (Neon, Supabase, Railway)
2. **NEXTAUTH_URL**: Set to your production domain
3. **Google OAuth**: Add production domain to authorized origins/redirects
4. **Resend**: Verify your sending domain

---

## Scripts

```bash
# Development
npm run dev          # Start dev server (localhost:3000)

# Build
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint

# Database
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma generate  # Regenerate Prisma client
npx prisma migrate dev  # Create migration (development)
```

---

## Troubleshooting

### Common Issues

#### "Dynamic server usage" warnings during build

These are expected for API routes using `searchParams` or `headers`. Routes are marked with `export const dynamic = 'force-dynamic'` to handle this.

#### Google OAuth not working

1. Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
2. Verify authorized redirect URI: `https://yourdomain.com/api/auth/callback/google`
3. Ensure OAuth consent screen is configured

#### Database connection errors

1. Check `DATABASE_URL` format is correct
2. Ensure database server is running
3. Verify network access (IP allowlist for cloud databases)

#### OTP emails not sending

1. Verify `RESEND_API_KEY` is correct
2. Check Resend dashboard for sending logs
3. Verify sender domain is configured in Resend

#### Hydration errors

Usually caused by:
1. Using browser-only APIs during SSR
2. Date/time formatting differences
3. Fix with `'use client'` directive and `useEffect` hooks

#### RTL layout issues

1. Use logical properties: `start/end` instead of `left/right`
2. Add `rtl:` prefix for RTL-specific styles
3. Test both locales during development

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Contact

- **GitHub**: [@Osman-Geomatics93](https://github.com/Osman-Geomatics93)
- **Website**: [sudan-scholars-hub.vercel.app](https://sudan-scholars-hub.vercel.app)

---

Built with love for Sudanese students seeking international education opportunities.
