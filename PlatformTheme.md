# WildConnect Premium Safari Design System

This document defines the visual design system for the WildConnect platform. The design is inspired by **luxury safari lodges, professional wildlife photography, deep jungle foliage, and modern premium travel platforms**. It is designed to feel **cinematic, premium, organic, and trustworthy**, avoiding generic environmental greens or dry SaaS patterns.

---

## 1. Core Visual Philosophy
*   **Cinematic Contrast**: Dark, rich backgrounds (`#0B0E0D`) are paired with high-quality photography and glowing earth-toned highlights to mimic a premium photo gallery or National Geographic editorial.
*   **Earthy Warmth**: Light surfaces use warm sand and stone tones (`#F7F4ED`) instead of sterile greys, keeping the interface feeling natural, organic, and inviting.
*   **Luxury Lodge Vibe**: Accents of warm bronze-gold (`#C19A5B`) and terracotta-sunset orange (`#D96B27`) mimic campfire embers, safari vehicles, and twilight horizons.

---

## 2. Global Design Tokens (CSS Variables)

We will define these variables in [variables.css](file:///d:/MERN_PRACTICE/MajorProject/WildConnect/frontend/src/styles/globals/variables.css) to enforce consistency across the entire app.

```css
:root {
  /* ==========================================
     Theme Colors (RGB space-separated for opacity control)
     ========================================== */
  
  /* Brand Primary: Deep Forest Emerald */
  /* Purpose: Evokes the density of Indian jungles, ancient canopy, and luxury exclusivity. Used for major dark surfaces. */
  --primary: 21 42 30;           /* #152A1E */
  
  /* Brand Secondary: Sun-Kissed Bronze / Safari Gold */
  /* Purpose: Represents dried savannah grasslands, canvas tents, safari gear, and refined luxury. Used for highlights, accents, and borders. */
  --secondary: 193 154 91;       /* #C19A5B */
  
  /* Brand Accent: Savannah Sunset (Terracotta) */
  /* Purpose: Terracotta clay and glowing sunsets. High-contrast, vibrant, used strictly for critical CTAs and warnings. */
  --accent: 217 107 39;          /* #D96B27 */
  
  /* Background / Surface (Light Sand Theme) - Default for dashboards, forms, content tables */
  /* Purpose: Warm, organic sandstone. Prevents eye strain and creates a grounded, natural canvas. */
  --bg-light: 247 244 237;       /* #F7F4ED - Kalahari Sand */
  --surface-light: 255 255 255;  /* #FFFFFF - Alabaster Stone */
  
  /* Background / Surface (Cinematic Dark Theme) - Default for landing sections, detail views, and sidebars */
  /* Purpose: Dark room/gallery backdrop. Makes wildlife photography and text pop with maximum contrast and premium cinematic feel. */
  --bg-dark: 11 14 13;           /* #0B0E0D - Wilderness Obsidian */
  --surface-dark: 21 27 24;      /* #151B18 - Forest Canopy Card */

  /* Neutral Muted: Savannah Muted Olive */
  /* Purpose: A soft green-grey that replaces cold slate greys, representing camouflage and forest mist. */
  --muted: 107 112 92;           /* #6B705C */
  
  /* Text Color Swatches */
  --text-dark: 17 24 19;         /* #111813 - Deep Moss Charcoal (High contrast on light) */
  --text-light: 247 244 237;     /* #F7F4ED - Kalahari Sand Cream (High contrast on dark) */
  --text-muted: 115 125 118;     /* #737D76 - Slate Moss (Muted sub-headers) */
  
  /* Borders */
  --border-light: 230 223 211;   /* #E6DFD3 - Sandstone Border */
  --border-dark: 39 50 44;       /* #27322C - Mossy Border */
  
  /* Badges & Status Colors (Earthy desaturated tones instead of generic bright status colors) */
  --status-success: 46 117 89;   /* #2E7559 - Mint Leaf Green */
  --status-warning: 217 142 39;  /* #D98E27 - Harvest Ochre */
  --status-danger: 197 55 55;    /* #C53737 - Red Clay */
  --status-info: 55 107 197;      /* #376BC5 - River Water Blue */

  /* ==========================================
     Shadows & Radius Tokens
     ========================================== */
  --shadow-sm: 0 2px 8px rgba(11, 14, 13, 0.04);
  --shadow-md: 0 8px 24px rgba(11, 14, 13, 0.08);
  --shadow-lg: 0 16px 40px rgba(11, 14, 13, 0.12);
  --shadow-cinematic: 0 20px 50px rgba(0, 0, 0, 0.5); /* Heavy shadows for dark mode elements */
  
  --radius-sm: 0.375rem;         /* Inputs, badges, small buttons */
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;          /* Standard buttons, normal cards */
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;          /* Main cards, panels, profile pictures */
  --radius-3xl: 2rem;            /* Hero containers, major cards */
  --radius-full: 9999px;         /* Pill badges, rounded tabs, circle buttons */
  
  /* ==========================================
     Transitions & Animations
     ========================================== */
  --transition-smooth: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); /* Custom Out-Quart curve */
  --transition-snappy: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); /* Snappy feedback */
}
```

---

## 3. Detailed Component Styles

### Typography & Font Combinations
We recommend loading and using three Google Fonts to create a rich editorial layout:
1.  **Display Heading Font**: `Outfit` (Geometric, modern, bold structure). Used for main hero statements, dashboard numbers, and key UI markers.
2.  **Editorial Heading Font**: `Playfair Display` (Classic serif with high character). Used for landing page section headers, titles, and testimonial quotes.
3.  **Body Font**: `Plus Jakarta Sans` (Clean, humanist geometric sans-serif with excellent legibility at tiny sizes). Used for forms, main paragraphs, labels, and system texts.

*Usage Example:*
```css
/* Section titles */
.section-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: 2.5rem;
  color: rgb(var(--primary));
  letter-spacing: -0.01em;
}

/* Base Body Text */
body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: rgb(var(--text-dark));
  background-color: rgb(var(--bg-light));
}
```

### Buttons & Call-to-Actions (CTAs)
*   **Primary Button**:
    *   **Colors**: Savannah Sunset background (`#D96B27`), White text.
    *   **Style**: Rounded pill shape (`border-radius: var(--radius-full)`). High contrast, very striking.
    *   **Hover**: Expand slightly (`scale(1.02)`), background shifts to slightly deeper sunset tone, with a glowing golden shadow (`box-shadow: 0 8px 20px rgba(217, 107, 39, 0.3)`).
*   **Secondary Button**:
    *   **Colors**: Deep Forest Emerald background (`#152A1E`), White text.
    *   **Hover**: Expand slightly, add a bronze-gold glow.
*   **Outline Button**:
    *   **Colors**: Transparent background, border is 1.5px solid Safari Gold (`#C19A5B`), text is Safari Gold.
    *   **Hover**: Background turns to semi-transparent gold (`rgba(193, 154, 91, 0.08)`).
*   **Glassmorphic Overlay Button** (For image/hero overlays):
    *   **Style**: `backdrop-filter: blur(12px)`, background `rgba(255, 255, 255, 0.1)`, white border at `rgba(255, 255, 255, 0.25)`.
    *   **Hover**: Background becomes slightly more opaque (`rgba(255, 255, 255, 0.25)`).

### Card Backgrounds
*   **Earthy Light Card**:
    *   **Style**: Alabaster White background (`#FFFFFF`) with a very fine Sandstone Border (`1px solid #E6DFD3`) and rounded corners (`var(--radius-2xl)`).
    *   **Hover State**: Translates up by `4px`, increases shadow depth, and border highlights to Safari Gold.
*   **Cinematic Dark Card**:
    *   **Style**: Forest Canopy Card background (`#151B18`) with a Mossy Border (`1px solid #27322C`) and rounded corners (`var(--radius-2xl)`).
    *   **Hover State**: Glows with a subtle golden backdrop tint.

### Badges & Status Indicators
*   Instead of bright primary/warning/danger colors, badges use desaturated, rich tones:
    *   **Confirmed / Success**: Light organic green background (`rgba(46, 117, 89, 0.08)`) with matching text color (`#2E7559`).
    *   **Pending / Warning**: Light ochre background (`rgba(217, 142, 39, 0.08)`) with matching text color (`#D98E27`).
    *   **Cancelled / Alert**: Light red clay background (`rgba(197, 55, 55, 0.08)`) with matching text color (`#C53737`).
*   **Typography**: Compact, uppercase, letter-spacing of `0.06em`, font-weight `700`.

### Form & Input Fields
*   **Text Inputs / Selects**:
    *   **Style**: Grounded sand background (`#FAF8F5`), 1px solid border (`#E6DFD3`), and rounded corners (`var(--radius-lg)`).
    *   **Hover**: Border shifts to Safari Gold (`#C19A5B`) at 50% opacity.
    *   **Focus**: Active border is solid Safari Gold (`#C19A5B`), backed by a glowing focus shadow (`box-shadow: 0 0 0 4px rgba(193, 154, 91, 0.12)`). Transition is snappy.

### Navbar & Footer Styles
*   **Navbar**:
    *   **Public/Landing**: Floating layout with glassmorphic background (`backdrop-filter: blur(16px); background: rgba(11, 14, 13, 0.75)` or `rgba(255, 255, 255, 0.8)` depending on page context) to blend seamlessly with hero image backgrounds.
    *   **Dashboard**: Clean Alabaster White header, 1px Sandstone bottom border, matching sidebar style.
*   **Footer**:
    *   **Background**: Deep Forest Emerald (`#152A1E`) to act as a solid earthy anchor.
    *   **Typography**: Links in Safari Gold (`#C19A5B`) with smooth underlines on hover, and text in Kalahari Sand Cream.

---

## 4. Spacing, Borders, and Visual Hierarchy
*   **Spacing Principle**: "Breathe Like the Savannah". Wide gutters and spacious sections. Section padding should be a minimum of `5rem` top and bottom for public layouts, and `2rem` for dashboard grids.
*   **Cinematic Image Treatment**:
    *   Images are framed with large round corners (`var(--radius-2xl)`).
    *   Use linear black-to-transparent gradients (`linear-gradient(to top, rgba(11, 14, 13, 0.85), transparent)`) over bottom or left edges of images so typography overlay is perfectly readable.
    *   Subtle hover transitions to lift images or zoom in (`transform: scale(1.03)`).
*   **Dashboard Visual Layout**:
    *   **Sidebar**: Styled in Deep Forest Emerald (`#152A1E`) with subtle gold highlights for active routes, giving the traveler/admin a premium command center feel.
    *   **Grid Layout**: Reusable CSS grids with generous gaps (`1.5rem` minimum).
    *   **Typography Hierarchy**: Strict visual sizing where dashboard metric numbers are extremely large and prominent using the `Outfit` font, while categories are muted and small.

---

## 5. Micro-Animations & Interactivity
*   **Entrance Fade-Rise**: As users scroll, content blocks rise dynamically using:
    ```css
    @keyframes fadeRise {
      from {
        opacity: 0;
        transform: translateY(15px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    ```
*   **Interactive Cards**: Elevates on hover, giving a tactile depth response.
*   **Button Transitions**: Uses the custom Out-Quart cubic-bezier curve to give a premium feel, avoiding raw default transitions.
