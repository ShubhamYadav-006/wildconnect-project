# WildConnect - System Architecture Document

**Version:** 3.0  
**Status:** Approved & Current Implementation  
**Project Type:** Final Year Major Project + Wildlife Tourism Marketplace MVP  
**Document Owner:** WildConnect Team  
**Last Updated:** September 2026  

---

# Table of Contents

## Phase 1 — Foundation Architecture
1. Document Purpose & Audience
2. Architecture Overview
3. Design Principles
4. Technology Stack & Ecosystem
5. Architectural Decisions & Standards

---

## Phase 2 — Application Architecture
6. Backend Layered Architecture (Controller → Service → Repository)
7. Frontend Component & Layout Architecture
8. Database Architecture Overview
9. Request Lifecycle & Atomic Transaction Flow
10. Authentication & Role-Based Authorization
11. Complete REST API Specifications

---

## Phase 3 — Project Structure & Navigation
12. Monorepo Project Structure
13. Backend Directory Architecture
14. Frontend Directory Architecture
15. Application Navigation & Route Architecture
16. CSS Styling & Design System Architecture

---

## Phase 4 — Engineering, Security & Scalability
17. Security Architecture
18. State Management Strategy
19. Error Handling & Validation Pipeline
20. Cloud Deployment Topology
21. Architecture Summary

---

# Phase 1 — Foundation Architecture

## 1. Document Purpose & Audience

This document serves as the definitive technical blueprint for the **WildConnect** platform. It details the technical structure, communication protocols, component interactions, database design, API design, coding standards, and deployment topology.

### Intended Audience
- Core Software Engineers & Contributors
- Technical Evaluators & Project Reviewers
- System Maintainers

---

## 2. Architecture Overview

WildConnect is engineered as a decoupled, full-stack web application designed for high performance, type safety, maintainability, and domain-specific wildlife tourism management.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (FRONTEND)                         │
│  React 18 • TypeScript • Vite • React Router v6 • Pure Vanilla CSS    │
│  Layouts: PublicLayout | TravelerLayout | PartnerLayout | AdminLayout  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS (JSON / REST APIs)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        API LAYER (EXPRESS BACKEND)                     │
│  Node.js • Express • TypeScript • Zod Validation • JWT Middleware     │
│  Layered: Routes ──► Controllers ──► Services ──► Repositories         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Type-safe Queries (Prisma ORM v7)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       PERSISTENCE LAYER (DATABASE)                     │
│         Neon Serverless PostgreSQL (17 Normalized Tables)              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Design Principles

1. **Separation of Concerns**: Strict boundary between presentation, routing, business logic, data persistence, and data validation.
2. **Type Safety Across Layers**: End-to-end TypeScript enforcement across frontend components, API contracts, services, and Prisma database models.
3. **Transactional Integrity**: Critical operations (multi-resource bookings, date overlap calculations, and escrow records) execute inside atomic database transactions (`$transaction`).
4. **Pure Vanilla CSS Standards**: 100% standard Vanilla CSS with centralized design tokens (`src/styles/globals/variables.css`). Tailwind CSS is strictly prohibited.
5. **Role-Based Isolation**: Isolated access controls, layouts, and route guards for `TOURIST`, `BUSINESS_PARTNER`, and `ADMIN` users.

---

## 4. Technology Stack & Ecosystem

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM (v6) with lazy-loading & code-splitting
- **Styling**: Standard Vanilla CSS with CSS custom properties (Tokens) & modular stylesheets
- **HTTP Client**: Axios with centralized request/response interceptors
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma v7 (`@prisma/client`) with client output at `src/generated/prisma`
- **Database**: PostgreSQL (hosted on Neon)
- **Validation**: Zod (request body, query parameters, and route params)
- **Security**: JSON Web Tokens (`jsonwebtoken`), `bcrypt` password hashing, Helmet
- **File Uploads**: Multer (multi-image handling with static file serving)
- **Logging**: Morgan

---

# Phase 2 — Application Architecture

## 6. Backend Layered Architecture

The backend implements a classic **Controller → Service → Repository** pattern:

```text
Incoming HTTP Request
        │
        ▼
   Route Layer          (Defines endpoints, applies Auth & Zod validation middleware)
        │
        ▼
 Controller Layer       (Extracts req params/body, invokes services, formats ApiResponse)
        │
        ▼
  Service Layer         (Contains business logic, domain rules, notifications, transactions)
        │
        ▼
Repository Layer        (Executes Prisma queries against the database)
        │
        ▼
   Prisma ORM           (Type-safe SQL query generation)
        │
        ▼
PostgreSQL Database
```

### Layer Responsibilities
- **Routes (`src/routes/`)**: Map URI patterns to controllers and bind middleware (`protect`, `restrictTo`, `validate`, `upload`).
- **Controllers (`src/controllers/`)**: HTTP-aware handlers that parse requests, call corresponding services, and return standardized JSON responses via `ApiResponse`.
- **Services (`src/services/`)**: Business logic engines containing domain rules, state transitions, unique slug generation, date overlap checks, and notification triggers.
- **Repositories (`src/repositories/`)**: Encapsulate all database CRUD operations using Prisma queries.
- **Validators (`src/validators/`)**: Zod schemas validating all input payloads.

---

## 7. Frontend Component & Layout Architecture

The frontend uses component composition with specialized layout wrappers:

```text
                              App Router
                                  │
      ┌───────────────────┬───────┴───────────┬────────────────────┐
      ▼                   ▼                   ▼                    ▼
 PublicLayout      TravelerLayout       PartnerLayout        AdminLayout
 (Header, Footer,  (Sidebar, Navbar,   (Partner Sidebar,    (Admin Sidebar,
  Public Pages)     Tourist Dashboard)  Inventory & Rooms)   Command Center)
```

1. **`PublicLayout`**: Floating glassmorphic navigation bar, footer, and container for public exploration pages.
2. **`TravelerLayout`**: Authenticated traveler portal for managing profile, trip requests, proposals, bookings, and notifications.
3. **`PartnerLayout`**: Dedicated business owner portal for KYC verification, properties, multi-service inventory (rooms, vehicles, gear), calendar blocks, received bookings, inquiries, and escrow finances.
4. **`AdminLayout`**: Administrative operations center for KYC reviews, destinations, partner approvals, custom proposals builder, global bookings, and content moderation.

---

## 8. Database Architecture Overview

The database contains 17 normalized models deployed on PostgreSQL (Neon):
1. **Identity & Access**: `User`, `PartnerKyc`
2. **Destinations & Stays**: `Destination`, `Resort`
3. **Partner Marketplace**: `Business`, `BusinessRoom`, `BusinessVehicle`, `BusinessEquipment`, `BusinessInventoryBlock`, `BusinessBooking`, `PayoutTransaction`, `BusinessInquiry`
4. **Managed Safari Planning**: `TripRequest`, `Proposal`, `Booking`
5. **Content & Alerts**: `Article`, `Notification`

*Detailed model definitions, foreign keys, and indexes are documented in [DATABASE.md](file:///d:/MERN_PRACTICE/MajorProject/WildConnect/DATABASE.md).*

---

## 9. Request Lifecycle & Atomic Transaction Flow

### Multi-Resource Direct Booking Lifecycle
```text
1. Client checks live availability (checks date overlap + inventory blocks)
2. Client sends POST /api/business-bookings
   └── Middleware: `protect` (verifies JWT)
   └── Controller: `createBusinessBooking`
       └── Prisma Atomic Transaction:
           ├── Step 1: Query Business and resource (Room / Vehicle / Equipment)
           ├── Step 2: Verify business status === 'APPROVED'
           ├── Step 3: Count active bookings and blackout blocks in date range:
           │          (startDate < item.endDate AND endDate > item.startDate)
           ├── Step 4: Verify remaining units >= 1
           ├── Step 5: Insert BusinessBooking (status: 'CONFIRMED')
           └── Step 6: Insert PayoutTransaction (status: 'HELD_IN_ESCROW')
       ├── Trigger notification to Business Partner (BUSINESS_NEW_BOOKING_PARTNER)
       └── Trigger notification to Tourist (BUSINESS_BOOKING_CONFIRMED)
```

---

## 10. Authentication & Role-Based Authorization

```text
Registration / Login
        │
        ├── Standard: POST /api/auth/register (hashes password with bcrypt)
        ├── Standard: POST /api/auth/login (issues signed JWT)
        └── OAuth: POST /api/auth/google (verifies Google token & generates JWT)
        │
        ▼
Client stores JWT in localStorage
        │
        ▼
Subsequent API Requests include: `Authorization: Bearer <token>`
        │
        ▼
Middleware Pipeline:
  1. `protect`: Decodes JWT, verifies signature, loads current active User into `req.user`.
  2. `restrictTo(...roles)`: Verifies `req.user.role` matches allowed roles (`ADMIN`, `TOURIST`, `BUSINESS_PARTNER`).
```

---

## 11. Complete REST API Specifications

The Express backend registers the following 22 route modules in `src/routes/index.ts`:

### 1. Authentication & Profile (`/api/auth`)
- `POST /api/auth/register` — Register new user (`TOURIST` or `BUSINESS_PARTNER`)
- `POST /api/auth/login` — Authenticate and receive JWT
- `POST /api/auth/google` — Google OAuth authentication
- `GET /api/auth/me` — Get authenticated user profile (`protect`)
- `PATCH /api/auth/profile` — Update user details (`protect`)
- `PATCH /api/auth/change-password` — Change password (`protect`)
- `GET /api/admin/users` — List all platform users with role and business counts (`Admin`)
- `PATCH /api/admin/users/:id/role` — Update user role (e.g. promote to `BUSINESS_PARTNER` or `ADMIN`) (`Admin`)
- `DELETE /api/admin/users/:id` — Delete user account from database (`Admin`)

### 2. Partner KYC & Compliance (`/api/kyc`)
- `GET /api/kyc/my` — Get partner's KYC verification status (`Partner`)
- `POST /api/kyc/submit` — Submit PAN, GSTIN, ID/Business proof, and bank details (`Partner`)
- `GET /api/kyc/document/:filename` — Secure document viewing (`protect`)
- `GET /api/kyc/admin/all` — List all partner KYC submissions (`Admin`)
- `PATCH /api/kyc/admin/:id/review` — Review and verify/reject KYC (`Admin`)

### 3. Destinations (`/api/destinations`)
- `GET /api/destinations` — List all destinations (Public)
- `GET /api/destinations/:slug` — Destination details with wildlife statistics (Public)
- `GET /api/destinations/:destinationId/resorts` — Get resorts by destination (Public)
- `POST /api/destinations` — Create destination (`Admin`)
- `PATCH /api/destinations/:id` — Update destination (`Admin`)
- `DELETE /api/destinations/:id` — Soft-delete destination (`Admin`)

### 4. Business Partner Listings (`/api/businesses`)
- `GET /api/businesses` — Get approved public businesses (Public)
- `GET /api/businesses/:slug` — Get approved business by slug (Public)
- `GET /api/businesses/my` — Get partner's businesses (`Partner`)
- `GET /api/businesses/user/my/:id` — Get partner business by ID (`Partner`)
- `POST /api/businesses` — Create new business in `DRAFT` status (`Partner`)
- `PUT /api/businesses/:id` — Update business details (`Partner`, triggers re-verification)
- `POST /api/businesses/:id/submit` — Submit draft for review (`Partner` → `PENDING_REVIEW`)
- `GET /api/businesses/admin/all` — List all businesses across all statuses (`Admin`)
- `GET /api/businesses/admin/:id` — Review business details (`Admin`)
- `PATCH /api/businesses/:id/status` — Update approval status (`Admin`: `APPROVED`, `REJECTED`, `SUSPENDED`)

### 5. Room Categories & Inventory (`/api/rooms`)
- `GET /api/rooms/public/:businessId` — List rooms for approved business (Public)
- `GET /api/rooms/business/:businessId` — List partner rooms (`Partner`)
- `POST /api/rooms` — Create room type (`Partner`)
- `PUT /api/rooms/:id` — Update room pricing, capacity, inventory (`Partner`)
- `DELETE /api/rooms/:id` — Delete room type (`Partner`)

### 6. Safari Vehicles & Transfers (`/api/vehicles`)
- `GET /api/vehicles/public/:businessId` — List public vehicles for business (Public)
- `GET /api/vehicles/business/:businessId` — List partner vehicles (`Partner`)
- `POST /api/vehicles` — Add new vehicle (`Partner`)
- `PUT /api/vehicles/:id` — Update vehicle details & slots (`Partner`)
- `DELETE /api/vehicles/:id` — Delete vehicle (`Partner`)

### 7. Camera & Equipment Rentals (`/api/equipment`)
- `GET /api/equipment/public/:businessId` — List public gear for rental business (Public)
- `GET /api/equipment/business/:businessId` — List partner gear (`Partner`)
- `POST /api/equipment` — Add gear item (`Partner`)
- `PUT /api/equipment/:id` — Update gear item & daily rates (`Partner`)
- `DELETE /api/equipment/:id` — Delete gear item (`Partner`)

### 8. Calendar Blackout / Inventory Blocking (`/api/calendar-blocks`)
- `GET /api/calendar-blocks/business/:businessId` — Get blocked dates for business (`Partner`)
- `POST /api/calendar-blocks` — Create blackout date range (`Partner`)
- `DELETE /api/calendar-blocks/:id` — Remove blackout date range (`Partner`)

### 9. Direct Multi-Service Bookings (`/api/business-bookings`)
- `GET /api/business-bookings/availability` — Check live multi-resource availability (Public)
- `POST /api/business-bookings` — Create direct booking (`protect`, Atomic transaction)
- `GET /api/business-bookings/my` — Get tourist's direct bookings (`Tourist`)
- `GET /api/business-bookings/partner` — Get partner's received bookings (`Partner`)
- `PATCH /api/business-bookings/:id/cancel` — Cancel direct booking (`protect`)

### 10. Escrow Payouts & Finances (`/api/payouts`)
- `GET /api/payouts/partner` — Get partner payout transactions & escrow history (`Partner`)
- `GET /api/payouts/admin/all` — List all platform payouts (`Admin`)
- `PATCH /api/payouts/admin/:id/settle` — Record settlement and banking UTR (`Admin`)

### 11. Customer Inquiries (`/api/inquiries` & `/api/partner/inquiries`)
- `POST /api/inquiries` — Submit inquiry to approved business (Public/Tourist)
- `GET /api/partner/inquiries` — List partner inquiries with SLA status (`Partner`)
- `GET /api/partner/inquiries/:id` — Get inquiry details (`Partner`)
- `PATCH /api/partner/inquiries/:id/status` — Update status (`Partner`: `PENDING`, `RESPONDED`, `CLOSED`)

### 12. Curated Resorts (`/api/resorts`)
- `GET /api/resorts` — List curated resorts (Public)
- `GET /api/resorts/:id` — Get resort details (Public)
- `POST /api/resorts` — Create curated resort (`Admin`)
- `PATCH /api/resorts/:id` — Update resort (`Admin`)
- `DELETE /api/resorts/:id` — Soft-delete resort (`Admin`)

### 13. Custom Trip Requests (`/api/triprequests` & `/api/trip-requests`)
- `POST /api/triprequests` — Submit bespoke safari request (`Tourist`)
- `GET /api/triprequests/my` — Get tourist's trip requests (`Tourist`)
- `GET /api/triprequests/:id` — Get request details (`Tourist`, `Admin`)
- `PATCH /api/triprequests/:id/cancel` — Cancel trip request (`Tourist`)

### 14. Admin Proposals (`/api/proposals` & `/api/my/proposals`)
- `POST /api/proposals` — Create custom travel proposal (`Admin`)
- `GET /api/proposals` — List all proposals (`Admin`)
- `GET /api/proposals/:id` — Get proposal details (`Tourist`, `Admin`)
- `GET /api/proposals/trip-request/:tripRequestId` — Get proposal for a request (`Tourist`, `Admin`)
- `PATCH /api/proposals/:id` — Update draft proposal (`Admin`)
- `PATCH /api/proposals/:id/send` — Dispatch proposal to tourist (`Admin`)
- `PATCH /api/proposals/:id/accept` — Accept proposal and confirm booking (`Tourist`)
- `PATCH /api/proposals/:id/reject` — Reject proposal (`Tourist`)
- `PATCH /api/proposals/:id/change-request` — Request itinerary modifications (`Tourist`)
- `DELETE /api/proposals/:id` — Delete proposal (`Admin`)
- `GET /api/my/proposals` — Get tourist's proposals (`Tourist`)

### 15. Managed Safari Bookings (`/api/bookings`)
- `GET /api/bookings/my` — Get tourist's proposal-based bookings (`Tourist`)
- `GET /api/bookings/:id` — Get booking details (`Tourist`, `Admin`)
- `GET /api/bookings` — List all bookings (`Admin`)
- `PATCH /api/bookings/:id/status` — Update booking status (`Admin`)
- `PATCH /api/bookings/:id/cancel` — Cancel booking (`Tourist`)

### 16. Articles (`/api/articles`)
- `GET /api/articles` — Get published articles (Public)
- `GET /api/articles/:slug` — Get article by slug (Public)
- `POST /api/articles` — Create article (`Admin`)
- `PATCH /api/articles/:id` — Update article (`Admin`)
- `PATCH /api/articles/:id/publish` — Publish article (`Admin`)
- `PATCH /api/articles/:id/archive` — Archive article (`Admin`)
- `DELETE /api/articles/:id` — Delete article (`Admin`)

### 17. Notifications (`/api/notifications`)
- `GET /api/notifications` — Get user's notifications (`protect`)
- `GET /api/notifications/unread` — Get unread notifications (`protect`)
- `GET /api/notifications/count` — Get unread count (`protect`)
- `PATCH /api/notifications/:id/read` — Mark notification as read (`protect`)
- `PATCH /api/notifications/read-all` — Mark all as read (`protect`)
- `DELETE /api/notifications/:id` — Delete notification (`protect`)
- `POST /api/notifications` — Send system announcement (`Admin`)

### 18. Media Uploads (`/api/upload`)
- `POST /api/upload` — Upload up to 10 images (`protect`, Multer storage)

---

# Phase 3 — Project Structure & Navigation

## 12. Monorepo Project Structure

```text
WildConnect/
├── backend/                  # Server-side Express application
│   ├── prisma/               # Schema, migrations & seeds
│   ├── src/                  # Application source code
│   ├── uploads/              # Static media uploads directory
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 # Client-side React application
│   ├── src/                  # React components, pages, styles
│   ├── public/               # Public assets
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── Architecture.md           # System architecture document
├── DATABASE.md               # Database schema & entity specifications
├── PRD.md                    # Product requirements document
├── Rules.md                  # Development rules & coding conventions
├── Design.md                 # UI/UX design specifications
├── PlatformTheme.md          # Platform theme & brand token guide
└── README.md
```

---

## 13. Backend Directory Architecture

```text
backend/src/
├── app.ts                    # Express app initialization, middleware, routes
├── server.ts                 # Server entry point and port listener
├── config/                   # Database (Prisma), Env config, Logger
├── constants/                # Global system constants
├── controllers/              # 20 Express request controllers
├── generated/prisma/         # Generated Prisma client output
├── middleware/               # Auth, role-restriction, error handler, validation, multer
├── repositories/             # 12 Prisma database repositories
├── routes/                   # 22 Express route modules
├── services/                 # 16 Domain business services
├── types/                    # Shared TypeScript interfaces & types
├── utils/                    # AppError, ApiResponse, asyncHandler, token helpers
└── validators/               # 12 Zod validation schemas
```

---

## 14. Frontend Directory Architecture

```text
frontend/src/
├── App.tsx                   # Master router, suspense boundaries, layout routes
├── main.tsx                  # React DOM root entry point
├── assets/                   # Static images, vectors, branding assets
├── components/
│   ├── common/               # ProtectedRoute, Generic ErrorBoundary
│   ├── layout/               # PublicLayout, TravelerLayout, PartnerLayout, AdminLayout
│   └── ui/                   # Reusable Buttons, Cards, Modals, Badges, Loaders
├── config/                   # Frontend environment and API constants
├── contexts/                 # AuthContext (User state, login, logout)
├── hooks/                    # Reusable React custom hooks
├── pages/
│   ├── admin/                # AdminDashboard, AdminKyc, AdminDestinations, AdminBusinesses, etc.
│   ├── auth/                 # Login, Register
│   ├── partner/              # PartnerDashboard, PartnerKyc, MyBusinesses, Rooms, Vehicles, Gear, Calendar, Finances
│   ├── public/               # Home, Destinations, DestinationDetails, Resorts, Businesses, Articles, Contact
│   └── tourist/              # Dashboard, MyTripRequests, ProposalDetails, Bookings, Notifications, Profile
├── routes/                   # AppRoutes.tsx, ProtectedRoute.tsx
├── services/                 # 16 Axios API communication services
├── styles/                   # Pure Vanilla CSS stylesheets
│   ├── admin/                # Admin portal styling
│   ├── components/           # Component-specific styles
│   ├── globals/              # variables.css, buttons.css, cards.css, forms.css, etc.
│   ├── home/                 # Landing page hero & showcase styling
│   ├── pages/                # Page-level styles
│   ├── partner/              # Business partner portal styling
│   ├── public/               # Public explore & destination styles
│   └── tourist/              # Tourist dashboard styles
└── utils/                    # Date formatters, price calculators, helper functions
```

---

## 15. Application Navigation & Route Architecture

### 15.1 Public Navigation Tree
```text
/ (Home)
├── /destinations
│    └── /destinations/:slug
├── /businesses (Tourism Services Hub - Stays, Vehicles, Camera Gear)
│    └── /businesses/:slug (Unified Business Details)
├── /resorts (Redirects to /businesses?type=RESORT)
│    └── /resorts/:slug (Dynamic Business Details)
├── /articles
│    └── /articles/:slug
├── /contact
├── /login
├── /register
├── /unauthorized
└── /loading
```

### 15.2 Tourist Dashboard Navigation Tree
```text
/dashboard
├── /dashboard/profile
├── /dashboard/settings
├── /dashboard/requests (My Trip Requests)
├── /trip-request/new (Submit Custom Safari Request)
├── /dashboard/proposals/:id (View / Accept / Reject / Change Request)
├── /dashboard/bookings (My Bookings - Custom & Direct)
└── /dashboard/notifications (In-App Alerts)
```

### 15.3 Business Partner Navigation Tree
```text
/partner
├── /partner/kyc (Partner Verification Submission)
├── /partner/businesses (My Businesses Listing)
├── /partner/businesses/new (Create Business)
├── /partner/businesses/:id/edit (Edit & Re-verify Business)
├── /partner/businesses/:id (View Business Details)
├── /partner/rooms (Room Categories & Inventory)
├── /partner/vehicles (Safari 4x4 Fleet & Slots)
├── /partner/equipment (Camera & Gear Rental Inventory)
├── /partner/calendar (Calendar Blackout Dates Management)
├── /partner/finances (Escrow & Bank Payouts History)
├── /partner/bookings (Received Guest Bookings)
├── /partner/inquiries (Customer Inquiries with SLA)
├── /partner/inquiries/:id (Inquiry Details)
├── /partner/notifications (Partner Alerts)
├── /partner/profile
└── /partner/settings
```

### 15.4 Admin Navigation Tree
```text
/admin
├── /admin/kyc (Partner KYC Verification Queue)
├── /admin/users (User Management & Audit)
├── /admin/destinations (Destinations CRUD)
├── /admin/resorts (Curated Resorts Management)
├── /admin/inquiries (Inquiry SLA Oversight)
├── /admin/trip-requests (Review Custom Inquiries)
├── /admin/bookings (Global Booking Overview)
├── /admin/articles (Article Authoring & Publishing)
├── /admin/businesses (Business Verification & Approval)
└── /admin/businesses/:id (Review Business Submissions)
```

---

## 16. CSS Styling & Design System Architecture

WildConnect enforces strict styling rules:
- **No Tailwind CSS**: Zero utility classes or `@apply` directives.
- **Pure CSS Custom Properties**: Defined in `src/styles/globals/variables.css`.
- **Modular Stylesheets**: Every page and component imports its designated CSS file from `src/styles/`.
- **Semantic Class Names**: Descriptive names such as `.partner-business-card`, `.booking-status-badge`, `.destination-hero-header`.

---

# Phase 4 — Engineering, Security & Scalability

## 17. Security Architecture

1. **Password Security**: Passwords hashed using `bcrypt` (minimum 10 salt rounds) before database persistence.
2. **JWT Authorization**: Stateless JSON Web Tokens signed with secret keys, verified on every protected API call.
3. **Role-Based Guards**: Two-tier verification on both backend (`restrictTo`) and frontend (`ProtectedRoute`).
4. **Input Sanitization & Validation**: All request bodies, query strings, and URL parameters validated strictly using Zod schemas.
5. **SQL Injection & Mass Assignment Protection**: Guaranteed by Prisma ORM's parameterized queries and strict schema models.
6. **File Upload Security**: Multer configured with file size limits (5MB) and strict image MIME type validation (`image/jpeg`, `image/png`, `image/webp`).
7. **KYC Document Privacy**: Secure route `/api/kyc/document/:filename` restricting access strictly to the document owner or Admins.

---

## 18. State Management Strategy

- **Global Authentication State**: Managed via `AuthContext` using React Context API. Stores authenticated user profile, active token, and authentication status.
- **Server Cache & API Communication**: Services layer with Axios interceptors automatically injecting JWT tokens and handling 401 Unauthorized redirects.
- **Local Component State**: Standard React `useState`, `useReducer`, and custom hooks for local UI state, filters, forms, and modal interactions.

---

## 19. Error Handling & Validation Pipeline

### Centralized Backend Error Flow
```text
Error Thrown in Service / Controller
        │
        ▼
   asyncHandler (Catches unhandled promise rejections)
        │
        ▼
errorHandler Middleware (`src/middleware/errorHandler.ts`)
        ├── Checks instance of AppError (NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError)
        ├── Handles Prisma Known Request Errors (P2002 Unique Constraint, P2025 Not Found)
        ├── Handles Zod Validation Errors (Formatted error array)
        └── Returns standardized JSON response:
            {
              "success": false,
              "message": "Meaningful error message",
              "errors": []
            }
```

---

## 20. Cloud Deployment Topology

```text
                   End Users (Web Browsers)
                              │
                              ▼
                 React Frontend Application
                     (Hosted on Vercel)
                              │
                      HTTPS REST Calls
                              │
                              ▼
                 Express Backend REST API
               (Hosted on Render / Railway)
                              │
                     Prisma Connection
                              │
                              ▼
                PostgreSQL Serverless Database
                      (Hosted on Neon)
```

---

## 21. Architecture Summary

The WildConnect architecture provides a robust, type-safe, and modular foundation. By maintaining clean separation across controllers, services, repositories, and UI components, the system seamlessly powers both the multi-service partner marketplace (stays, safari gypsies, gear rentals) and custom safari planning workflows while remaining scalable for future enhancements.