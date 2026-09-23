# WildConnect — UI/UX Design System & Specification (`Design.md`)

> **Guiding Principle:** Elevate wildlife tourism into a **world-class, luxury wildlife editorial and marketplace experience**. Preserve 100% of domain facts, gate logistics, inventory controls, and financial integrity while providing an immersive, intuitive interface.

---

## 1. Visual Identity & Design Tokens

### 1.1 Color Harmony
- **Primary Brand (Deep Forest Emerald):** `#1F4D3A` (RGB: `31, 77, 58`) — Primary brand surfaces, headers, active navigation indicators, main action buttons.
- **Primary Dark (Midnight Forest):** `#16382B` (RGB: `22, 56, 43`) — Deep dark headers, footer canvas, high-contrast dark card surfaces.
- **Secondary (Moss / Teak Leaf):** `#6B8E5A` (RGB: `107, 142, 90`) — Buffer zone tags, secondary action buttons, natural highlights.
- **Accent (Safari Gold / Sun Amber):** `#D99A3D` (RGB: `217, 154, 61`) — Critical call-to-actions, rating stars, price highlights, pending badges.
- **Accent Dark (Burnished Amber):** `#C4872D` — Hover states on accent buttons.
- **Background Base (Ivory Sandstone):** `#F7F5EF` — Main background canvas.
- **Background Alt (Warm Limestone):** `#F1EDE3` — Alternating section backgrounds, table headers.
- **Surface / Card Background (Alabaster White):** `#FFFFFF` — Cards, modals, form containers, dropdowns.
- **Border Subtle:** `#DCE2DC` — Clean dividers and input borders.
- **Text Primary (Charcoal Moss):** `#26332D` — Headings, high-contrast body text.
- **Text Muted (Forest Fog / Sage Gray):** `#6F7B73` — Sub-headings, metadata, helper text.
- **Success / Confirmed Badge:** `#3F7D4A` (Background: `rgba(63, 125, 74, 0.12)`)
- **Warning / Pending Badge:** `#D99A3D` (Background: `rgba(217, 154, 61, 0.15)`)
- **Error / Rejected Badge:** `#B94A48` (Background: `rgba(185, 74, 72, 0.12)`)

### 1.2 Typography Hierarchy
- **Editorial Headlines & Section Titles:** `'Playfair Display', Georgia, serif` — Used for national park titles, luxury editorial sections, and story callouts.
- **Badges, Metrics, Metadata & CTAs:** `'Outfit', sans-serif` — Used for numbers, stats counters, pricing, status chips, and button labels.
- **Body Text & UI Elements:** `'Plus Jakarta Sans', system-ui, sans-serif` — Used for form inputs, table content, descriptions, and dashboard controls.

### 1.3 Elevation & Shadows
- `--shadow-sm`: `0 2px 8px rgba(38, 51, 45, 0.04)`
- `--shadow-md`: `0 8px 24px rgba(38, 51, 45, 0.08)`
- `--shadow-lg`: `0 16px 40px rgba(38, 51, 45, 0.12)`
- `--shadow-cinematic`: `0 20px 50px rgba(0, 0, 0, 0.5)`

---

## 2. Layout Architecture & Portals

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        PUBLIC PORTAL & SHOWCASE                        │
│  - Floating glassmorphic header (Logo, Park Guides, Marketplace, Auth) │
│  - Hero sections with cinematic overlays and rotating carousel slides  │
│  - Editorial destination showcases (70% main content + 30% sidebar)   │
│  - Multi-category business cards (Stays, Safari Gypsies, Gear Rentals) │
└────────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATED DASHBOARDS                           │
├───────────────────┬────────────────────────────────┬───────────────────┤
│ Tourist Dashboard │ Partner Command Deck           │ Admin Operations  │
│ • Proposal Cards  │ • KYC Verification Flow        │ • KYC Audit Queue │
│ • Booking Passes  │ • Multi-Service Inventories    │ • Approvals Deck  │
│ • Custom Requests │ • Calendar Blackout Matrix     │ • Custom Proposal │
│ • Notifications   │ • Escrow & Payout Ledger       │ • Content Manager │
└───────────────────┴────────────────────────────────┴───────────────────┘
```

---

## 3. Section & Page Blueprints

### 3.1 Destination Editorial Experience (e.g. Tadoba Guide)
- **Hero Carousel Header (`.dest-details-hero`)**:
  - Full-width background image carousel with smooth zoom animation (`scale(1.05)` to `1`).
  - Dark gradient overlay for text legibility.
  - Large serif title (`Playfair Display`), state/country tag, and dual CTAs (*Plan Your Safari* & *Explore*).
- **Sticky Sidebar Navigation (`.dest-details-sidebar`)**:
  - Position: `sticky; top: 6rem;` with smooth anchor jumps.
  - Section indicators with green highlight border on active state.
- **Park Overview & Statistics**:
  - 3 metric cards with large serif numbers (`Total Area`, `Core Zone`, `Buffer Zone`).
  - Historical callout card with gold accent border for local conservation legends.
- **Safari Gates Directory**:
  - Distinct styling for **Core Gates** (emerald badge) vs **Buffer Gates** (moss badge).
  - Deep links to interactive Google Maps.
  - Closed days alerts (Core: Closed Tuesdays; Buffer: Closed Wednesdays).
- **Transit Hubs & Distances**:
  - Clean cards for nearest airport, railway junction, and driving distances.

### 3.2 Multi-Category Marketplace Design (`/businesses`)
- **Tourism Services Hub**: Unified marketplace replacing fragmented listings with seamless tab filtering:
  - `Stays & Resorts` (`type=RESORT`): Eco-lodges, farmstays, forest resorts.
  - `Safari 4x4 & Taxis` (`type=TAXI`): Gypsies, Innovas, safari drive slots.
  - `Camera Rentals` (`type=CAMERA_RENTAL`): DSLRs, mirrorless bodies, telephoto lenses.
- **Listing & Showcase Cards (`.business-card`, `.resort-card`)**:
  - Verified Partner badge (`CheckCircle2`).
  - Photo gallery preview with hover zoom.
  - Key metadata: Star rating, location tag, nearest gate info.
  - Clean card action: Full-width high-contrast action button (*Submit Enquiry* / *View Details*).
  - Clean action row with no unnecessary tariff badges.

### 3.3 Partner Portal Design
- **KYC Verification Stepper (`.partner-kyc-container`)**:
  - Clear 4-step visual flow: Business Details → ID & Registration Uploads → Banking Details → Verification Status.
- **Inventory Managers**:
  - *Rooms Grid*: Room cards with capacity chips, nightly rate, inventory count badge, and edit triggers.
  - *Vehicles Grid*: 4x4 Gypsy specs, driver details, supported drive slots (Morning/Afternoon/Full-day).
  - *Gear Rental Grid*: Camera body/lens cards, condition badges, daily rates, and security deposit terms.
- **Calendar Blackout Matrix (`.calendar-block-view`)**:
  - Visual monthly calendar displaying active reservations and partner maintenance blocks with color-coded tags.
- **Finances & Escrow Ledger (`.partner-finances-table`)**:
  - Clean accounting table displaying Gross Booking Value, Platform Commission, Net Escrow Payout, Settlement Date, and Bank UTR number.

### 3.4 Tourist Proposal Review Experience
- **Proposal Review Card (`.proposal-details-card`)**:
  - Interactive day-wise itinerary timeline with visual icons for morning safaris, afternoon drives, and lodge stays.
  - Transparent price breakdown with taxes and activities included.
  - 3 clear conversion buttons: **Accept Proposal** (Green), **Request Changes** (Amber with feedback modal), and **Decline** (Terracotta).

---

## 4. Semantic CSS Class Structure Reference

```css
/* ==========================================
   Global Layout & Utility Classes
   ========================================== */
.layout-container { }
.page-header { }
.section-title { }
.section-subtitle { }

/* ==========================================
   Destination & Editorial Classes
   ========================================== */
.dest-details-hero { }
.dest-details-hero-title { }
.dest-details-about-stats-grid { }
.dest-details-about-stat-card { }
.dest-details-gates-grid { }
.dest-details-gate-card { }

/* ==========================================
   Marketplace & Listing Cards
   ========================================== */
.business-grid { }
.business-card { }
.business-card-image-wrap { }
.business-card-body { }
.business-card-title { }
.business-card-meta { }
.business-card-price { }

/* ==========================================
   Partner Portal Classes
   ========================================== */
.partner-dashboard-grid { }
.partner-inventory-card { }
.partner-kyc-form { }
.partner-calendar-matrix { }
.partner-finances-table { }

/* ==========================================
   Tourist & Proposals Classes
   ========================================== */
.proposal-timeline-item { }
.proposal-action-btn-group { }
.booking-pass-card { }

/* ==========================================
   Badges & Status Elements
   ========================================== */
.badge-status-approved { }
.badge-status-pending { }
.badge-status-rejected { }
.badge-status-escrow { }
```

---

## 5. Responsive Breakpoints

| Breakpoint | Target Device | Layout Behavior |
| :--- | :--- | :--- |
| **`1200px`** | Desktop / Large Screen | Multi-column grids (3–4 cols), sticky 30% sidebar on editorial pages. |
| **`992px`** | Laptop / Tablet Landscape | 2–3 column grids, sidebar collapses into top navigation pills. |
| **`768px`** | Tablet Portrait | 1–2 column grids, horizontal scroll for tables, vertical timelines. |
| **`480px`** | Mobile Portrait | Single column stacked cards, full-width touch buttons (min 44px height). |