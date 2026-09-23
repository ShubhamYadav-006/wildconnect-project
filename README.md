# 🌿 WildConnect — Digital Wildlife Tourism Platform

> **A modern, full-stack marketplace and bespoke trip planning ecosystem connecting wildlife enthusiasts, photographers, and safari travelers with verified national parks, trusted local business partners, and curated eco-resorts.**

---

## 📌 Project Overview

Planning a wildlife safari in India has historically been fragmented across scattered park sources, unverified lodge listings, and offline arrangements. **WildConnect** solves this by unifying the entire wildlife tourism journey into one seamless, luxury digital experience.

The platform is built upon two core pillars:
1. **Direct Verified Partner Marketplace (`/businesses`)**: A multi-service platform where verified local businesses (wildlife lodges, 4x4 safari gypsies, airport transfers, and telephoto camera gear rentals) onboard via legal KYC compliance, list properties and fleets, manage calendar blackout dates, track escrow payouts, and accept direct bookings.
2. **Bespoke Safari Trip Planning**: A bespoke travel planning workflow where tourists submit custom trip preferences, receive day-wise tailored itineraries from the WildConnect admin team, and confirm comprehensive safari packages.

---

## 🚀 Key Features

### 🧳 1. For Travelers & Tourists (`TOURIST`)
- **Explore Wildlife Sanctuaries**: Discover national parks (e.g. Tadoba-Andhari, Pench, Kanha) with core vs. buffer area statistics, gate counts, safari timings, and transit logistics.
- **Tourism Services Hub**: Browse and filter verified local services across:
  - **Stays & Eco-Lodges** (Luxury tents, cottages, farmstays)
  - **Safari 4x4 & Transfers** (Gypsies, Innovas with designated safari drive slots)
  - **Camera & Gear Rentals** (Professional DSLRs, mirrorless bodies, super-telephoto lenses)
- **Live Inventory & Availability**: Check real-time room and gear availability with zero double-booking risk.
- **Custom Trip Requests**: Submit bespoke safari requirements (destination, travel dates, passenger count, budget preference, wildlife focus).
- **Interactive Proposals**: Review day-wise itineraries, lodge recommendations, and quotes sent by the Admin team; accept, decline, or request itinerary modifications.
- **My Bookings & In-App Alerts**: Manage confirmed bookings, view check-in passes, and receive real-time notifications.

---

### 🏢 2. For Business Partners (`BUSINESS_PARTNER`)
- **Partner Command Center**: Real-time dashboard displaying active listings, incoming guest bookings, customer inquiries, and revenue metrics.
- **KYC Compliance & Verification**: Submit Business PAN, GSTIN, government ID proof, business proof, and bank details for Admin review.
- **Multi-Service Inventory Management**:
  - *Accommodations*: Create room categories, set nightly rates, room capacity, and quantities.
  - *Safari 4x4 & Fleet*: Manage vehicles, registration numbers, driver contacts, and supported drive slots (*Morning Safari*, *Afternoon Safari*, *Full-day Transfer*).
  - *Photography Gear*: Manage camera bodies, telephoto lenses, daily rates, and security deposit terms.
- **Calendar Blackout Matrix**: Lock inventory dates for maintenance, private offline bookings, or monsoon closures.
- **Escrow & Financial Ledger**: Track gross bookings, platform fee deductions, escrow clearance statuses (`HELD_IN_ESCROW` → `PAID`), settlement dates, and bank UTR transaction numbers.
- **Customer Inquiries with SLA Tracking**: Handle direct guest inquiries with SLA deadline indicators and status management.

---

### 🛡️ 3. For Platform Administrators (`ADMIN`)
- **Executive Command Deck**: Platform-wide telemetry covering registered users, destinations, active partner listings, bookings, and revenue.
- **User Management & Moderation**: View all platform users, promote travelers to Business Partners, revoke access, or manage accounts.
- **Partner KYC Queue**: Review submitted business registrations, tax documents, and bank proofs with one-click approve/reject actions and feedback notes.
- **Business Approval Pipeline**: Audit draft and updated partner listings before publishing them live to the public marketplace.
- **Custom Proposal Builder**: Create day-wise safari itineraries, assign partner resorts/activities, and dispatch formal quotes in response to tourist requests.
- **Destination & Article Management**: Full CRUD controls over national parks (area stats, gates, best seasons) and authoring of wildlife educational articles.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | **React 18** with **TypeScript** & **Vite** |
| **Styling & Design System** | **Pure Vanilla CSS** with custom CSS design tokens (`src/styles/globals/variables.css`) — *No Tailwind CSS* |
| **Routing & Navigation** | **React Router DOM (v6)** with route-based code-splitting & lazy loading |
| **Icons & UI Feedback** | **Lucide React**, **React Hot Toast** |
| **Backend Runtime** | **Node.js** & **Express.js** (TypeScript) |
| **Database & ORM** | **PostgreSQL** hosted on **Neon Serverless**, managed via **Prisma ORM v7** |
| **Authentication & Security** | **JWT (JSON Web Tokens)**, **bcrypt** password hashing, **Google OAuth 2.0**, **Helmet**, **CORS** |
| **Input Validation** | **Zod** schema validation across all request endpoints |
| **File Storage** | **Multer** multi-image upload pipeline with static disk storage |

---

## 📂 Project Structure

```text
WildConnect/
├── backend/                       # Express.js REST API Server
│   ├── prisma/                    # Schema, migrations & seeds
│   │   ├── schema.prisma          # 17 normalized database models
│   │   └── seed.ts                # Initial database seed script
│   ├── src/
│   │   ├── config/                # Neon database adapter, env parser, logger
│   │   ├── controllers/           # HTTP request handlers
│   │   ├── middleware/            # JWT auth, role protection, Zod validation
│   │   ├── repositories/          # Prisma database CRUD operations
│   │   ├── routes/                # Express API endpoint definitions
│   │   ├── services/              # Core business logic & atomic transactions
│   │   ├── utils/                 # AppError, ApiResponse, asyncHandler, JWT
│   │   └── validators/            # Zod input validation schemas
│   ├── uploads/                   # Uploaded images & media assets
│   └── package.json
│
├── frontend/                      # React SPA Client
│   ├── src/
│   │   ├── assets/                # Logos, wildlife photography assets
│   │   ├── components/            # Layouts, UI buttons, modals, cards, navigation
│   │   ├── contexts/              # AuthContext (state, login, logout)
│   │   ├── hooks/                 # Custom React hooks (useAuth)
│   │   ├── layouts/               # PublicLayout, TravelerLayout, PartnerLayout, AdminLayout
│   │   ├── pages/                 # Public, Tourist, Partner, and Admin pages
│   │   ├── routes/                # AppRoutes.tsx, ProtectedRoute.tsx
│   │   ├── services/              # Axios API communication services
│   │   └── styles/                # Modular Vanilla CSS stylesheets
│   └── package.json
│
├── Architecture.md                # Full system architecture documentation
├── DATABASE.md                    # Database schema & entity relations
├── PRD.md                         # Product requirements document
├── Design.md                      # UI/UX design specifications
├── PlatformTheme.md               # Visual theme tokens & color standards
├── Rules.md                       # Engineering guidelines & coding standards
└── README.md                      # Project master readme