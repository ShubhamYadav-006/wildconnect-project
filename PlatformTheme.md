# WildConnect Premium Safari Design System & Platform Theme

> **Project:** WildConnect  
> **Version:** 3.0  
> **Purpose:** This document defines the brand theme, color harmony, typography tokens, visual assets, and atmospheric styling principles that create the signature **WildConnect Safari Experience**.

---

# 1. Atmospheric & Visual Philosophy

WildConnect's aesthetic is inspired by **luxury eco-lodges, deep Indian teak and sal canopies, savannah golden hours, and professional wildlife photography**.

The platform is designed to feel:
- **Cinematic & Immersive**: Deep forest tones (`#1F4D3A`) and rich photography evoke the thrill of a dawn safari game drive.
- **Organic & Grounded**: Warm sandstone (`#F7F5EF`) replaces sterile cold grays, giving screens a tactile, natural feel.
- **Refined & Trustworthy**: Clean borders, polished cards, bold numbers, and distinct verified badges give travelers and partners a premium experience.

---

# 2. Design Tokens & CSS Variables

All theme variables are defined in [variables.css](file:///d:/MERN_PRACTICE/MajorProject/WildConnect/frontend/src/styles/globals/variables.css):

```css
:root {
  /* ==========================================
     Theme Colors (Hex-based Design Standard)
     ========================================== */
  --color-primary: #1F4D3A;        /* Deep Forest Emerald - Primary brand elements, active links, major buttons */
  --color-primary-dark: #16382B;   /* Pine - Dark headers, footers, hover states */
  --color-secondary: #6B8E5A;      /* Secondary Moss - Sub-actions, tags, natural highlights */
  --color-accent: #D99A3D;         /* Warm Amber - Critical CTAs, star ratings, key highlight badges */
  
  --color-background: #F7F5EF;     /* Ivory Sandstone - Main page background canvas */
  --color-surface: #FFFFFF;        /* Alabaster Stone - Cards, forms, modals, tables */
  
  --color-text-primary: #26332D;   /* Charcoal Moss - Primary headings and body typography */
  --color-text-muted: #6F7B73;     /* Sage Gray - Sub-headings, metadata, helper text */
  --color-border: #DCE2DC;         /* Sandstone Border - Dividers, card borders, input outlines */
  
  --color-success: #3F7D4A;        /* Mint Leaf Green - Confirmed bookings, approvals */
  --color-error: #B94A48;          /* Terracotta Red - Destructive actions, errors, rejections */

  /* ==========================================
     Shadows & Elevation
     ========================================== */
  --shadow-sm: 0 2px 8px rgba(38, 51, 45, 0.04);
  --shadow-md: 0 8px 24px rgba(38, 51, 45, 0.08);
  --shadow-lg: 0 16px 40px rgba(38, 51, 45, 0.12);
  --shadow-cinematic: 0 20px 50px rgba(0, 0, 0, 0.5);

  /* ==========================================
     Border Radius Tokens
     ========================================== */
  --radius-sm: 0.375rem;         /* 6px  - Inputs, badges, chips */
  --radius-md: 0.5rem;           /* 8px  - Dropdowns, small buttons */
  --radius-lg: 0.75rem;          /* 12px - Standard buttons, normal cards */
  --radius-xl: 1rem;             /* 16px - Table containers, large cards */
  --radius-2xl: 1.5rem;          /* 24px - Main showcase cards, modals */
  --radius-3xl: 2rem;            /* 32px - Hero containers */
  --radius-4xl: 2.5rem;          /* 40px - Large feature banners */
  --radius-full: 9999px;         /* Pill badges, search bars, circle buttons */

  /* ==========================================
     Typography & Layout
     ========================================== */
  --font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-display: 'Outfit', sans-serif;
  --font-editorial: 'Playfair Display', Georgia, serif;
  
  --max-width-7xl: 80rem;        /* 1280px */
  --transition-default: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  --transition-snappy: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

# 3. Typography Pairings & Hierarchy

WildConnect blends three typography families to create a rich editorial layout:

1. **`Plus Jakarta Sans` (Body & Functional UI)**:
   - Clean, geometric, humanist sans-serif with outstanding legibility across all screen sizes.
   - Applied to standard text, form controls, table rows, button labels, and descriptions.
2. **`Outfit` (Display & Numeric Markers)**:
   - Modern, geometric, bold numbers and headlines.
   - Applied to metric counters, pricing figures, stats cards, and key UI markers.
3. **`Playfair Display` (Editorial & Section Titles)**:
   - High-character serif evoking luxury travel journals and national park publications.
   - Applied to landing page titles, destination highlights, and story quotes.

---

# 4. Component Styling & Visual Language

### 4.1 Buttons & CTAs
- **Primary CTA (`.btn-primary`)**:
  - Deep Forest (`#1F4D3A`) or Accent Warm Amber (`#D99A3D`) background with white text.
  - Smooth hover elevation (`translateY(-2px)`) with glowing drop shadow.
- **Secondary Action (`.btn-secondary`)**:
  - Secondary Moss (`#6B8E5A`) or soft forest tint (`rgba(31, 77, 58, 0.08)`).
- **Outline Button (`.btn-outline`)**:
  - Transparent background with `1.5px solid var(--color-border)` and Charcoal text.

### 4.2 Card Surfaces
- **Light Earthy Card (`.card`, `.card-light`)**:
  - Alabaster White (`#FFFFFF`) surface, 1px solid sandstone border (`#DCE2DC`), `var(--radius-2xl)`.
  - Hover state subtly lifts card by `4px` with expanded shadow (`var(--shadow-md)`).
- **Cinematic Dark Card (`.card-dark`)**:
  - Deep Pine (`#16382B`) background with soft moss border (`#27322C`) for hero highlights.

### 4.3 Form Inputs & Selects
- Sandstone white background (`#FFFFFF`), `1.5px solid var(--color-border)`, rounded corners (`var(--radius-md)`).
- On focus: Active border shifts to `var(--color-primary)` with a glowing ring (`box-shadow: 0 0 0 3px rgba(31, 77, 58, 0.15)`).

### 4.4 Status Indicators & Badges
- Desaturated organic tones preventing harsh neon colors:
  - **`APPROVED` / `CONFIRMED` / `KYC_VERIFIED`**: Soft green background (`rgba(63, 125, 74, 0.12)`) with deep leaf green text (`#2E7559`).
  - **`PENDING` / `PENDING_REVIEW` / `KYC_PENDING`**: Soft ochre background (`rgba(217, 154, 61, 0.15)`) with warm amber text (`#B3761E`).
  - **`REJECTED` / `CANCELLED` / `SUSPENDED` / `KYC_REJECTED`**: Soft terracotta red background (`rgba(185, 74, 72, 0.12)`) with clay red text (`#B94A48`).
  - **`HELD_IN_ESCROW`**: Soft blue-gray background with slate text.

---

# 5. Dashboard Layouts & Navigation Styling

- **Public Navbar**: Floating navigation header with glassmorphism (`backdrop-filter: blur(12px); background: rgba(255, 255, 255, 0.85); border-bottom: 1px solid var(--color-border)`). Direct navigation links to Destinations, Tourism Services (`/businesses`), Articles, and Contact.
- **Dashboard Command Center Sidebars**: Deep Forest Emerald (`#152A1E`) sidebar with gold active highlights (`#D99A3D`), providing an organized command deck for tourists, partners, and administrators.
- **Unified Marketplace Integration**: Replaced legacy standalone resort index with the dynamic multi-category Tourism Services (`/businesses`) interface, filtering seamlessly across Stays & Resorts (`type=RESORT`), Safari 4x4 Gypsies (`type=TAXI`), and Camera Rentals (`type=CAMERA_RENTAL`).
- **Public Footer**: Grounded in Deep Pine (`#16382B`) with Kalahari sand text (`#F7F5EF`) and amber link hovers.

---

# 6. Micro-Animations

- **Page & Component Fade-Rise**:
  ```css
  @keyframes fadeRise {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  ```
- **Smooth Easing**: All interactive components use `--transition-default: all 0.4s cubic-bezier(0.25, 1, 0.5, 1)`.

---

# 7. Strict CSS Compliance

WildConnect strictly uses **Pure Vanilla CSS**:
- No utility CSS libraries (Tailwind, UnoCSS, Bootstrap).
- All tokens centralized in `src/styles/globals/variables.css`.
- Modular CSS stylesheets organized in `src/styles/{admin,partner,tourist,public,home,globals}/`.
