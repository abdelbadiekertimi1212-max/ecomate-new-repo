# ECOMATE — MASTER ENGINEERING PROMPT v1.0
> Complete Audit, Repair & Upgrade Prompt — Engineered for Maximum AI Output Quality

---

## 🔴 ROLE & CONTEXT

You are a **Senior Fullstack Engineer + UI/UX Architect + Cybersecurity Specialist** working on **Ecomate** — a B2B SaaS platform for the Algerian e-commerce market. The platform is built with:

- **Framework:** Next.js 14+ (App Router), React, TypeScript (strict)
- **Styling:** Tailwind CSS + Shadcn UI, Framer Motion
- **Icons:** Lucide React
- **Database:** PostgreSQL via Prisma ORM
- **State:** Zustand + React Context
- **i18n:** `next-intl` (Arabic/RTL + English/LTR)
- **Auth:** NextAuth.js or Clerk
- **Deployment target:** Vercel

Your mission: **Perform a zero-to-finish audit of the entire codebase**, fix every bug, security hole, UX failure, and UI inconsistency — then implement a complete set of upgrades listed below. Every single character in this codebase must be intentional, secure, and production-ready.

---

## 📋 EXECUTION PROTOCOL

> **CRITICAL INSTRUCTION**: Do NOT generate everything at once. Work through the tasks in the ORDER listed below. Before touching any file, **read it first and understand its current state**. After each major section, confirm what was done and what changed. Think step-by-step. Verify before moving to the next section.

---

## 📦 PHASE 0 — FULL CODEBASE REVIEW (Start Here)

Before writing a single line of code, perform a complete structural audit:

```
AUDIT CHECKLIST:
□ Map all routes: /, /dashboard, /admin, /api/**
□ Identify every "use client" component — is it truly needed?
□ Find all Server Components — are they fetching correctly?
□ Check all environment variables — are they validated at startup?
□ List all API routes — are they protected? Rate-limited? Typed?
□ Review Prisma schema — check all relations, indexes, cascades
□ Check next-intl setup — are all namespaces correct for AR + EN?
□ Identify any hardcoded strings that should be i18n keys
□ Find all TODO/FIXME/console.log — remove or resolve each one
□ Scan for any direct .env access in client-side code
□ Check for missing loading.tsx, error.tsx, not-found.tsx files
□ Verify all dynamic routes have generateMetadata()
```

**Output the audit as a structured report before making any changes.**

---

## 🔐 PHASE 1 — SECURITY HARDENING (Non-Negotiable)

### 1.1 SQL Injection Prevention

```typescript
// ENFORCE: All database queries must use Prisma parameterized syntax
// NEVER: prisma.$queryRaw`SELECT * FROM users WHERE id = ${userId}` (string interpolation)
// ALWAYS: prisma.$queryRaw`SELECT * FROM users WHERE id = ${Prisma.sql`${userId}`}`
// BETTER: Use Prisma model queries: prisma.user.findUnique({ where: { id: userId } })

// Add input validation middleware using Zod on ALL API routes:
import { z } from 'zod'
const schema = z.object({ /* define strict shape */ })
const validated = schema.safeParse(req.body)
if (!validated.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
```

### 1.2 API Route Protection

Every `/api/**` route must implement this pattern:

```typescript
// 1. Auth check first
const session = await getServerSession(authOptions)
if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

// 2. Role check for /api/admin/**
if (route.startsWith('/admin') && session.user.role !== 'ADMIN') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// 3. Rate limiting (use upstash/ratelimit or custom middleware)
// 4. Input validation with Zod
// 5. Error handling with try/catch — never expose stack traces in production
```

### 1.3 Admin Panel Isolation

```
□ /admin routes: double-check middleware.ts blocks all non-ADMIN roles
□ Admin layout must re-verify session server-side on EVERY render
□ All admin API routes must check role === 'ADMIN' independently
□ Never trust client-sent role claims — always verify from DB session
□ Add CSRF protection to all mutating admin endpoints
□ Add audit logging: every admin action logs (userId, action, target, timestamp)
```

### 1.4 Additional Security

```
□ Set all security headers in next.config.js:
  - Content-Security-Policy
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy
□ Validate webhook signatures (Make.com secret header check)
□ Sanitize all user-generated content before rendering (use DOMPurify or server-side)
□ Ensure no sensitive data (API keys, DB URLs) can leak to the client bundle
□ Add .env.example with all required variables documented
```

---

## 🌐 PHASE 2 — INTERNATIONALISATION FIX (Arabic/RTL)

This is critical. The Arabic version must be completely indistinguishable from a native Arabic product.

### 2.1 RTL Rules — Enforce Everywhere

```typescript
// In layout.tsx — dynamically set dir and lang
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>

// Tailwind RTL pattern — use logical properties everywhere:
// ❌ WRONG: ml-4, pl-3, left-0, text-left, flex-row
// ✅ CORRECT: ms-4, ps-3, start-0, text-start, (rtl:flex-row-reverse or logical)

// Framer Motion — mirror animations for RTL:
// LTR: initial={{ x: -20 }} → RTL: initial={{ x: locale === 'ar' ? 20 : -20 }}
```

### 2.2 Pages/Components to Fix for RTL

```
□ Navigation / Header — logo position, menu items direction, language toggle
□ Hero Section — text alignment, animation direction
□ All sections on landing page
□ Login / Register forms — labels, inputs, error messages, button positions
□ Dashboard layout — sidebar direction, stats cards, table columns
□ Admin panel — all tables, forms, modals
□ Footer — columns order, text alignment
```

### 2.3 Translation Completeness

```
□ Audit ALL translation JSON files (messages/en.json + messages/ar.json)
□ Every key in EN must exist in AR — add professional Arabic copy, not Google Translate
□ Dashboard UI strings must have AR equivalents
□ Error messages must be translated
□ Form labels, placeholders, validation messages — all translated
□ Dates, numbers, currencies must use Arabic locale formatting where appropriate
```

---

## 🎨 PHASE 3 — LANDING PAGE UI FIXES & UPGRADES

### 3.1 Hero Section — Fix & Upgrade

```
BUGS TO FIX:
□ "Grow your business." — the period "." must render visibly. Debug: is it cut off
  by overflow:hidden? line clamp? a CSS transform? Find the exact cause and fix it.
□ "Try it Now" button — change text to: EN: "Book a Demo" | AR: "احجز عرضاً"
  (We have no free trial. Remove all references to "free trial" across the entire site.)

ANIMATION UPGRADE:
□ The hero animation appears inside a box/container — diagnose the cause:
  - Is there an overflow:hidden wrapper cutting it?
  - Is there a background color creating a visible boundary?
  - Are z-index layers misaligned?
□ The hero animation should feel OPEN and breathable — it should bleed into the
  surrounding content, not feel contained. Remove any hard borders/backgrounds that
  create the "box" effect. Use subtle radial gradients or floating particles that
  extend beyond the hero card boundary.
□ Add a subtle ambient particle or mesh animation that responds to scroll position
  using Framer Motion's useScroll() + useTransform()
```

### 3.2 Partnerships Section — Upgrade UI

```
□ Current state: likely a flat row of logos — upgrade to:
  - Animated infinite horizontal marquee (CSS animation, not JS)
  - Two rows scrolling in opposite directions for visual depth
  - Each logo in a frosted glass card (backdrop-filter: blur on supported browsers,
    fallback to subtle border)
  - Add a headline: EN: "Trusted by Algeria's top brands"
                    AR: "موثوق به من قِبل أبرز العلامات التجارية في الجزائر"
  - Pause animation on hover
```

### 3.3 "All-in-one Platform. Zero Fragmentation." Section — Full Redesign

REQUIREMENT: ALL Ecomate services must be visible here with descriptions.

Services to include (with icons from Lucide React):

```
1. AI Sales Chatbot        (Bot icon)
   EN: "Automate customer conversations 24/7 on Instagram & Facebook
        — from first message to confirmed order."
   AR: "أتمتة محادثات العملاء على مدار الساعة عبر إنستغرام وفيسبوك
        — من أول رسالة حتى تأكيد الطلب."

2. EcoTrack Fulfillment    (Package icon)
   EN: "Real-time delivery tracking across all 58 Algerian Wilayas
        with Yalidine API integration."
   AR: "تتبع التوصيل في الوقت الفعلي عبر جميع الولايات الـ 58 الجزائرية
        مع تكامل واجهة برمجة يالدين."

3. ePayment Integration    (CreditCard icon)
   EN: "Secure digital payment flows built for the Algerian market."
   AR: "تدفقات دفع رقمية آمنة مصمّمة خصيصاً للسوق الجزائرية."

4. Web Development         (Code2 icon)
   EN: "Custom e-commerce websites and landing pages built to
        convert visitors into customers."
   AR: "مواقع تجارة إلكترونية مخصصة وصفحات هبوط مصممة لتحويل الزوار إلى عملاء."

5. Landing Pages           (Layout icon)
   EN: "High-converting campaign pages designed and deployed fast."
   AR: "صفحات حملات تسويقية ذات تحويل عالٍ، مصممة ومنشورة بسرعة."

6. Content & Stock         (Archive icon)
   EN: "Product photography, content creation, and inventory
        organisation — all in one place."
   AR: "تصوير المنتجات، إنشاء المحتوى، وتنظيم المخزون — كل ذلك في مكان واحد."

7. Creative Studio         (Palette icon)
   EN: "Branding, graphic design, video editing, and ad creatives
        that make your brand unforgettable."
   AR: "هوية بصرية، تصميم جرافيك، مونتاج فيديو، وإبداعات إعلانية تجعل علامتك لا تُنسى."

8. Marketing & Growth      (TrendingUp icon)
   EN: "Social media management, paid ads, and growth strategies
        tailored to Algerian consumer behaviour."
   AR: "إدارة وسائل التواصل الاجتماعي، الإعلانات المدفوعة، واستراتيجيات النمو
        المصمّمة لسلوك المستهلك الجزائري."
```

UI PATTERN: Interactive card grid.
- Default: 4-column grid on desktop, 2 on tablet, 1 on mobile
- Each card: icon + service name + 2-line description
- On hover: card elevates, accent color border appears, subtle arrow icon shows
- Active/selected card: highlighted with brand primary color
- All text is i18n-translated (EN + AR)

### 3.4 Live Dashboard Preview Section — Update to Match Real Dashboard

```
□ The mockup dashboard shown on the landing page must mirror the REAL client
  dashboard UI — same sidebar structure, same card styles, same data format
□ Update the preview to show:
  - Order status summary (Pending / Shipped / Delivered)
  - A mini orders table (3-4 rows, realistic Algerian data: Wilaya names in DZD)
  - A delivery tracker widget
  - Revenue stat cards
□ Use Framer Motion to animate the dashboard preview on scroll-into-view
□ This section must be responsive — on mobile, show a phone mockup frame;
  on desktop, show a laptop/browser frame
```

### 3.5 Live AI Preview — Chatbot UI Upgrade

REQUIREMENT: The AI chatbot preview must show a realistic sales conversation flow.

Update the chat bubble sequence to show:

```
👋 Bot: "Bonjour! Bienvenue chez [Brand]. Comment puis-je vous aider aujourd'hui?"

[🛒 Start Shopping]  [📦 Track My Order]  [💬 Talk to Agent]   ← Action buttons

👤 User: "Je veux commander les baskets blanches taille 42"

👋 Bot: "Parfait! Voici votre récapitulatif:"
  • Produit: Baskets Blanches — Taille 42
  • Prix: 4,500 DZD
  • Livraison: Choisissez votre wilaya

[✅ Confirm Order]  [🛒 Add to Cart]  [🛍️ Continue Shopping]   ← CTA buttons
```

Implementation:
- Animate bubbles appearing one by one with staggered delay (Framer Motion)
- Buttons must be styled to match a WhatsApp/Instagram bot style
- Add a typing indicator animation between messages
- Loop the animation after 8 seconds
- Fully translated: EN preview shows English flow, AR shows Arabic flow

### 3.6 Pricing Section — Complete Redesign

CURRENT: Generic pricing table → REPLACE WITH: Service-specific pricing explorer

NEW DESIGN PATTERN:
```
┌─────────────────────────────────────────────────────────────────────┐
│                     "Transparent Pricing"                           │
│              "Choose what your business needs"                      │
│                                                                     │
│  [AI Sales] [EcoTrack] [Web Dev] [Creative] [Marketing] [Bundle]   │
│  ← Clickable tab pills ─────────────────────────────────────────→  │
│                                                                     │
│  When "AI Sales" is selected, show:                                 │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐                           │
│  │ Starter │  │  Growth │  │   Pro    │                           │
│  │         │  │ Popular │  │          │                           │
│  │ 15,000  │  │ 29,000  │  │  Custom  │                           │
│  │  DZD/mo │  │  DZD/mo │  │          │                           │
│  │ Features│  │ Features│  │ Features │                           │
│  └─────────┘  └─────────┘  └──────────┘                           │
└─────────────────────────────────────────────────────────────────────┘
```

Implementation requirements:
- Tab switching uses Framer Motion AnimatePresence for smooth transitions
- Prices displayed in DZD (Algerian Dinar) — format: "15,000 DZD / شهر"
- Each service has 2-3 tiers with realistic Algerian market pricing
- "Bundle" tab shows a combined package with a discount badge
- All tab labels and pricing copy are i18n translated
- CTA buttons: "Book a Demo" (not "Free Trial") → link to Calendly or contact form
- Add a note: "All prices exclude VAT / الأسعار لا تشمل الضريبة"

---

## 📧 PHASE 4 — EMAIL VERIFICATION FIX

```
DIAGNOSIS STEPS:
1. Check the email provider configured (Resend / SendGrid / SMTP / Nodemailer)
2. Verify the EMAIL_FROM, SMTP_HOST, SMTP_PORT env variables exist and are valid
3. Check the verification email template — is the token being generated correctly?
4. Check the /api/auth/verify-email route — is it consuming the token correctly?
5. Check token expiry — is it too short? (default should be 24 hours)
6. Test with a real email in development using Resend or Mailtrap

IMPLEMENTATION REQUIREMENTS:
□ Use Resend (resend.com) as the email provider — simple and reliable
□ Create a professional HTML email template with Ecomate branding:
  - Logo at top
  - Clear verification button (not a raw link)
  - Arabic + French text (bilingual email)
  - Fallback plain text version
□ Token must be: cryptographically random, stored hashed in DB, expire in 24h
□ After clicking verify link: redirect to /dashboard with success toast
□ If token expired: show clear error with "Resend verification email" button
□ Rate-limit verification email sends: max 3 per hour per email address
```

---

## 🗄️ PHASE 5 — DATABASE & SCHEMA REVIEW

```typescript
// REVIEW AND ENFORCE this complete schema structure:

model User {
  id             String    @id @default(cuid())
  email          String    @unique
  emailVerified  DateTime?
  hashedPassword String?
  name           String?
  role           Role      @default(CLIENT)
  locale         String    @default("fr") // "ar" | "fr" | "en"
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  client         Client?
  accounts       Account[]
  sessions       Session[]
  auditLogs      AuditLog[]
}

model Client {
  id            String   @id @default(cuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  businessName  String
  phone         String?
  wilaya        String?
  driveFolderId String?  // For Creative Studio Google Drive integration

  orders        Order[]
  inventory     InventoryItem[]
  products      Product[]
  createdAt     DateTime @default(now())
}

model Order {
  id            String       @id @default(cuid())
  clientId      String
  client        Client       @relation(fields: [clientId], references: [id])
  customerName  String
  customerPhone String
  wilaya        String       // One of 58 Algerian Wilayas
  product       String
  size          String?
  quantity      Int          @default(1)
  totalPrice    Decimal      @db.Decimal(10, 2) // DZD
  deliveryType  DeliveryType
  deliveryPrice Decimal      @db.Decimal(10, 2)
  status        OrderStatus  @default(PENDING)
  trackingCode  String?      // Yalidine tracking code
  yalidineData  Json?        // Raw API response stored
  source        String?      // "instagram" | "facebook" | "manual"
  notes         String?
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  @@index([clientId, status])
  @@index([wilaya])
  @@index([createdAt])
}

model Product {
  id        String   @id @default(cuid())
  clientId  String
  client    Client   @relation(fields: [clientId], references: [id])
  name      String
  nameAr    String?  // Arabic product name
  sku       String?
  price     Decimal  @db.Decimal(10, 2)
  category  String?
  imageUrl  String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  inventory InventoryItem[]
  @@unique([clientId, sku])
}

model InventoryItem {
  id        String   @id @default(cuid())
  clientId  String
  productId String
  client    Client   @relation(fields: [clientId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])
  size      String?
  color     String?
  quantity  Int
  minStock  Int      @default(5) // Alert threshold
  warehouse String?
  updatedAt DateTime @updatedAt

  @@unique([clientId, productId, size, color])
  @@index([clientId])
}

model AuditLog {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  action    String   // e.g., "ORDER_UPDATED", "USER_DELETED"
  target    String?  // Entity ID that was affected
  metadata  Json?    // Before/after state or extra context
  ipAddress String?
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([createdAt])
}

enum Role         { CLIENT ADMIN STAFF }
enum OrderStatus  { PENDING CONFIRMED SHIPPED DELIVERED RETURNED CANCELLED }
enum DeliveryType { HOME STOP_DESK }
```

```
CHECK:
□ All relations have proper onDelete behaviour
□ All financial fields use Decimal, not Float
□ Indexes cover all common query patterns
□ No N+1 queries in any page's data fetching
□ Prisma Client is a singleton (lib/prisma.ts)
```

---

## 🔧 PHASE 6 — BUG FIXES & CODE QUALITY

```
SYSTEMATIC CHECK FOR EVERY FILE:

□ TypeScript errors — zero tolerance. Run: npx tsc --noEmit
□ ESLint warnings — fix all. Run: npx eslint . --ext .ts,.tsx
□ Missing 'use client' directives where hooks are used
□ Stale/missing React keys in all .map() calls
□ Unhandled Promise rejections — all async functions need try/catch
□ Missing error boundaries around complex client components
□ All fetch calls in Server Components need proper error handling
□ Check all useEffect dependency arrays — no missing or incorrect deps
□ Zustand stores — check for hydration mismatches (SSR/CSR)
□ next-intl — check all useTranslations() calls match the JSON keys exactly
□ Image optimization — all <img> tags converted to next/image with proper sizes
□ All external links have rel="noopener noreferrer"
□ Forms: all inputs have associated labels (accessibility)
□ Loading states — every data fetch shows a skeleton or spinner
□ Empty states — every list/table handles the case of 0 results gracefully
```

---

## 🚀 PHASE 7 — PERFORMANCE & FUTURE-PROOFING

```
□ Add React Suspense boundaries with proper fallbacks around all async components
□ Implement proper Next.js caching strategy:
  - Static pages: export const revalidate = 3600
  - Dynamic dashboard: no-store or tag-based revalidation
□ Add @vercel/analytics and @vercel/speed-insights
□ Set up proper error monitoring (add Sentry or LogRocket placeholders)
□ Create a /api/health endpoint that checks DB connectivity
□ Add a CHANGELOG.md and document this entire update
□ Ensure all components accept a className prop for extensibility
□ Extract all magic numbers/strings into constants files (lib/constants.ts)
□ Create a complete README.md with: setup, env vars, architecture diagram
```

---

## ✅ FINAL VALIDATION CHECKLIST

Before considering this done, verify ALL of the following:

```
SECURITY:
□ SQL injection: impossible (Prisma only, no raw string interpolation)
□ XSS: all user content sanitized before rendering
□ CSRF: mutations protected
□ Auth: every protected route verified server-side
□ Admin: completely isolated, role verified in middleware AND in each route

UI/UX:
□ "Try it Now" → "Book a Demo" (EN) / "احجز عرضاً" (AR) — everywhere
□ "Grow your business." — period visible ✓
□ Hero animation — no box effect, open and fluid ✓
□ All 8 services visible in platform section with descriptions ✓
□ Live Dashboard matches real dashboard ✓
□ AI preview shows: Start Shopping, Confirm Order, Add to Cart, Continue Shopping ✓
□ Pricing: service tabs with service-specific plans in DZD ✓
□ Partnerships: animated marquee, professional look ✓

INTERNATIONALISATION:
□ Arabic: every single page, every section, every button, every form ✓
□ RTL layout flips perfectly on language toggle ✓
□ Dashboard — Arabic works ✓
□ Login/Register — Arabic works ✓
□ Animations mirror direction for RTL ✓

FUNCTIONALITY:
□ Email verification sends and works end-to-end ✓
□ Webhook endpoint /api/webhooks/orders accepts Make.com payload ✓
□ Admin panel completely inaccessible to non-admin users ✓

CODE QUALITY:
□ Zero TypeScript errors ✓
□ Zero ESLint errors ✓
□ No console.log in production code ✓
□ All environment variables documented in .env.example ✓
```

---

## 🗂️ OUTPUT FORMAT EXPECTATION

For each Phase, structure your output like this:

```
## Phase [N] — [Name]

### Files Modified:
- `path/to/file.tsx` — reason for change

### Files Created:
- `path/to/new-file.ts` — purpose

### Issues Found & Fixed:
1. [Issue description] → [Fix applied]

### Code:
[Show the complete, updated file contents — not just diffs]

### Verification:
[Explain how to confirm this phase is working correctly]
```

---

> **Context for the AI:** Ecomate is a B2B all-in-one E-commerce Growth, Fulfillment, and Marketing Agency platform built for the Algerian market. It bridges the gap between social media sales (Instagram/Facebook) and physical logistics. The application serves as both a client-facing SaaS dashboard and an internal agency management tool. The platform has three routing zones: Public Site (/), Client Dashboard (/dashboard), and Admin Panel (/admin). Every decision should serve the goal of making Ecomate look like a world-class, professional platform. Do not suggest shortcuts. Do not simplify what needs to be complex. Build it right — the first time.
