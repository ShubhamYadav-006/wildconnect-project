# Nilawar Farms Resort & Farmstay — UI/UX Design System & Specification (`NilawarFarmsDesign.md`)

> **Property Concept:** Nature Luxury Farmstay & Agri-Tourism Retreat situated on Mul Road (Borda, Chandrapur), directly accessible to **Tadoba-Andhari Tiger Reserve (Mamla Buffer Gate ~2.5 km)**.
> **Design Philosophy:** Editorial wildlife luxury merged with authentic countryside warmth. Seamless responsiveness across all device viewports without Tailwind dependencies.

---

## 1. Visual Identity & Design Tokens

### 1.1 Color Harmony
- **Primary Brand (Deep Forest Emerald):** `#1F4D3A` (RGB: `31, 77, 58`) — Primary card headers, brand badges, main action buttons, verified indicators.
- **Primary Dark (Midnight Forest):** `#16382B` (RGB: `22, 56, 43`) — Deep dark gradients, trust card backgrounds, high-contrast hover states.
- **Secondary (Moss / Teak Green):** `#6B8E5A` (RGB: `107, 142, 90`) — Accents, verified checkmarks, policy tags, sub-headings.
- **Accent (Safari Gold / Sun Amber):** `#D99A3D` (RGB: `217, 154, 61`) — Star ratings, promotional highlights, CTAs.
- **Background Base (Ivory Sandstone):** `#F7F5EF` — Main page backdrop canvas.
- **Surface / Card Background:** `#FFFFFF` with `#F8FAF8` subtle gradients.
- **Border Subtle:** `#DCE2DC` and `#DCE5DF` — Card outlines and structural dividers.
- **Text Primary (Charcoal Forest):** `#26332D` / `#1F4D3A` — High-contrast headlines and body text.
- **Text Muted (Sage Gray / Forest Fog):** `#6F7B73` / `#4C5F54` — Subtitles, metadata, and helper text.
- **Pill / Badge Fill:** `#EBF4F0` with `#1F4D3A` text.

### 1.2 Typography Hierarchy
- **Editorial Headlines & Page Titles:** `'Playfair Display', Georgia, serif` — Used for the resort title, section titles, and dining headings.
- **Metrics, Badges, Room Titles & CTAs:** `'Outfit', sans-serif` — Used for badges, room categories, pricing, stats, and action buttons.
- **Body Text & Prose:** `'Plus Jakarta Sans', system-ui, sans-serif` — Used for paragraphs, amenities, list items, and descriptions.

### 1.3 Elevation, Radii & Spacing Principles (Compact Luxury)
- **Compact Spacing**: Tightened padding (`1.2rem 1.35rem` on section cards, `0.85rem 1rem` on sub-cards) to prevent excessive vertical scrolling.
- **Section Flow Gap**: Reduced vertical gap between sections to `1.15rem` for high information density.
- **Border Radius:** `0.875rem` (14px) for Section Cards, `0.75rem` (12px) for Sub-Cards, `0.65rem` for Badges & Icons, `9999px` for Pills & Buttons.
- **Shadows:**
  - Standard Card: `0 2px 6px rgba(38, 51, 45, 0.02)`
  - Elevated Hover Card: `0 6px 16px -3px rgba(31, 77, 58, 0.08)`
- **Hover Transitions:** `all 0.25s cubic-bezier(0.16, 1, 0.3, 1)` with subtle `-1px` to `-2px` lift (`translateY`).

---

## 2. Page Architecture & Section Blueprints

The Nilawar Farms detail page (`/resorts/nilawar-farms` or `/businesses/nilawar-farms`) is organized into a single full-width flow (`.nilawar-main-flow`) structured as follows:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 1. BREADCRUMB NAVIGATION                                               │
│    Home → Destinations → Tadoba National Park → Resorts → Nilawar Farms│
├────────────────────────────────────────────────────────────────────────┤
│ 2. RESORT HERO HEADER                                                  │
│    Verified Partner • Name • Star Rating • Address • Action Buttons    │
├────────────────────────────────────────────────────────────────────────┤
│ 3. 3-PHOTO SHOWCASE MOSAIC & LIGHTBOX MODAL                            │
│    Featured Cover • Swimming Pool • Orchard Walkways • "View All (54)" │
├────────────────────────────────────────────────────────────────────────┤
│ 4. QUICK PROPERTY HIGHLIGHTS (6-Card Responsive Grid)                 │
│    Location • Property Type • Safari Gate • Swimming Pool • Varhadi    │
├────────────────────────────────────────────────────────────────────────┤
│ 5. ABOUT THE PROPERTY                                                  │
│    Editorial description & 4 check-marked feature bullets              │
├────────────────────────────────────────────────────────────────────────┤
│ 6. AMENITIES & FACILITIES (3x3 Icon Grid)                              │
│    Pool • AC • Pet Friendly • Bonfire • Kitchen • Wi-Fi • Lawns • Assist│
├────────────────────────────────────────────────────────────────────────┤
│ 7. AVAILABLE ROOM TYPES (Modern $2\times2$ Card Grid)                  │
│    • Deluxe Rooms  • Cottages  • Villa  • Dormitory                    │
├────────────────────────────────────────────────────────────────────────┤
│ 8. SIGNATURE FARM EXPERIENCES (2-Column Feature Cards)                 │
│    Agri-Tours & Organic Orchards • Evening Bonfire & Rural Starry Skies│
├────────────────────────────────────────────────────────────────────────┤
│ 9. LOCATION & SAFARI GATE CONNECTIVITY                                 │
│    Mamla Gate (2.5 km) • Agarzari (18 km) • Moharli (22 km) • Map Link │
├────────────────────────────────────────────────────────────────────────┤
│ 10. AUTHENTIC FOOD & DINING                                            │
│    Safari Breakfast • Varhadi & Saoji Lunches • Vegetarian Custom Care │
├────────────────────────────────────────────────────────────────────────┤
│ 11. POLICIES & IMPORTANT INFORMATION (Approachable 4-Card Visual Grid) │
│    • Check-in/out (1 PM / 11 AM) • 100% Pet Friendly • Pool • Booking  │
├────────────────────────────────────────────────────────────────────────┤
│ 12. TRUST & VERIFIED PARTNER CARD                                      │
│    Direct Farm Connection • Verified On-Site • Instant Host Assistance │
├────────────────────────────────────────────────────────────────────────┤
│ 13. EXPLORE NEARBY ACCOMMODATIONS                                      │
│    Card recommendations for related Tadoba stays                       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Component Specifications

### 3.1 Hero Section (`.nilawar-hero-header`)
- **Badge:** Emerald pill with `ShieldCheck` icon ("Verified Partner Farmstay").
- **Title:** `Playfair Display`, `2.3rem` bold.
- **Meta Row:** Star rating (`4.8/5`), property type (`Agri-Tourism & Forest Farmstay`), and location (`Borda, Mul Road, Chandrapur District`).
- **CTAs:**
  - Primary: `Plan Your Stay / Inquire` (Triggers `BusinessInquiryForm` modal).
  - Secondary: `WhatsApp Host` (Opens direct WhatsApp chat with pre-filled message).

### 3.2 3-Photo Showcase Mosaic (`.nilawar-mosaic-grid`)
- Clean 3-column mosaic with balanced height (`280px`).
- Smooth zoom effect on hover (`transform: scale(1.03)`).
- Bottom-right floating button: `"View All 54 Photos"` (`.nilawar-mosaic-view-all-btn`) with camera icon.
- Fullscreen Lightbox Modal supporting next/prev navigation, keyboard shortcuts, image counter, and high-resolution display.

### 3.3 Available Room Types (`.nilawar-room-types-grid`)
- Designed as an approachable $2\times2$ visual card grid without clutter.
- **Room Categories:**
  1. **Deluxe Rooms**: Air-conditioned garden rooms with private ensuite bathrooms.
  2. **Cottages**: Standalone wooden cottages with outdoor sit-out decks near the pool.
  3. **Villa**: Spacious private villa with dedicated living space for families.
  4. **Dormitory**: Air-conditioned multi-bed accommodation for corporate and large safari groups.
- Card styling: Subtle background gradient, left border indicator (`::before`) on hover, and dual-tone emerald icon badges (`48px x 48px`).

### 3.4 Policies & Stay Guidelines (`.nilawar-policies-grid`)
- Replaced traditional hidden accordions with a scannable 4-card grid:
  - **Check-in / Check-out:** Highlighted timing badges (`1:00 PM` and `11:00 AM`).
  - **Pet Policy:** Highlight pill ("100% Pet Friendly") with lawn guidelines.
  - **Pool & Lawns:** Operating hours (`7:00 AM – 8:00 PM`) and safety notes.
  - **Booking & Terms:** Transparent token policy and emergency rescheduling support.

---

## 4. Responsive Breakpoint Rules

| Viewport Width | Layout Adjustments |
| :--- | :--- |
| **Desktop ($> 1024\text{px}$)** | Full-width container (`max-width: 1280px`), 3-column photo mosaic, $2\times2$ room types, 3-column amenities. |
| **Tablet ($769\text{px} - 1024\text{px}$)** | 3-column photo showcase (`height: 220px`), $2\times2$ highlights, $2\times2$ room types. |
| **Mobile ($481\text{px} - 768\text{px}$)** | 1-column photo stack, 1-column room types, 1-column policy cards, full-width action buttons. |
| **Small Mobile ($\le 480\text{px}$)** | Compact section card padding (`1.25rem`), 1-column highlights, single-column amenities list. |

---

## 5. Implementation Files Reference

- **React TSX Page:** [`src/pages/public/NilawarFarmsDetails.tsx`](file:///d:/MERN_PRACTICE/MajorProject/WildConnect/frontend/src/pages/public/NilawarFarmsDetails.tsx)
- **Scoped Vanilla CSS:** [`src/styles/public/NilawarFarmsDetails.css`](file:///d:/MERN_PRACTICE/MajorProject/WildConnect/frontend/src/styles/public/NilawarFarmsDetails.css)
- **Image Assets:** `src/assets/NilawarFarmsImages/Nilawarfarms (1).png` through `Nilawarfarms (54).jpg`
- **Lead Inquiry Modal:** [`src/components/ui/BusinessInquiryForm.tsx`](file:///d:/MERN_PRACTICE/MajorProject/WildConnect/frontend/src/components/ui/BusinessInquiryForm.tsx)
