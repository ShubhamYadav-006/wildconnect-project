# WildConnect - Product Requirements Document (PRD)

**Version:** 3.0 (Production Implementation Scope)  
**Status:** Active & Implemented  
**Project Type:** Final Year Major Project + Wildlife Tourism Marketplace MVP  
**Document Owner:** WildConnect Team  
**Last Updated:** September 2026  

---

# 1. Product Overview

## 1.1 Product Name
**WildConnect**

## 1.2 Product Vision
WildConnect is a centralized, digital wildlife tourism platform designed to connect nature enthusiasts, wildlife photographers, and safari travelers with verified wildlife destinations, trusted local business partners, and personalized safari planning services.

The platform bridges the gap between travelers and the wildlife tourism ecosystem through two primary pillars:
1. **Direct Verified Business Partner Ecosystem**: A multi-service marketplace where local business partners (resorts, hotels, homestays, safari gypsies, taxi transfers, camera gear rentals) onboard through KYC verification, list properties and fleets, manage calendar blackouts, track escrow payouts, and accept direct bookings.
2. **Bespoke Safari Trip Planning**: A managed travel planning workflow where tourists submit custom trip requirements, receive tailored day-wise proposals and quotes from the WildConnect admin team, and confirm comprehensive safari packages.

---

# 2. Problem Statement

Planning a wildlife and safari trip in India is historically fragmented and complex.

A typical safari traveler faces numerous friction points:
- **Scattered Park Information**: Wildlife sanctuary details, core vs. buffer zones, gate rules, and seasonal timings are spread across disparate sources.
- **Unverified Accommodations**: Finding reliable lodges near specific safari gates often requires searching multiple websites and dealing with unverified listings.
- **Disjointed Services**: Arranging 4x4 safari vehicles, airport transfers, expert naturalists, and telephoto camera rentals requires juggling separate phone calls and WhatsApp chats.
- **Lack of Customization**: Standard travel portals do not understand safari zone logistics, game drive timings, and wildlife photography needs.
- **Financial Ambiguity**: Independent operators lack structured escrow security, booking guarantees, and clear cancellation policies.

WildConnect resolves these challenges by providing a dedicated, unified platform tailored specifically for wildlife tourism.

---

# 3. Target Users & User Roles

The platform supports four distinct user roles:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                                 ROLES                                  │
├─────────────────┬─────────────────┬──────────────────┬─────────────────┤
│     Visitor     │     Tourist     │ Business Partner │      Admin      │
│  (Unregistered) │   (`TOURIST`)   │(`BUSINESS_PARTNER`)│   (`ADMIN`)   │
└─────────────────┴─────────────────┴──────────────────┴─────────────────┘
```

### 3.1 Visitor (Public / Unregistered)
* **Profile**: Travelers researching wildlife parks, browsing destinations, or discovering local resorts and services.
* **Capabilities**:
  - Explore national parks and wildlife destinations (e.g., Tadoba-Andhari Tiger Reserve)
  - Browse verified businesses across 3 categories: Stays/Resorts, Safari Vehicles & Taxis, Camera Rentals
  - View live room, vehicle, and equipment availability and pricing
  - Read wildlife articles, travel tips, and park gate guides
  - Submit direct inquiries to approved partner businesses
  - Access authentication pages (Login, Register with role selection)

### 3.2 Tourist (`TOURIST`)
* **Profile**: Registered travelers planning, booking, and managing wildlife trips.
* **Capabilities**:
  - **Account & Profile**: Manage profile, avatar, contact details, and password settings
  - **Direct Multi-Service Bookings**: Book verified partner rooms, reserve safari gypsies for specific drive slots (Morning/Afternoon/Full-day), and rent photography gear
  - **Bespoke Trip Requests**: Submit customized safari requests (destination, dates, traveler counts, preferences, budget)
  - **Proposal Interaction**: Receive, review, accept, reject, or request changes on Admin-generated custom itineraries
  - **Booking Management**: View all confirmed bookings (both direct marketplace bookings and custom safari packages) and request cancellations
  - **Verified Reviews**: Submit ratings (1–5 stars) and detailed reviews for completed stays
  - **Notifications**: Receive instant alerts for proposal dispatches, booking confirmations, and status updates

### 3.3 Business Partner (`BUSINESS_PARTNER`)
* **Profile**: Local wildlife business owners, resort managers, homestay hosts, safari operators, taxi fleets, and photography equipment providers.
* **Capabilities**:
  - **Partner Command Center**: Real-time dashboard displaying listing status, active bookings, incoming inquiries, and financial metrics
  - **KYC & Legal Verification**: Submit business PAN, GSTIN, ID proof, business proof, and bank details for Admin verification
  - **Multi-Service Listing Management**: Create and manage business profiles under `RESORT`, `TAXI`, or `CAMERA_RENTAL` categories
  - **Inventory Management**:
    - *Accommodations*: Configure room categories, capacities, base pricing, amenities, and room quantities
    - *Transport & Safari*: Manage 4x4 Gypsies, Innova transfers, Canters, driver contacts, and supported safari slots
    - *Photography Gear*: Manage camera bodies, telephoto lenses, accessory kits, daily rental fees, and security deposits
  - **Calendar Blackouts**: Lock inventory dates for property maintenance, offline bookings, monsoon closures, or personal use
  - **Booking Oversight**: Monitor guest reservations, check-in schedules, passenger details, and handle cancellations
  - **Escrow & Finances**: Track gross booking amounts, platform commission deductions, escrow statuses (`HELD_IN_ESCROW` → `PAID`), settlement dates, and bank UTR numbers
  - **Inquiry Handling**: Review direct customer inquiries, monitor SLA response deadlines, and resolve customer messages

### 3.4 Admin (`ADMIN`)
* **Profile**: WildConnect operations, compliance, and content management team (Primary Admin: `info.tadobatracks@gmail.com`).
* **Capabilities**:
  - **Admin Command Deck**: Platform-wide metrics on users, destinations, partner listings, trip requests, bookings, KYC submissions, and revenue
  - **User Management & Moderation**: Real-time user administration (`/admin/users`) with capabilities to promote users to `BUSINESS_PARTNER`, revoke roles, or safely delete accounts
  - **KYC Verification Queue**: Review submitted partner documents (PAN, GSTIN, banking proof) and approve/reject with detailed feedback
  - **Business Verification**: Audit submitted listings (`PENDING_REVIEW`), approve to publish live on Tourism Services (`/businesses`), reject with feedback, or suspend non-compliant businesses
  - **Custom Safari Proposals**: Build bespoke itineraries (day-wise schedule, resort/business attachments, activity list, quotes) in response to tourist trip requests
  - **Booking & Payout Oversight**: Track platform bookings, resolve escalated inquiries, and oversee payout settlements
  - **Destination Management**: Full CRUD for wildlife sanctuaries (area stats, gate counts, best seasons, guide content)
  - **Content Moderation**: Author and publish wildlife articles and educational guides

---

# 4. Core Features & Capabilities

```text
┌────────────────────────────────────────────────────────────────────────┐
│                       WILDCONNECT CORE MODULES                         │
├───────────────────────────────────┬────────────────────────────────────┤
│ 1. Partner Marketplace & Fleet    │ 2. Managed Safari Trip Planning    │
│    • Stays, Safari 4x4, Gear      │    • Custom Trip Requests          │
│    • Partner KYC Verification     │    • Day-wise Admin Proposals      │
│    • Multi-Resource Inventory     │    • Proposal Accept / Change Flow │
│    • Calendar Blackout Planner    │    • Managed Booking Confirmation  │
│    • Atomic Direct Bookings       │                                    │
│    • Escrow & Payout Settlement   │                                    │
├───────────────────────────────────┼────────────────────────────────────┤
│ 3. Destinations & Guides          │ 4. Platform Infrastructure         │
│    • National Park statistics     │    • JWT & Google OAuth Auth       │
│    • Core / Buffer gate counts    │    • Role-based Route Protection   │
│    • Educational Articles         │    • 22 Event In-App Notifications │
│    • Destination Guides           │    • Multi-image Upload Pipeline   │
└───────────────────────────────────┴────────────────────────────────────┘
```

### 4.1 Partner KYC & Compliance System
1. **Document Submission**:
   - Partner submits Business PAN, optional GSTIN, government ID proof, business proof document, bank account name/number/IFSC/bank name, and cancelled cheque.
2. **Verification State Machine**:
   - `KYC_UNSUBMITTED` → `KYC_PENDING` → `KYC_VERIFIED` or `KYC_REJECTED`.
3. **Secure Document Access**:
   - Secure route allows only the document owner or Admin to view KYC documents.

### 4.2 Multi-Service Partner Marketplace
1. **Service Categories**:
   - `RESORT`: Lodges, resorts, farm stays, homestays, cottages.
   - `TAXI`: 4x4 Safari Gypsies, airport transfer Innovas, Canters.
   - `CAMERA_RENTAL`: Professional bodies, super-telephoto lenses, accessory kits.
2. **Business Lifecycle & Verification Flow**:
   - `DRAFT` → `PENDING_REVIEW` → `APPROVED` / `REJECTED` / `SUSPENDED`.
   - *Auto Re-verification*: Editing an approved business automatically marks it `PENDING_REVIEW`.
3. **Multi-Resource Inventory**:
   - `BusinessRoom`: Capacity, nightly base price, inventory quantity, amenities, photos.
   - `BusinessVehicle`: Vehicle type, registration number, driver details, max passengers, drive slots (`MORNING_SAFARI`, `AFTERNOON_SAFARI`, `FULL_DAY_TRANSFER`), slot price.
   - `BusinessEquipment`: Category, brand/model, serial number, daily rate, security deposit, condition, kit items.
4. **Calendar Blackout Management**:
   - Block specific units/vehicles for date ranges with reasons (`PROPERTY_MAINTENANCE`, `WALK_IN_OFFLINE_BOOKING`, `MONSOON_CLOSURE`, `PERSONAL_USE`).
5. **Atomic Booking Engine**:
   - Real-time overlap calculation against bookings and blackout blocks.
   - Atomic Prisma transaction preventing double booking.
6. **Escrow Payout Engine**:
   - Automatic calculation of gross amount, platform fee, and net payout.
   - Escrow status tracking: `HELD_IN_ESCROW` → `PENDING_CLEARANCE` → `PROCESSING` → `PAID` / `ON_HOLD`.
   - Bank UTR recording and settlement date timestamps.

### 4.3 Inquiries with SLA & Escalation
- Direct inquiry form on public business listings.
- Inquiry statuses: `PENDING` → `RESPONDED` → `CLOSED` / `ESCALATED` / `EXPIRED`.
- Automatic SLA deadline monitoring and escalation alerts for unresponsive partners.

### 4.4 Managed Safari Trip Planning
1. **Trip Request Submission**:
   - Tourist selects target destination, travel dates, traveler count, budget preference, and safari notes.
2. **Admin Proposal Builder**:
   - Admin creates day-wise itinerary, recommended safari gates/zones, curated lodge/business IDs, activity list, quotes, and validity dates.
3. **Interactive Proposal Review**:
   - Actions: **Accept** (creates confirmed booking), **Reject**, or **Request Changes** (with custom feedback).

### 4.5 Destinations & Wildlife Content
- Comprehensive park statistics (Tadoba core area, buffer area, core gates, buffer gates, seasons, history, transit distances).
- Rich editorial articles published by Admins.

---

# 5. User Journey & Core Workflows

## 5.1 Direct Multi-Service Booking Journey
```text
Tourist / Visitor
       │
       ▼
Browse Destinations / Businesses (Stays, Safari 4x4, Gear)
       │
       ▼
Select Approved Business & Specific Unit (Room / Vehicle Slot / Gear)
       │
       ▼
Select Dates & Check Live Availability (API: overlap & blackout check)
       │
       ▼
Authenticate (Login / Register as Tourist)
       │
       ▼
Confirm Booking (API: /api/business-bookings [Prisma Atomic $transaction])
       │
       ├─────────────────────────────────┬────────────────────────────────┐
       ▼                                 ▼                                ▼
Booking Confirmed               Escrow Transaction Created      Partner & Tourist Notified
(Status: CONFIRMED)             (Status: HELD_IN_ESCROW)        (In-App Notification)
```

## 5.2 Partner Onboarding & KYC Journey
```text
Business Partner
       │
       ▼
Register Account (`role: BUSINESS_PARTNER`)
       │
       ▼
Complete KYC Profile (Upload PAN, ID Proof, Business Proof, Bank Details)
       │
       ▼
Admin Reviews KYC Documents (/api/kyc/admin/all) ──► Verified / Rejected
       │
       ▼
Create Business Profile & Add Inventory (Rooms / Vehicles / Gear)
       │
       ▼
Submit for Listing Approval (/api/businesses/:id/submit)
       │
       ▼
Admin Approves Listing ──► Live on Public Marketplace
```

## 5.3 Managed Safari Trip Planning Journey
```text
Tourist
   │
   ▼
Submit Trip Request (Destination, Dates, Travelers, Budget, Notes)
   │
   ▼
Admin Reviews in Admin Command Deck
   │
   ▼
Admin Builds Tailored Proposal (Day-wise Itinerary, Gates, Lodges, Price)
   │
   ▼
Tourist Receives Notification & Reviews Proposal
   │
   ├───────────────────────┬────────────────────────┐
   ▼                       ▼                        ▼
[Accept Proposal]    [Request Changes]      [Reject Proposal]
   │                       │                        │
   ▼                       ▼                        ▼
Creates Confirmed     Admin Updates         Status: REJECTED
Platform Booking      Proposal
```

---

# 6. Success Metrics & Validation

The WildConnect platform is validated against the following operational criteria:
- **Zero Double-Bookings**: Atomic transactional integrity ensures rooms, vehicles, and equipment are never over-allocated.
- **Fast Discovery**: Seamless exploration of parks, verified lodges, safari transports, and camera gear in one unified interface.
- **100% Verified Listings**: Mandatory Admin approval and partner KYC compliance guarantee listing quality.
- **End-to-End Workflow**: Complete lifecycle support from initial safari inquiry to confirmed booking, escrow settlement, and verified customer reviews.