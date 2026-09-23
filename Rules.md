# RULES.md - WildConnect Engineering Standards

> **Project:** WildConnect  
> **Version:** 3.0  
> **Purpose:** This document defines the engineering standards, architecture rules, coding conventions, approved libraries, styling guidelines, and best practices that every developer and contributor must strictly follow.

---

# Table of Contents

1. Core Engineering Principles
2. Approved Technology Stack & Libraries
3. Prohibited Libraries & Patterns
4. CSS & Styling Rules (Strict Vanilla CSS)
5. Backend Architecture Rules (Controller → Service → Repository)
6. Frontend Architecture & Component Rules
7. REST API & Response Format Rules
8. Database & Prisma Rules
9. Authentication & Role-Based Access Control Rules
10. Validation & Error Handling Rules
11. Naming Conventions
12. Security & Performance Rules
13. Code Review Checklist
14. General Do's & Don'ts

---

# 1. Core Engineering Principles

Every line of code committed to WildConnect must adhere to these principles:

- **Type Safety Everywhere**: Strict TypeScript with explicit typing. Never use `any` unless absolutely unavoidable.
- **Single Responsibility Principle (SRP)**: Each function, controller, service, component, and CSS file has one clear purpose.
- **Layered Backend Separation**: Routes define endpoints → Controllers handle HTTP → Services handle business logic → Repositories execute database queries.
- **Don't Repeat Yourself (DRY)**: Abstract reusable business logic into services/utils and UI elements into reusable components/styles.
- **Readability Over Cleverness**: Code must be clear, well-commented, and maintainable.
- **Zero Business Logic in Presentation**: Keep React components and Express controllers thin and focused.

---

# 2. Approved Technology Stack & Libraries

### Frontend
| Category | Approved Library / Tool | Notes |
|---|---|---|
| **Core Framework** | React 18 | Functional components with Hooks |
| **Language** | TypeScript | Strict type checking enabled |
| **Build Tool** | Vite | Fast HMR and optimized production bundle |
| **Routing** | React Router DOM (v6) | Lazy loading & layout nesting |
| **Styling** | Standard Vanilla CSS | CSS custom properties in `src/styles/` |
| **Forms** | React Hook Form | Efficient un-controlled & controlled forms |
| **Validation** | Zod | Schema validation matching backend |
| **HTTP Client** | Axios | Configured with token interceptors |
| **Icons** | Lucide React | Consistent icon set across modules |
| **Toast Alerts** | React Hot Toast | User feedback notifications |

### Backend
| Category | Approved Library / Tool | Notes |
|---|---|---|
| **Runtime & Server**| Node.js & Express.js | Layered architectural structure |
| **Language** | TypeScript | Compiled with `tsc` |
| **ORM & Database** | Prisma v7 & PostgreSQL | Deployed on Neon Serverless PostgreSQL |
| **Validation** | Zod | Request body, query, and parameter validation |
| **Authentication** | jsonwebtoken & bcrypt | JWT access tokens, bcrypt password hashing |
| **Security** | helmet & cors | Security headers and CORS configuration |
| **File Uploads** | Multer | Disk storage with static file serving |
| **Environment** | dotenv | Loaded via centralized config |

---

# 3. Prohibited Libraries & Patterns

The following libraries and patterns are **STRICTLY FORBIDDEN**:

- ❌ **Tailwind CSS**: Do NOT install or use Tailwind CSS, utility classes, or `@apply` directives.
- ❌ **Redux / MobX**: Global state must use React Context API; server state is managed through service calls.
- ❌ **Moment.js**: Use native JavaScript `Date` APIs or lightweight date helpers.
- ❌ **jQuery / Raw DOM Manipulation**: Always use React state and refs.
- ❌ **Inline CSS Styles**: Avoid `style={{ ... }}` unless dynamic calculated positions are required.
- ❌ **Direct Database Queries in Controllers**: Controllers must NEVER call Prisma directly.
- ❌ **Raw SQL Queries**: Always use Prisma ORM queries to guarantee type safety and SQL injection protection.

---

# 4. CSS & Styling Rules (Strict Vanilla CSS)

WildConnect enforces a strict **Pure Vanilla CSS** architecture.

### 4.1 Folder Structure & File Organization
All CSS files must reside inside `frontend/src/styles/`:
```text
src/styles/
├── admin/          # Admin portal pages
├── components/     # Reusable component styles
├── globals/        # Reusable design tokens & global base styles
│   ├── variables.css   # Color tokens, shadows, radiuses, typography
│   ├── buttons.css     # Button variants (.btn-primary, .btn-secondary, etc.)
│   ├── cards.css       # Card surfaces (.card, .card-dark, .card-light)
│   ├── forms.css       # Input fields, select dropdowns, textareas
│   ├── modals.css      # Modal dialogs and backdrop overlays
│   ├── tables.css      # Data tables and responsive grid tables
│   ├── badges.css      # Status badges (.badge-success, .badge-warning, etc.)
│   ├── layout.css      # Layout wrappers and grids
│   ├── typography.css  # Heading and body styles
│   ├── utilities.css   # Spacing, alignment, and display helpers
│   └── animations.css  # Fade, rise, and spin keyframes
├── home/           # Landing page & hero sections
├── pages/          # Generic page layouts
├── partner/        # Business partner portal pages
├── public/         # Public explore pages (Destinations, Businesses, etc.)
└── tourist/        # Tourist dashboard pages
```

### 4.2 Styling Requirements
1. **Component-to-CSS Mapping**: Every React page/component must have its corresponding CSS file imported explicitly at the top of the TSX file.
2. **Semantic Class Naming**: Use descriptive, BEM-inspired class names (e.g., `.partner-dashboard-header`, `.business-room-card`, `.booking-action-btn`). Never use generic names like `.box`, `.div1`, `.container-2`.
3. **Structured Comments**: Group CSS rules with organized comment blocks:
   ```css
   /* ==========================================
      Business Listing Cards
      ========================================== */
   .business-card {
     background-color: var(--color-surface);
     border: 1px solid var(--color-border);
     border-radius: var(--radius-2xl);
     transition: var(--transition-default);
   }
   ```
4. **Use Design Tokens**: Always reference CSS custom properties from `variables.css` (`var(--color-primary)`, `var(--color-accent)`, `var(--radius-lg)`, etc.).
5. **Flexbox & CSS Grid**: Use standard Flexbox and Grid layouts instead of utility classes.
6. **Responsive Media Queries**: Enforce responsive design with standard breakpoints (`1200px`, `992px`, `768px`, `480px`).

---

# 5. Backend Architecture Rules

The backend strictly adheres to the **Controller → Service → Repository** pattern:

### 5.1 Route Layer (`src/routes/`)
- Define HTTP verbs and route paths.
- Attach middleware in order: `protect` → `restrictTo` → `validate(schema)` → `controllerMethod`.
- Never put controller logic inside route files.

### 5.2 Controller Layer (`src/controllers/`)
- Parse HTTP `req.params`, `req.query`, and `req.body`.
- Extract authenticated user data from `req.user`.
- Call the appropriate service method.
- Return structured responses using `ApiResponse.success(message, data)`.
- Wrap all async controller functions with `asyncHandler`.
- **Controllers MUST NOT execute Prisma queries or contain domain business rules.**

### 5.3 Service Layer (`src/services/`)
- House all business rules, calculations, status transitions, and data enrichment.
- Coordinate multiple repositories.
- Execute atomic transactions via `prisma.$transaction` when modifying related records or checking inventory overlaps.
- Dispatch in-app notifications via `notificationService`.
- Throw custom `AppError` subclasses (`BadRequestError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError`).
- **Services MUST NOT access Express `req` or `res` objects.**

### 5.4 Repository Layer (`src/repositories/`)
- Encapsulate all database queries using Prisma Client (`prisma.<model>.<operation>`).
- Filter out soft-deleted records (`where: { deletedAt: null }`).
- Return raw database records or typed entities back to the service layer.
- **Repositories MUST NOT contain business logic.**

---

# 6. Frontend Architecture & Component Rules

1. **Component Hierarchy**:
   - `Pages/`: Assemble layouts, custom hooks, and UI components.
   - `Components/Layout/`: Provide consistent page framing (`PublicLayout`, `TravelerLayout`, `PartnerLayout`, `AdminLayout`).
   - `Components/UI/`: Pure, reusable presentation elements (`Button`, `Modal`, `Badge`, `Card`, `Spinner`, `ImageUpload`).
   - `Components/Common/`: Cross-cutting concerns (`ProtectedRoute`).
2. **Custom Hooks**: Extract stateful component logic into custom hooks prefixed with `use` (e.g., `useAuth()`).
3. **Data Fetching**: All API calls must go through dedicated service modules in `src/services/` (e.g., `business.service.ts`, `booking.service.ts`, `kyc.service.ts`), which use the centralized Axios instance (`api.ts`).
4. **Forms**: Use `react-hook-form` paired with `zodResolver` for client-side form validation.

---

# 7. REST API & Response Format Rules

### Standard URL Conventions
- Use nouns in lowercase plural form: `/api/businesses`, `/api/destinations`, `/api/bookings`, `/api/kyc`, `/api/vehicles`, `/api/equipment`, `/api/calendar-blocks`, `/api/payouts`.
- Specific actions use standard HTTP verbs:
  - `GET`: Retrieve resource(s)
  - `POST`: Create a new resource or execute a non-idempotent action
  - `PUT`: Full replacement / update of a resource
  - `PATCH`: Partial update of specific fields / status change
  - `DELETE`: Remove / soft-delete a resource

### Standard Success Response (`ApiResponse.success`)
```json
{
  "success": true,
  "message": "Business listing created successfully",
  "data": {
    "id": "c1f76d72-8822-488b-a2c6-11f8b1a8f901",
    "name": "Tadoba Jungle Camp",
    "status": "DRAFT"
  }
}
```

### Standard Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "contactEmail",
      "message": "Invalid email address format"
    }
  ]
}
```

---

# 8. Database & Prisma Rules

1. **Schema Modifications**: Any schema change must be made in `backend/prisma/schema.prisma` followed by `npx prisma db push` and `npx prisma generate`.
2. **Client Output**: The Prisma client must always generate to `src/generated/prisma`.
3. **Soft Deletion vs Account Removal**: 
   - For entity archiving, set `deletedAt = new Date()` and filter queries by `deletedAt: null`.
   - For admin user moderation and privacy requests, clean related notifications/inquiries and delete records safely.
4. **Independent Master Entities**: `Destination` and `Resort` are platform-level master entities and must NOT be bound to individual admin user IDs. Deleting an admin user never impacts destination or resort master records.
5. **Atomic Transactions**: Multi-record writes and inventory-dependent bookings must use `prisma.$transaction`.
6. **Foreign Key Integrity**:
   - Use `onDelete: Cascade` for child records owned strictly by a parent (`PartnerKyc` on `User`, `BusinessRoom`, `BusinessVehicle`, `BusinessEquipment`, `BusinessInventoryBlock`, `BusinessInquiry` on `Business`).
   - Use `onDelete: Restrict` on critical entities (`Destination`, `Resort`, `Booking`) to prevent accidental cascading deletions.

---

# 9. Authentication & Role-Based Access Control Rules

### Roles
The system strictly enforces three distinct roles:
1. `TOURIST`: Safari travelers, tourists, and general registered users.
2. `BUSINESS_PARTNER`: Verified owners of lodges, homestays, transport, and rental services.
3. `ADMIN`: Platform operators, KYC verifiers, and content moderators.

### Security Directives
- **Password Hashing**: Always hash passwords with `bcrypt` (minimum 10 salt rounds) before database insertion.
- **JWT Storage**: Tokens stored in client `localStorage` and transmitted via `Authorization: Bearer <token>`.
- **Route Guarding**: All protected routes must verify permissions on **both** the backend (`auth.middleware.ts`) and the frontend (`ProtectedRoute.tsx`).
- **Document Protection**: KYC documents and financial proof URLs must only be accessible to authorized users.

---

# 10. Validation & Error Handling Rules

1. **Never Trust Client Input**: All API inputs (body, query, params) must be validated using Zod schemas on the backend.
2. **Centralized Error Handler**: All errors caught in async routes are forwarded to `errorHandler.ts`. Never write custom `res.status(500)` blocks in controllers.
3. **User-Friendly Error Messages**: Never expose database query errors or stack traces to frontend users.

---

# 11. Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| **Backend Controllers** | `kebab-case.controller.ts` | `business.controller.ts`, `partnerKyc.controller.ts` |
| **Backend Services** | `kebab-case.service.ts` | `booking.service.ts`, `payout.service.ts` |
| **Backend Repositories** | `kebab-case.repository.ts` | `destination.repository.ts` |
| **Backend Validators** | `kebab-case.validator.ts` | `triprequest.validator.ts`, `kyc.validator.ts` |
| **Backend Routes** | `kebab-case.routes.ts` | `businessBooking.routes.ts`, `partnerKyc.routes.ts` |
| **Frontend Pages** | `PascalCase.tsx` | `MyBusinesses.tsx`, `PartnerKyc.tsx`, `AdminDashboard.tsx` |
| **Frontend Components** | `PascalCase.tsx` | `LoadingSpinner.tsx`, `ProtectedRoute.tsx`, `ImageUpload.tsx` |
| **Frontend Services** | `kebab-case.service.ts` | `business.service.ts`, `kyc.service.ts` |
| **CSS Files** | `PascalCase.css` / `kebab-case.css` | `BusinessDetails.css`, `variables.css` |
| **CSS Classes** | `kebab-case` | `.hero-title`, `.partner-room-grid` |
| **TypeScript Types / Enums**| `PascalCase` | `ApprovalStatus`, `BusinessType`, `KycStatus`, `PayoutStatus` |

---

# 12. Security & Performance Rules

1. **Environment Secrets**: Never commit `.env` or sensitive API keys. Use `.env.example` as a template.
2. **Pagination**: Always paginate large list endpoints (`limit` and `page` query parameters).
3. **Lazy Loading**: Lazy-load all non-critical React route pages using `React.lazy()` and `Suspense`.
4. **Sanitized Uploads**: Validate file sizes and MIME types in Multer middleware before writing to disk.

---

# 13. Code Review Checklist

Before approving or merging code, verify:
- [ ] No Tailwind CSS classes or utilities used.
- [ ] All new components have a dedicated CSS file in `src/styles/`.
- [ ] Backend follows Controller → Service → Repository layering.
- [ ] Zod schema validation added for all new API inputs.
- [ ] Authorization checks applied (`protect`, `restrictTo`).
- [ ] No direct Prisma calls in controllers.
- [ ] Type safety maintained with zero avoidable `any` types.
- [ ] All async functions wrapped with `asyncHandler`.
- [ ] Responsive design verified on mobile (480px) and desktop (1200px).

---

# 14. General Do's & Don'ts

### ✅ DO
- Do write pure Vanilla CSS with variables from `variables.css`.
- Do keep controllers thin and services rich in business logic.
- Do use `$transaction` for concurrent or multi-table updates.
- Do handle loading and empty states in every UI view.
- Do test both tourist and partner roles when building shared marketplace features.

### ❌ DON'T
- Don't install utility CSS libraries (Tailwind, UnoCSS).
- Don't mix frontend and backend code.
- Don't commit hardcoded API secrets or database credentials.
- Don't bypass server-side validation relying solely on client form checks.
- Don't use raw SQL strings without justification.