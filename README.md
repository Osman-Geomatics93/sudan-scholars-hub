# Sudan Scholars Hub

A bilingual (English/Arabic) scholarship discovery platform built with Next.js 14, helping Sudanese students find and track international scholarship opportunities.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**:
  - Users: NextAuth.js v5 (Google OAuth)
  - Admin: OTP-based email authentication
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl (English/Arabic with RTL support)
- **Email**: Nodemailer (for OTP delivery)
- **Validation**: Zod

## Features

### Public Features
- Browse and search scholarships with advanced filters
- Filter by level, field, funding type, country, and deadline
- View detailed scholarship information
- Read blog articles with tips and guides
- Access resources (FAQ, Application Tips, Study Guides)
- Contact form for inquiries
- Newsletter subscription
- Full bilingual support (English/Arabic with RTL)
- Responsive design for all devices

### User Features (Google OAuth)
- Sign in with Google
- Save/bookmark scholarships
- Track application status (Not Started → In Progress → Submitted → Accepted/Rejected)
- Manage profile information
- View saved scholarships dashboard

### Admin Features
- Secure OTP-based login (no password stored)
- Full CRUD for scholarships
- Full CRUD for blog posts
- Manage testimonials
- View contact messages
- View newsletter subscribers
- Dashboard with statistics

## Application Structure

### Public Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, featured scholarships, testimonials |
| `/scholarships` | Scholarship listing with filters and search |
| `/scholarships/[slug]` | Scholarship detail page |
| `/blog` | Blog listing page |
| `/blog/[slug]` | Blog article detail page |
| `/resources/faq` | Frequently Asked Questions |
| `/resources/application-tips` | Application tips and guides |
| `/resources/study-guides` | Study abroad guides |
| `/about` | About the platform |
| `/contact` | Contact form |
| `/login` | User login (Google OAuth) |
| `/profile` | User profile and saved scholarships |

### Admin Pages

| Route | Description |
|-------|-------------|
| `/admin/login` | Admin OTP login |
| `/admin` | Dashboard with stats |
| `/admin/scholarships` | Manage scholarships (list, create, edit, delete) |
| `/admin/scholarships/new` | Create new scholarship |
| `/admin/scholarships/[id]/edit` | Edit scholarship |
| `/admin/blog` | Manage blog posts |
| `/admin/blog/new` | Create new blog post |
| `/admin/blog/[id]/edit` | Edit blog post |
| `/admin/testimonials` | Manage testimonials |
| `/admin/messages` | View contact messages |
| `/admin/subscribers` | View newsletter subscribers |

## Database Schema

### Models

```
Admin           - Admin users (OTP-based auth)
User            - Regular users (Google OAuth)
Scholarship     - Scholarship listings
SavedScholarship - User's saved scholarships with status
BlogPost        - Blog articles (bilingual)
Testimonial     - Success story testimonials
ContactMessage  - Contact form submissions
Subscriber      - Newsletter subscribers
Country         - Country reference data
```

### Scholarship Model Fields
- Basic info: title, slug, university, country, deadline
- Bilingual content: title/titleAr, description/descriptionAr
- Categories: level, field, fundingType
- Lists: eligibility, benefits, requirements (with Arabic versions)
- Media: image URL
- Status: isFeatured, isPublished
- Application: applicationUrl, howToApply

### BlogPost Model Fields
- Basic info: title, slug, excerpt, content
- Bilingual: All text fields have Arabic versions (titleAr, contentAr, etc.)
- Metadata: author, category, readTime, tags[]
- Media: image URL
- Status: isFeatured, isPublished, publishedAt

## API Routes

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scholarships` | List scholarships with filters |
| GET | `/api/scholarships/featured` | Get featured scholarships |
| GET | `/api/scholarships/[slug]` | Get scholarship details |
| GET | `/api/blog` | List published blog posts |
| GET | `/api/blog/[slug]` | Get blog post by slug |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter |

### User Routes (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get user profile |
| PATCH | `/api/user/profile` | Update user profile |
| GET | `/api/user/saved-scholarships` | Get saved scholarships |
| POST | `/api/user/saved-scholarships` | Save a scholarship |
| PATCH | `/api/user/saved-scholarships/[id]` | Update application status |
| DELETE | `/api/user/saved-scholarships/[id]` | Remove saved scholarship |

### Admin Routes (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Request OTP |
| POST | `/api/admin/verify-otp` | Verify OTP and login |
| GET | `/api/admin/scholarships` | List all scholarships |
| POST | `/api/admin/scholarships` | Create scholarship |
| GET | `/api/admin/scholarships/[id]` | Get scholarship by ID |
| PUT | `/api/admin/scholarships/[id]` | Update scholarship |
| DELETE | `/api/admin/scholarships/[id]` | Delete scholarship |
| GET | `/api/admin/blog` | List all blog posts |
| POST | `/api/admin/blog` | Create blog post |
| GET | `/api/admin/blog/[id]` | Get blog post by ID |
| PUT | `/api/admin/blog/[id]` | Update blog post |
| DELETE | `/api/admin/blog/[id]` | Delete blog post |
| GET | `/api/admin/testimonials` | List testimonials |
| POST | `/api/admin/testimonials` | Create testimonial |
| PUT | `/api/admin/testimonials/[id]` | Update testimonial |
| DELETE | `/api/admin/testimonials/[id]` | Delete testimonial |
| GET | `/api/admin/messages` | List contact messages |
| GET | `/api/admin/subscribers` | List newsletter subscribers |
| GET | `/api/admin/stats` | Get dashboard statistics |

## Project Structure

```
scholarship-app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seeding
│   └── prisma.config.ts       # Prisma configuration
├── src/
│   ├── app/
│   │   ├── [locale]/          # Localized pages
│   │   │   ├── page.tsx               # Home page
│   │   │   ├── layout.tsx             # Root layout with Navbar/Footer
│   │   │   ├── login/                 # User login (Google OAuth)
│   │   │   ├── profile/               # User profile & saved scholarships
│   │   │   ├── scholarships/          # Scholarship listing & details
│   │   │   │   ├── page.tsx           # Listing with filters
│   │   │   │   └── [slug]/page.tsx    # Detail page
│   │   │   ├── blog/                  # Blog pages
│   │   │   │   ├── page.tsx           # Blog listing
│   │   │   │   └── [slug]/page.tsx    # Article detail
│   │   │   ├── resources/             # Resource pages
│   │   │   │   ├── faq/page.tsx
│   │   │   │   ├── application-tips/page.tsx
│   │   │   │   └── study-guides/page.tsx
│   │   │   ├── about/                 # About page
│   │   │   ├── contact/               # Contact page
│   │   │   └── admin/                 # Admin panel
│   │   │       ├── layout.tsx         # Admin layout with sidebar
│   │   │       ├── login/page.tsx     # Admin OTP login
│   │   │       ├── page.tsx           # Dashboard
│   │   │       ├── scholarships/      # Scholarship management
│   │   │       ├── blog/              # Blog management
│   │   │       ├── testimonials/      # Testimonial management
│   │   │       ├── messages/          # Contact messages
│   │   │       └── subscribers/       # Newsletter subscribers
│   │   └── api/                       # API routes
│   │       ├── auth/[...nextauth]/    # NextAuth endpoints
│   │       ├── scholarships/          # Public scholarship API
│   │       ├── blog/                  # Public blog API
│   │       ├── user/                  # User API (authenticated)
│   │       ├── admin/                 # Admin API (protected)
│   │       ├── contact/               # Contact form API
│   │       └── newsletter/            # Newsletter API
│   ├── components/
│   │   ├── layout/
│   │   │   ├── navbar.tsx             # Main navigation with dropdowns
│   │   │   ├── footer.tsx             # Site footer
│   │   │   └── container.tsx          # Layout container
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   └── badge.tsx
│   │   ├── features/
│   │   │   ├── scholarship-card.tsx
│   │   │   ├── scholarship-filters.tsx
│   │   │   └── save-button.tsx
│   │   └── admin/
│   │       ├── scholarship-form.tsx   # Scholarship create/edit form
│   │       └── blog-form.tsx          # Blog create/edit form
│   ├── lib/
│   │   ├── auth.ts                    # NextAuth configuration
│   │   ├── auth-utils.ts              # Admin session utilities
│   │   ├── prisma.ts                  # Prisma client singleton
│   │   ├── email.ts                   # Email sending utilities
│   │   ├── utils.ts                   # General utilities
│   │   └── validations/
│   │       ├── scholarship.ts         # Scholarship Zod schema
│   │       └── blog.ts                # Blog Zod schema
│   ├── i18n/                          # Internationalization config
│   │   ├── request.ts
│   │   └── routing.ts
│   └── messages/                      # Translation files
│       ├── en.json
│       └── ar.json
├── public/                            # Static assets
├── .env                               # Environment variables
├── .env.example                       # Environment template
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Cloud Console account (for OAuth)
- Email account for sending OTP (Gmail recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scholarship-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/sudan_scholars_hub"

   # NextAuth.js
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"

   # Google OAuth (for user authentication)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Email (for admin OTP)
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT="587"
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   EMAIL_FROM="Sudan Scholars Hub <your-email@gmail.com>"
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Seed Data

The seed script creates:
- 1 Admin user (admin@sudanscholarshub.com)
- 10 Countries
- 9 Scholarships (Chevening, DAAD, Fulbright, etc.)
- 3 Testimonials
- 6 Blog posts with full content

## Admin Access

1. Go to `/en/admin/login` (or `/ar/admin/login` for Arabic)
2. Enter admin email: `admin@sudanscholarshub.com`
3. Check email for OTP code
4. Enter OTP to access admin dashboard

## Google OAuth Setup

Follow these steps to configure Google OAuth for user authentication:

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click on the project dropdown at the top and select **New Project**
3. Enter a project name (e.g., "Sudan Scholars Hub") and click **Create**
4. Wait for the project to be created and select it

### Step 2: Enable Google+ API

1. In the sidebar, go to **APIs & Services** > **Library**
2. Search for "Google+ API" or "Google Identity"
3. Click on it and press **Enable**

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** user type and click **Create**
3. Fill in the required fields:
   - **App name**: Sudan Scholars Hub
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Click **Save and Continue**
5. On the Scopes page, click **Add or Remove Scopes**
6. Select these scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
7. Click **Update** then **Save and Continue**
8. Add test users if in testing mode, then **Save and Continue**

### Step 4: Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **+ Create Credentials** > **OAuth client ID**
3. Select **Web application** as the application type
4. Enter a name (e.g., "Sudan Scholars Hub Web Client")
5. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:3000
   ```
6. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

### Step 5: Update Environment Variables

Add the credentials to your `.env` file:
```env
GOOGLE_CLIENT_ID="your-client-id-here.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-client-secret-here"
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma db push   # Push schema changes to database
npx prisma db seed   # Seed the database
npx prisma generate  # Regenerate Prisma client
```

## Key Components

### Navbar (`src/components/layout/navbar.tsx`)
- Language switcher (EN/AR)
- Resources dropdown (FAQ, Application Tips, Study Guides, Blog)
- User authentication menu
- Mobile responsive with hamburger menu

### Footer (`src/components/layout/footer.tsx`)
- Quick links to all main pages
- Resources section
- Newsletter signup
- Social media links
- Copyright

### Scholarship Form (`src/components/admin/scholarship-form.tsx`)
- Bilingual text inputs (EN/AR)
- Dynamic list inputs (eligibility, benefits, requirements)
- Country selector
- Category dropdowns (level, field, funding type)
- Featured/Published toggles
- Image URL with preview

### Blog Form (`src/components/admin/blog-form.tsx`)
- Bilingual text inputs
- Large textarea for content (markdown supported)
- Tag management with chips
- Category selection
- Auto-generated slug from title
- Featured/Published toggles

## Internationalization

The app supports English and Arabic with full RTL support:

- Routes: `/en/...` and `/ar/...`
- Translation files: `src/messages/en.json` and `ar.json`
- RTL detection: Uses `locale === 'ar'` to apply RTL styles
- Date formatting: Locale-aware date display

## Styling

- Tailwind CSS with custom color scheme
- Primary color: Blue (#2563eb)
- Responsive breakpoints: sm, md, lg, xl
- RTL support with `dir="rtl"` and `start/end` instead of `left/right`

## Enums

```typescript
// Study Level
BACHELOR, MASTER, PHD, POSTDOC, DIPLOMA, CERTIFICATE, ALL_LEVELS

// Field of Study
SCIENCE, TECHNOLOGY, ENGINEERING, MEDICINE, BUSINESS, ARTS, EDUCATION, LAW, SOCIAL_SCIENCES, ALL_FIELDS

// Funding Type
FULLY_FUNDED, PARTIALLY_FUNDED, SELF_FUNDED, VARIES

// Application Status (for saved scholarships)
NOT_STARTED, IN_PROGRESS, SUBMITTED, ACCEPTED, REJECTED

// Admin Role
SUPER_ADMIN, EDITOR
```

## Future Improvements

- [ ] Email notifications for deadline reminders
- [ ] Advanced search with AI recommendations
- [ ] Application document templates
- [ ] Community forum for students
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard

## License

MIT
