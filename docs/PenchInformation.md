# Pench Tiger Reserve (MP) - Documentation & Source Code

> **Destination Slug:** `pench-tiger-reserve`, `pench-national-park`  
> **Component Location:** `frontend/src/pages/public/PenchInformation.tsx`  
> **Stylesheet Location:** `frontend/src/styles/public/PenchInformation.css`  
> **Status:** Production-Ready, Accessible (WCAG AA), Fully Responsive (Mobile to 4K), Namespaced (`.pench-*`)

---

## 1. Verified PDF Facts & Data Integrity
- **Total Landscape (MP Side):** `1,179.63 sq km`
  - Core Area: `411.33 sq km` (constituting unified protected habitat)
  - Buffer Area: `768.30 sq km`
- **5 Historical Milestones:**
  - `1977`: Constituted as Pench (Mowgli) Sanctuary (~449.39 sq km)
  - `1983`: Constituted as Pench National Park (292.85 sq km in Seoni & Chhindwara)
  - `1992`: Declared India's 19th Project Tiger Reserve (core 411.33 sq km)
  - `2002`: Renamed Indira Priyadarshini Pench National Park & Mowgli Pench Sanctuary
  - `2010`: 768.30 sq km buffer formally notified (total 1,179.63 sq km)
- **Safari Ceilings & Booking Policy:**
  - MPOnline official portal (`forest.mponline.gov.in`) with up to 120-day advance booking.
  - Turia Gate: 68 vehicles/day (34 morning + 34 evening).
  - Karmajhiri Gate: 12 vehicles/day.
  - Jamtara Gate: 8 vehicles/day.
  - Buffer Zones (Rukhad & Teliya): Up to 30 vehicles/day.
  - **Weekly Closure Rule:** Wednesday afternoon half-day off for core & buffer (morning safari runs normally).
  - **Monsoon Closure:** Core closed 1 July to 30 September annually.
- **Master Gates (MP Side):**
  - Core (3 Gates): Turia Gate, Karmajhiri Gate, Jamtara Gate.
  - Buffer (5 Gates): Rukhad Gate, Khawasa Buffer Gate, Teliya Buffer Gate, Sakata Buffer Gate, Kumbh-Pani/Chikhlarapuri Buffer Gate.
- **Transit & Distance Matrix:**
  - Nagpur Airport: 90 km (1.5 - 2 hrs via NH-44)
  - Jabalpur Airport: 190 km (4 hrs via NH-44)
  - Seoni Railway Station: 60 km

---

## 2. React Component (`PenchInformation.tsx`)

```tsx
/* ==========================================================
   Pench Tiger Reserve Comprehensive Information Page
   ========================================================== */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  History,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Compass,
  AlertTriangle,
  Info,
  Car,
  Sun,
  CloudRain,
  Shield,
  Layers,
  ExternalLink,
  Calendar,
  Plane,
  Train,
  TreePine,
  HelpCircle
} from 'lucide-react';

import { Destination } from '../../services/destination.service';
import { Resort } from '../../services/resort.service';

import '../../styles/public/PenchInformation.css';

interface SafariGate {
  id: string;
  name: string;
  type: 'Core' | 'Buffer';
  district: string;
  description: string;
  highlights?: string;
  mapLink?: string;
  quota?: string;
}

interface PenchDetailsProps {
  destination: Destination;
  resorts?: Resort[];
  safariGates?: SafariGate[];
}

const PENCH_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1600&q=80',
];

const PENCH_MASTER_GATES: SafariGate[] = [
  // Core Gates (Madhya Pradesh side)
  {
    id: 'core-turia',
    name: 'Turia Gate',
    type: 'Core',
    district: 'Seoni District, MP',
    description: 'Khawasa / Turia village, near the MP–Maharashtra border. The most popular gate with high predator activity and proximity to major lodges. (Wednesday afternoon closed)',
    highlights: 'Highest tiger sighting frequency, Baghin Nala, Mahadev Ghat, Alikatta grasslands, Junewani talao',
    quota: '34 Morning / 34 Evening',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Turia+Gate+Pench+National+Park'
  },
  {
    id: 'core-karmajhiri',
    name: 'Karmajhiri Gate',
    type: 'Core',
    district: 'Seoni District, MP',
    description: 'Karmajhiri, Seoni district. Serene, pristine core zone known for towering teak canopies, Bodhanala waterbody, and wild dog packs. (Wednesday afternoon closed)',
    highlights: 'Bodhanala lake, wild dog (dhole) packs, gaur herds, Chhindimatta river bank, Sitaghat',
    quota: '6 Morning / 6 Evening',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Karmajhiri+Gate+Pench'
  },
  {
    id: 'core-jamtara',
    name: 'Jamtara Gate',
    type: 'Core',
    district: 'Chhindwara District, MP',
    description: 'Jamtara village, Chhindwara district. Quiet western entrance with rolling hills and tranquil tracks; entry is currently approached via Karmajhiri. (Wednesday afternoon closed)',
    highlights: 'Undulating riverine terrain, sloth bear habitat, birdwatching, Jamtara nullah, western riparian ridges',
    quota: '4 Morning / 4 Evening',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Jamtara+Gate+Pench'
  },
  // Buffer Gates (Madhya Pradesh side)
  {
    id: 'buf-rukhad',
    name: 'Rukhad Gate (Sanctuary)',
    type: 'Buffer',
    district: 'Seoni District, MP (NH-44 Ridge)',
    description: 'Rukhad, Seoni district. Vital tiger corridor linking Pench with Kanha. Famous for night safaris, cycling trails, walking safaris, and historic British Rest House. (Wednesday afternoon closed)',
    highlights: 'Night safaris, canopy cycling, Pench-Kanha corridor, historic British Rest House',
    quota: 'Night Drive Enabled',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Rukhad+Sanctuary+Pench'
  },
  {
    id: 'buf-teliya',
    name: 'Teliya Buffer Gate',
    type: 'Buffer',
    district: 'Adjacent to Turia, Seoni, MP',
    description: 'Adjacent to Turia gate. Offers night safaris, walking trails, and rich wolf pack sightings; convenient for guests staying in Turia. (Wednesday afternoon closed)',
    highlights: 'Teliya Lake, resident Teliya wolf pack, nocturnal tracking, close proximity to Turia resorts',
    quota: 'Night Drive Enabled',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Teliya+Buffer+Gate+Pench'
  },
  {
    id: 'buf-khawasa',
    name: 'Khawasa Buffer (Wolf Sanctuary)',
    type: 'Buffer',
    district: 'MP/Maharashtra Border, Seoni, MP',
    description: 'Near MP–MH border. Open scrub and rocky terrain ideal for sighting wolves, leopards, and nocturnal species. (Wednesday afternoon closed)',
    highlights: 'Indian wolf, striped hyena, rusty-spotted cat, night drives',
    quota: 'Open Year-Round',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Khawasa+Pench'
  },
  {
    id: 'buf-sakata',
    name: 'Sakata Buffer Gate',
    type: 'Buffer',
    district: 'Balaghat / Seoni Border, MP',
    description: 'Hilly and dense forest buffer on the eastern fringe. Ideal for off-beat exploration, quiet birdwatching, and night safaris. (Wednesday afternoon closed)',
    highlights: 'Offbeat wilderness, rocky cliffs, night drives, pristine riparian flora',
    quota: 'Buffer Quota Applies',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Sakata+Pench'
  },
  {
    id: 'buf-chikhlarapuri',
    name: 'Kumbh-Pani / Chikhlarapuri Buffer',
    type: 'Buffer',
    district: 'Chhindwara District, MP',
    description: 'Buffer zone in Chhindwara district near the Totladoh reservoir catchment; rich in birdlife and dramatic waterbody landscapes. (Wednesday afternoon closed)',
    highlights: 'Totladoh reservoir backwaters, water birds, fishing eagle, scenic lakeside tracks',
    quota: 'Buffer Quota Applies',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Chikhlarapuri+Buffer+Pench'
  }
];

const PENCH_HISTORICAL_MILESTONES = [
  {
    year: '1977',
    stepNumber: '01',
    title: 'Wildlife Sanctuary',
    description: '449.39 sq km declared Sanctuary; initial protection of Seoni Mowgli lands.',
    badge: 'Sanctuary Act'
  },
  {
    year: '1983',
    stepNumber: '02',
    title: 'National Park',
    description: '292.85 sq km carved as Pench National Park within Seoni & Chhindwara.',
    badge: 'Core Demarcation'
  },
  {
    year: '1992',
    stepNumber: '03',
    title: 'Project Tiger',
    description: 'Inducted as India’s 19th Project Tiger Reserve, protecting 411.33 sq km core.',
    badge: 'Apex NTCA Status'
  },
  {
    year: '2002',
    stepNumber: '04',
    title: 'Indira Priyadarshini',
    description: 'Renamed Indira Priyadarshini Pench National Park & Mowgli Sanctuary.',
    badge: 'Official Nomenclature'
  },
  {
    year: '2010',
    stepNumber: '05',
    title: 'Buffer Notified',
    description: '768.30 sq km buffer formally notified, bringing total MP sanctuary area to 1,179.63 sq km.',
    badge: 'Current Boundaries'
  }
];

const PENCH_MONTH_TIMINGS = [
  {
    month: 'October (From Oct 1)',
    morning: '06:00 AM – 11:00 AM',
    evening: '02:30 PM – 05:30 PM',
    notes: 'Reserve reopening post monsoon; lush foliage'
  },
  {
    month: 'November',
    morning: '06:15 AM – 11:00 AM',
    evening: '02:30 PM – 05:15 PM',
    notes: 'Winter onset; migratory birds arrive'
  },
  {
    month: 'December',
    morning: '06:30 AM – 11:00 AM',
    evening: '02:30 PM – 05:15 PM',
    notes: 'Misty sunrises; heavy woolens essential'
  },
  {
    month: 'January',
    morning: '06:45 AM – 11:15 AM',
    evening: '02:30 PM – 05:30 PM',
    notes: 'Crisp mornings (8°C – 12°C)'
  },
  {
    month: 'February',
    morning: '06:30 AM – 11:00 AM',
    evening: '02:45 PM – 05:45 PM',
    notes: 'Optimal pleasant weather; high predator movement'
  },
  {
    month: 'March',
    morning: '06:00 AM – 10:30 AM',
    evening: '03:00 PM – 06:00 PM',
    notes: 'Teak defoliation begins; clear visibility'
  },
  {
    month: 'April',
    morning: '05:45 AM – 10:15 AM',
    evening: '03:30 PM – 06:30 PM',
    notes: 'Peak tiger tracking around water bodies'
  },
  {
    month: 'May',
    morning: '05:30 AM – 10:00 AM',
    evening: '03:30 PM – 06:45 PM',
    notes: 'Highest sighting frequency; warm afternoons'
  },
  {
    month: 'June (Till June 30)',
    morning: '05:30 AM – 10:00 AM',
    evening: '03:30 PM – 06:45 PM',
    notes: 'Pre-monsoon showers; last drives before closure'
  }
];

const PENCH_FAQS = [
  {
    question: '1. What is the best time to visit Pench Tiger Reserve?',
    answer:
      'The park is open from October 1 to June 30. For pleasant weather and birdwatching, visit between November and February (10°C–25°C). For the highest probability of tiger sightings and predator tracking around shrinking natural waterholes, the summer months of March through May are optimal despite daytime warmth. The park is fully closed during the monsoon, roughly 1 July to 30 September.'
  },
  {
    question: '2. How do I book safari permits for Pench (Madhya Pradesh)?',
    answer:
      'Safari permits must be booked online through the official MPOnline portal (forest.mponline.gov.in). Advance bookings open 120 days prior to the safari date at 08:00 AM IST. Single-seat permits open at 14:00 daily. A limited Tatkal quota opens 7 days in advance at 11:00 AM. Original government photo IDs entered during booking must match the physical ID presented at the gate. Vehicle and guide charges are paid separately at the gate.'
  },
  {
    question: '3. What is the tourist carrying capacity per Gypsy vehicle?',
    answer:
      'Each registered 4x4 Maruti Gypsy can carry a maximum of 6 tourists plus 1 registered park naturalist guide and 1 authorized forest driver (total 8 occupants). Children aged 5 and above are counted towards the 6-tourist maximum quota. Canters (where operable at Turia) carry 12 to 18 tourists.'
  },
  {
    question: '4. Which safari gate should I choose for my stay?',
    answer:
      'Turia Gate (Core) is the most sought-after entrance, surrounded by the largest cluster of wildlife lodges, luxury resorts, and high vehicle quotas. Karmajhiri is ideal for deep undisturbed forest drives on the northern periphery. Jamtara serves western secluded luxury. Rukhad, Khawasa, and Teliya are buffer zones offering flexible permits and exciting night safaris, which are not permitted in the core. If booking resorts along Khawasa or Turia, choose Turia, Teliya, or Rukhad to avoid 1.5+ hour inter-gate transfers.'
  },
  {
    question: '5. What identity documents are compulsory at entry?',
    answer:
      'For Indian citizens: Original Aadhaar Card, Passport, Voter ID, or Driving License. For foreign nationals: Original physical Passport and valid Indian Visa. The identity number recorded on the MPOnline entry ticket MUST exactly match the physical ID produced at gate check; discrepancies result in non-negotiable entry denial by forest rangers.'
  },
  {
    question: '6. Are safaris open on Wednesdays and during the monsoon?',
    answer:
      'On every Wednesday afternoon, all Core and Buffer safari zones across Madhya Pradesh are closed to visitors ("half-day off on Wednesday"). Wednesday morning drives operate normally. The entire Core zone closes from July 1 through September 30 annually for the monsoon replenishment and animal breeding season, reopening on October 1. Buffer zones and Rukhad offer limited monsoon ecotourism.'
  }
];

const PenchInformation = ({
  destination,
  resorts: _resorts,
  safariGates = PENCH_MASTER_GATES
}: PenchDetailsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'vehicles' | 'timings' | 'seasons' | 'gates'>('vehicles');
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [gateFilter, setGateFilter] = useState<'all' | 'Core' | 'Buffer'>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeSection, setActiveSection] = useState<string>('about');

  // Background Image Carousel Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % PENCH_HERO_IMAGES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Sticky Sidebar Scroll-Spy Listener
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['about', 'history', 'safari-hub', 'how-to-reach', 'faqs'];
      const scrollPos = window.scrollY + 160;

      for (const id of sectionIds) {
        const elem = document.getElementById(id);
        if (elem) {
          const top = elem.offsetTop;
          const height = elem.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!destination) return null;

  // Filter gates dynamically from props
  const filteredGates = safariGates.filter((gate) => {
    if (gateFilter === 'all') return true;
    return gate.type === gateFilter;
  });

  const coreGatesCount = safariGates.filter((g) => g.type === 'Core').length;
  const bufferGatesCount = safariGates.filter((g) => g.type === 'Buffer').length;

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pench-page">
      {/* ================= 1. COMPACT HERO SECTION ================= */}
      <section className="pench-hero">
        {PENCH_HERO_IMAGES.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Pench Tiger Reserve scenic view ${index + 1}`}
            className={`pench-hero-img ${index === activeIndex ? 'active' : ''}`}
          />
        ))}

        <div className="pench-hero-overlay" />

        <div className="pench-hero-content">
          <div className="pench-hero-wrapper">
            <div className="pench-hero-eyebrow">
              <span className="pench-hero-badge">LAND OF MOWGLI</span>
              <span className="pench-hero-sublocation">SEONI &amp; CHHINDWARA, MADHYA PRADESH</span>
            </div>

            <h1 className="pench-hero-title">
              {destination.name || 'Pench Tiger Reserve'}
            </h1>

            <p className="pench-hero-subtitle">
              The legendary wilderness that inspired Rudyard Kipling’s <em>The Jungle Book</em>. Spanning the pristine Satpura ranges, teak valleys, and the life-giving Pench River in central India.
            </p>

            <div className="pench-hero-actions">
              <Link
                to={`/trip-request/new?destination=${destination.id}`}
                className="pench-hero-cta"
              >
                <span>Plan Your Safari</span>
                <Calendar size={16} />
              </Link>

              <button
                type="button"
                onClick={(e) => {
                  setActiveTab('gates');
                  scrollToSection('safari-hub', e);
                }}
                className="pench-hero-secondary"
              >
                <span>Explore Safari Gates</span>
                <Compass size={16} />
              </button>

              <div className="pench-hero-official-badge">
                <Shield size={16} />
                <span>Official MPOnline Permitted Reserve</span>
              </div>
            </div>

            {/* Integrated Glass Snapshot Bar (Hero Footer) */}
            <div className="pench-hero-snapshot-bar">
              <div className="pench-hero-snapshot-item">
                <div className="pench-hero-snapshot-icon-wrap">
                  <MapPin size={18} />
                </div>
                <div className="pench-hero-snapshot-text">
                  <span className="pench-hero-snapshot-label">Location</span>
                  <strong className="pench-hero-snapshot-value">MP &amp; Maharashtra</strong>
                </div>
              </div>

              <div className="pench-hero-snapshot-item">
                <div className="pench-hero-snapshot-icon-wrap">
                  <Sun size={18} />
                </div>
                <div className="pench-hero-snapshot-text">
                  <span className="pench-hero-snapshot-label">Best Season</span>
                  <strong className="pench-hero-snapshot-value">Oct – Jun (Peak: Feb-Apr)</strong>
                </div>
              </div>

              <div className="pench-hero-snapshot-item">
                <div className="pench-hero-snapshot-icon-wrap">
                  <Compass size={18} />
                </div>
                <div className="pench-hero-snapshot-text">
                  <span className="pench-hero-snapshot-label">MP Safari Gates</span>
                  <strong className="pench-hero-snapshot-value">{coreGatesCount} Core + {bufferGatesCount} Buffer Gates</strong>
                </div>
              </div>

              <div className="pench-hero-snapshot-item">
                <div className="pench-hero-snapshot-icon-wrap">
                  <Layers size={18} />
                </div>
                <div className="pench-hero-snapshot-text">
                  <span className="pench-hero-snapshot-label">Protected Area</span>
                  <strong className="pench-hero-snapshot-value">1,179.63 sq km (MP)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Carousel Nav Controls */}
        <div className="pench-hero-controls">
          <button
            type="button"
            className="pench-hero-nav-btn prev"
            onClick={() => setActiveIndex((prev) => (prev === 0 ? PENCH_HERO_IMAGES.length - 1 : prev - 1))}
            aria-label="Previous background slide"
          >
            ‹
          </button>
          <div className="pench-hero-dots">
            {PENCH_HERO_IMAGES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`pench-hero-dot ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="pench-hero-nav-btn next"
            onClick={() => setActiveIndex((prev) => (prev + 1) % PENCH_HERO_IMAGES.length)}
            aria-label="Next background slide"
          >
            ›
          </button>
        </div>
      </section>

      {/* ================= 2. TWO-COLUMN LUXURY CONTAINER WITH STICKY SIDEBAR ================= */}
      <div className="pench-container">
        <div className="pench-layout">
          {/* ================= STICKY SIDEBAR ================= */}
          <aside className="pench-sidebar">
            <div className="pench-sidebar-card">
              <div className="pench-sidebar-header">
                <span className="pench-sidebar-eyebrow">RESERVE INDEX</span>
                <h3 className="pench-sidebar-title">Table of Contents</h3>
              </div>

              <nav className="pench-sidebar-nav-list" id="sidebar-nav">
                <a
                  href="#about"
                  onClick={(e) => scrollToSection('about', e)}
                  className={`pench-sidebar-nav-link ${activeSection === 'about' ? 'active' : ''}`}
                >
                  <span className="pench-sidebar-link-content">
                    <TreePine size={16} />
                    <span>Overview &amp; Habitat</span>
                  </span>
                  <span className="pench-sidebar-arrow">→</span>
                </a>

                <a
                  href="#history"
                  onClick={(e) => scrollToSection('history', e)}
                  className={`pench-sidebar-nav-link ${activeSection === 'history' ? 'active' : ''}`}
                >
                  <span className="pench-sidebar-link-content">
                    <History size={16} />
                    <span>Historical Milestones</span>
                  </span>
                  <span className="pench-sidebar-arrow">→</span>
                </a>

                <a
                  href="#safari-hub"
                  onClick={(e) => scrollToSection('safari-hub', e)}
                  className={`pench-sidebar-nav-link ${activeSection === 'safari-hub' ? 'active' : ''}`}
                >
                  <span className="pench-sidebar-link-content">
                    <Compass size={16} />
                    <span>Safari Planning Hub</span>
                  </span>
                  <span className="pench-sidebar-arrow">→</span>
                </a>

                <a
                  href="#how-to-reach"
                  onClick={(e) => scrollToSection('how-to-reach', e)}
                  className={`pench-sidebar-nav-link ${activeSection === 'how-to-reach' ? 'active' : ''}`}
                >
                  <span className="pench-sidebar-link-content">
                    <MapPin size={16} />
                    <span>How to Reach</span>
                  </span>
                  <span className="pench-sidebar-arrow">→</span>
                </a>

                <a
                  href="#faqs"
                  onClick={(e) => scrollToSection('faqs', e)}
                  className={`pench-sidebar-nav-link ${activeSection === 'faqs' ? 'active' : ''}`}
                >
                  <span className="pench-sidebar-link-content">
                    <HelpCircle size={16} />
                    <span>Official FAQs</span>
                  </span>
                  <span className="pench-sidebar-arrow">→</span>
                </a>
              </nav>

              {/* Permit Booking Card Widget */}
              <div className="pench-sidebar-permit-widget">
                <div className="pench-sidebar-widget-top">
                  <span className="pench-sidebar-widget-tag">SINGLE WINDOW</span>
                  <span className="pench-sidebar-widget-badge">MPOnline</span>
                </div>
                <div className="pench-sidebar-widget-title">Request Safari Permit</div>
                <p className="pench-sidebar-widget-desc">
                  Bookings open 120 days in advance at 08:00 AM IST. Single seats open at 14:00.
                </p>
                <a
                  href="https://forest.mponline.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pench-sidebar-widget-btn"
                >
                  <span>Access MPOnline Portal</span>
                  <ExternalLink size={14} />
                </a>
                <div className="pench-sidebar-widget-contact">
                  Field Directorate Tel: +91 7695 232822
                </div>
              </div>

              {/* Quick Reserve Health Indicator */}
              <div className="pench-sidebar-health-indicator">
                <div className="pench-sidebar-health-status">
                  <span className="pench-sidebar-health-dot animate-pulse"></span>
                  <span className="pench-sidebar-health-label">PARK STATUS: OPEN</span>
                </div>
                <span className="pench-sidebar-health-sub">Core Zones Active</span>
              </div>
            </div>
          </aside>

          {/* ================= MAIN CONTENT CANVAS ================= */}
          <main className="pench-main">
            {/* ================= SECTION 1: ABOUT & CONSERVATION ================= */}
            <section id="about" className="pench-card pench-about-card scroll-mt-24">
              <div className="pench-about-header">
                <div>
                  <span className="pench-about-eyebrow">KIPLING'S WILDERNESS</span>
                  <h2 className="pench-about-title">Ecosystem &amp; Kipling Heritage</h2>
                </div>
                <span className="pench-about-badge">
                  Satpura-Maikal Bio-Landscape
                </span>
              </div>

              <div className="pench-about-grid">
                {/* Left Narrative */}
                <div className="pench-about-narrative">
                  <p>
                    Named after the meandering <strong>Pench River</strong> that bisects the sanctuary from north to south, Pench Tiger Reserve encompasses a rich mosaic of tropical dry and moist teak forests, open savannah grasses, and riverine banks. It acts as an indispensable ecological corridor connecting <strong>Kanha Tiger Reserve</strong> to the east and <strong>Satpura Tiger Reserve</strong> to the west.
                  </p>
                  <p>
                    The reserve harbors an exceptionally high density of herbivores including <strong>chital (spotted deer), sambar, nilgai, wild boar</strong>, and the majestic <strong>Indian gaur (bison)</strong>, sustaining prime apex predators: Bengal tigers, Indian leopards, dholes (Asiatic wild dogs), sloth bears, and Indian wolves.
                  </p>

                  {/* Compact Historical Provenance Box */}
                  <div className="pench-provenance-box">
                    <div className="pench-provenance-header">
                      <History size={16} />
                      <span>Documented Literary Lineage</span>
                    </div>
                    <p>
                      Forest wealth here was chronicled in the 16th-century Mughal ledger <em>Ain-i-Akbari</em>. In the 19th century, British naturalists Captain James Forsyth and Dunbar Brander mapped these Seoni highlands, recording the 1831 Seoni “wolf-child” expedition reports (referenced via Sir William Henry Sleeman’s writings) that inspired Rudyard Kipling’s 1894 masterpiece <em>The Jungle Book</em> and Mowgli.
                    </p>
                  </div>
                </div>

                {/* Right Stat Grid & Bio-Card */}
                <div className="pench-about-sidebar-stats">
                  <div className="pench-stat-total-card">
                    <div>
                      <div className="pench-stat-label">TOTAL PROTECTED AREA (MP)</div>
                      <div className="pench-stat-big-val">1,179.63 <span className="pench-stat-unit">SQ KM</span></div>
                    </div>
                    <TreePine className="pench-stat-watermark-icon" size={32} />
                  </div>

                  <div className="pench-stat-sub-grid">
                    <div className="pench-stat-sub-card">
                      <div className="pench-stat-sub-label text-primary">CORE HABITAT</div>
                      <div className="pench-stat-sub-val">411.33</div>
                      <div className="pench-stat-sub-note">Sq Km (National Park)</div>
                    </div>

                    <div className="pench-stat-sub-card">
                      <div className="pench-stat-sub-label text-secondary">BUFFER ZONE</div>
                      <div className="pench-stat-sub-val">768.30</div>
                      <div className="pench-stat-sub-note">Sq Km (Multiple-Use)</div>
                    </div>
                  </div>

                  {/* Bio Corridor Badge Box */}
                  <div className="pench-corridor-box">
                    <div className="pench-corridor-icon-wrap">
                      <Shield size={20} />
                    </div>
                    <div className="pench-corridor-text">
                      <strong className="pench-corridor-title">Kanha–Pench Wildlife Corridor</strong>
                      <span className="pench-corridor-desc">
                        Vital genetic interchange highway for tiger meta-populations across central India.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= SECTION 2: HISTORY & CONSERVATION MILESTONES ================= */}
            <section id="history" className="pench-card pench-history-card scroll-mt-24">
              <div className="pench-history-header">
                <div>
                  <span className="pench-history-eyebrow">EVOLUTION CHRONICLE</span>
                  <h2 className="pench-history-title">Conservation Milestones</h2>
                </div>
                <span className="pench-history-tag">1977 – 2010 Chronology</span>
              </div>

              {/* Horizontal Timeline Stepper Grid */}
              <div className="pench-history-timeline-grid">
                {PENCH_HISTORICAL_MILESTONES.map((item) => (
                  <div key={item.year} className="pench-history-timeline-item">
                    <div>
                      <div className="pench-milestone-top">
                        <span className="pench-history-year">{item.year}</span>
                        <span className="pench-milestone-num">{item.stepNumber}</span>
                      </div>
                      <h4 className="pench-history-event-title">{item.title}</h4>
                      <p className="pench-history-event-desc">{item.description}</p>
                    </div>
                    <div className="pench-milestone-badge">{item.badge}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* ================= SECTION 3: THE COMPREHENSIVE SAFARI PLANNING HUB ================= */}
            <section id="safari-hub" className="pench-card pench-safari-hub-card scroll-mt-24">
              <div className="pench-safari-header-wrap">
                <div>
                  <span className="pench-safari-eyebrow">EXPEDITION MANAGEMENT</span>
                  <h2 className="pench-card-title">Safari Planning Hub</h2>
                </div>
                <div className="pench-verified-tag">
                  <span className="pench-verified-dot"></span>
                  <span>Verified MPOnline Rules</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="pench-tabs-nav" role="tablist">
                <button
                  type="button"
                  className={`pench-tab-btn ${activeTab === 'vehicles' ? 'active' : ''}`}
                  onClick={() => setActiveTab('vehicles')}
                >
                  <Car size={17} />
                  <span>Vehicles &amp; Quotas</span>
                </button>

                <button
                  type="button"
                  className={`pench-tab-btn ${activeTab === 'timings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('timings')}
                >
                  <Clock size={17} />
                  <span>Shift Timings &amp; Schedule</span>
                </button>

                <button
                  type="button"
                  className={`pench-tab-btn ${activeTab === 'seasons' ? 'active' : ''}`}
                  onClick={() => setActiveTab('seasons')}
                >
                  <Sun size={17} />
                  <span>Seasons &amp; Weather</span>
                </button>

                <button
                  type="button"
                  className={`pench-tab-btn ${activeTab === 'gates' ? 'active' : ''}`}
                  onClick={() => setActiveTab('gates')}
                >
                  <Compass size={17} />
                  <span>Safari Gates Directory</span>
                </button>
              </div>

              {/* TAB 1: VEHICLES & QUOTAS */}
              {activeTab === 'vehicles' && (
                <div className="pench-tab-pane">
                  <div className="pench-safari-vehicles-grid">
                    {/* Open 4x4 Gypsy */}
                    <div className="pench-safari-vehicle-card">
                      <div>
                        <div className="pench-vehicle-tag-row">
                          <span className="pench-vehicle-tag-badge primary">Core &amp; Buffer Permitted</span>
                          <span className="pench-vehicle-tag-sub">Private or Shared</span>
                        </div>
                        <h3 className="pench-vehicle-title">Open 4x4 Maruti Gypsy</h3>
                        <p className="pench-vehicle-desc">
                          Standard wildlife tracking vehicle. Allows 360-degree unobscured panoramic view for photographers and naturalists.
                        </p>
                        <ul className="pench-vehicle-list">
                          <li>
                            <CheckCircle2 className="pench-vehicle-check" />
                            <span><strong>Tourist Capacity:</strong> Capped strictly at 6 tourists + 1 registered guide + 1 driver.</span>
                          </li>
                          <li>
                            <CheckCircle2 className="pench-vehicle-check" />
                            <span><strong>Availability:</strong> Morning and Afternoon game drives daily.</span>
                          </li>
                          <li>
                            <CheckCircle2 className="pench-vehicle-check" />
                            <span><strong>Permit Allocation:</strong> Full vehicle booking or single-seat reservation.</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Shared Canter Safari */}
                    <div className="pench-safari-vehicle-card">
                      <div>
                        <div className="pench-vehicle-tag-row">
                          <span className="pench-vehicle-tag-badge secondary">Selected Gates Only</span>
                          <span className="pench-vehicle-tag-sub">Turia Gate Hub</span>
                        </div>
                        <h3 className="pench-vehicle-title">Open Canter (Safari Bus)</h3>
                        <p className="pench-vehicle-desc">
                          Cost-effective, higher-elevation safari option ideal for solo wildlife enthusiasts and larger family groups.
                        </p>
                        <ul className="pench-vehicle-list">
                          <li>
                            <CheckCircle2 className="pench-vehicle-check" />
                            <span><strong>Tourist Capacity:</strong> Shared vehicle with 12 to 18 individual seats.</span>
                          </li>
                          <li>
                            <CheckCircle2 className="pench-vehicle-check" />
                            <span><strong>Guide Escort:</strong> Accompanied by certified forest department naturalist.</span>
                          </li>
                          <li>
                            <CheckCircle2 className="pench-vehicle-check" />
                            <span><strong>Cost Advantage:</strong> Economical per-seat pricing compared to exclusive Gypsy.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Daily Vehicle Quota Grid */}
                  <div className="pench-vehicle-ceiling-box">
                    <div className="pench-ceiling-badge">
                      <Info size={16} />
                      <span>Daily Vehicle Ceilings (Strict Carrying Capacity)</span>
                    </div>
                    <div className="pench-ceiling-grid">
                      <div className="pench-ceiling-card">
                        <div className="pench-ceiling-gate-name">Turia Gate (Core)</div>
                        <div className="pench-ceiling-gate-val">68 Gypsies</div>
                        <div className="pench-ceiling-gate-note">34 Morning + 34 Evening</div>
                      </div>
                      <div className="pench-ceiling-card">
                        <div className="pench-ceiling-gate-name">Karmajhiri (Core)</div>
                        <div className="pench-ceiling-gate-val">12 Gypsies</div>
                        <div className="pench-ceiling-gate-note">6 Morning + 6 Evening</div>
                      </div>
                      <div className="pench-ceiling-card">
                        <div className="pench-ceiling-gate-name">Jamtara (Core)</div>
                        <div className="pench-ceiling-gate-val">8 Gypsies</div>
                        <div className="pench-ceiling-gate-note">4 Morning + 4 Evening</div>
                      </div>
                      <div className="pench-ceiling-card">
                        <div className="pench-ceiling-gate-name">Buffer Zones</div>
                        <div className="pench-ceiling-gate-val text-secondary">Up to 30</div>
                        <div className="pench-ceiling-gate-note">Rukhad &amp; Teliya Ranges</div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Notice Callout */}
                  <div className="pench-disclaimer-note">
                    <div className="pench-disclaimer-left">
                      <AlertTriangle className="pench-disclaimer-icon" size={18} />
                      <span>
                        <strong>MPOnline Window:</strong> Permits release 120 days ahead at 08:00 AM IST. Single-seat quota opens at 14:00. Tatkal opens 7 days in advance at 11:00 AM.
                      </span>
                    </div>
                    <a
                      href="https://forest.mponline.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pench-disclaimer-action-btn"
                    >
                      <span>Portal</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 2: SHIFT TIMINGS & SCHEDULE */}
              {activeTab === 'timings' && (
                <div className="pench-tab-pane">
                  {/* Closure Callout Banners */}
                  <div className="pench-timings-banners-grid">
                    <div className="pench-timing-callout-card orange">
                      <Clock className="pench-timing-callout-icon text-secondary" size={22} />
                      <div>
                        <div className="pench-timing-callout-title text-secondary">Wednesday Afternoon Half-Day Closure</div>
                        <p className="pench-timing-callout-desc">
                          All Core &amp; Buffer zones in Madhya Pradesh remain closed for safari every Wednesday afternoon. (Morning safari operates normally).
                        </p>
                      </div>
                    </div>

                    <div className="pench-timing-callout-card red">
                      <CloudRain className="pench-timing-callout-icon text-red" size={22} />
                      <div>
                        <div className="pench-timing-callout-title text-red">Annual Monsoon Core Closure</div>
                        <p className="pench-timing-callout-desc">
                          Core zones close July 1 – Sept 30. Reopen October 1 (~15 Oct). Selected buffer zones remain accessible.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Current Peak Window Preview */}
                  <div className="pench-timings-box">
                    <div className="pench-timings-box-header">
                      <div>
                        <div className="pench-timings-box-eyebrow">CURRENT OPERATIONAL SCHEDULE</div>
                        <h4 className="pench-timings-title">Peak Season Drive Times (March – June)</h4>
                      </div>
                      <button
                        type="button"
                        className="pench-timings-toggle-btn"
                        onClick={() => setShowFullSchedule((prev) => !prev)}
                      >
                        <span>{showFullSchedule ? 'Hide Full Schedule' : 'View Full 10-Month Schedule'}</span>
                        <ChevronDown
                          size={16}
                          style={{
                            transform: showFullSchedule ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.25s ease'
                          }}
                        />
                      </button>
                    </div>

                    {/* Quick Current Timing Strip */}
                    <div className="pench-timings-quick-strip">
                      <div className="pench-timings-quick-card">
                        <span className="pench-timings-month-tag">March</span>
                        <div className="pench-timings-row"><strong>Morning:</strong> 06:00 – 10:30 AM</div>
                        <div className="pench-timings-row"><strong>Evening:</strong> 03:00 – 06:00 PM</div>
                      </div>

                      <div className="pench-timings-quick-card">
                        <span className="pench-timings-month-tag">April</span>
                        <div className="pench-timings-row"><strong>Morning:</strong> 05:45 – 10:15 AM</div>
                        <div className="pench-timings-row"><strong>Evening:</strong> 03:30 – 06:30 PM</div>
                      </div>

                      <div className="pench-timings-quick-card">
                        <span className="pench-timings-month-tag">May – June</span>
                        <div className="pench-timings-row"><strong>Morning:</strong> 05:30 – 10:00 AM</div>
                        <div className="pench-timings-row"><strong>Evening:</strong> 03:30 – 06:45 PM</div>
                      </div>
                    </div>

                    {/* Expandable Full 10-Month Table */}
                    {showFullSchedule && (
                      <div className="pench-timings-table-container mt-4">
                        <table className="pench-timings-table">
                          <thead>
                            <tr>
                              <th>Calendar Month</th>
                              <th>Morning Shift (Gate Entry – Exit)</th>
                              <th>Evening Shift (Gate Entry – Exit)</th>
                              <th>Operational Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {PENCH_MONTH_TIMINGS.map((row, idx) => (
                              <tr key={idx}>
                                <td><strong>{row.month}</strong></td>
                                <td>{row.morning}</td>
                                <td>{row.evening}</td>
                                <td>{row.notes}</td>
                              </tr>
                            ))}
                            <tr className="pench-table-closed-row">
                              <td><strong>July – September</strong></td>
                              <td colSpan={2}><strong>PARK CORE CLOSED (Buffer Zones Open for Ecotourism)</strong></td>
                              <td>Breeding season and forest restoration</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: SEASONS & WEATHER */}
              {activeTab === 'seasons' && (
                <div className="pench-tab-pane">
                  <div className="pench-seasons-grid">
                    {/* Winter */}
                    <div className="pench-season-card">
                      <div>
                        <div className="pench-season-top-row">
                          <span className="pench-season-badge">10°C – 25°C</span>
                          <Sun className="pench-season-icon text-primary" size={20} />
                        </div>
                        <h3 className="pench-season-title">Winter (Nov – Feb)</h3>
                        <p className="pench-season-desc">
                          Pleasant daytime temperatures, lush post-monsoon greenery, and excellent birdwatching with over 210 migratory and resident species active.
                        </p>
                      </div>
                      <div className="pench-season-timings">
                        <strong>Safari Timing Focus:</strong>
                        <span>Morning: 06:15 – 11:15 AM | Evening: 02:30 – 05:30 PM</span>
                      </div>
                    </div>

                    {/* Summer */}
                    <div className="pench-season-card">
                      <div>
                        <div className="pench-season-top-row">
                          <span className="pench-season-badge secondary">28°C – 44°C</span>
                          <Sun className="pench-season-icon text-secondary" size={20} />
                        </div>
                        <h3 className="pench-season-title text-secondary">Summer (Mar – Jun)</h3>
                        <p className="pench-season-desc">
                          Dry deciduous leaves shed, opening up vast lines of sight. Apex predators congregate predictably around drying natural waterholes and Baghin Nala stream.
                        </p>
                      </div>
                      <div className="pench-season-timings">
                        <strong>Safari Timing Focus:</strong>
                        <span>Morning: 05:30 – 10:15 AM | Evening: 03:00 – 06:45 PM</span>
                      </div>
                    </div>

                    {/* Monsoon */}
                    <div className="pench-season-card">
                      <div>
                        <div className="pench-season-top-row">
                          <span className="pench-season-badge closed">High Rainfall</span>
                          <CloudRain className="pench-season-icon text-red" size={20} />
                        </div>
                        <h3 className="pench-season-title">Monsoon (Jul – Sep)</h3>
                        <p className="pench-season-desc">
                          Core zones remain strictly closed for tiger breeding and road regeneration. Rukhad and selected buffer regions offer nature trails and night safaris.
                        </p>
                      </div>
                      <div className="pench-season-timings">
                        <strong>Status:</strong>
                        <span>Core Closed | Reopens October 1 (~15 Oct) annually</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SAFARI GATES DIRECTORY */}
              {activeTab === 'gates' && (
                <div className="pench-tab-pane">
                  {/* Gate Filter Toggles */}
                  <div className="pench-gates-filter-bar">
                    <span className="pench-gates-filter-label">Filter Gateway Type:</span>
                    <div className="pench-gates-filter-buttons">
                      <button
                        type="button"
                        className={`pench-gate-filter-btn ${gateFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setGateFilter('all')}
                      >
                        All Gates ({safariGates.length})
                      </button>
                      <button
                        type="button"
                        className={`pench-gate-filter-btn ${gateFilter === 'Core' ? 'active' : ''}`}
                        onClick={() => setGateFilter('Core')}
                      >
                        Core Gates ({coreGatesCount})
                      </button>
                      <button
                        type="button"
                        className={`pench-gate-filter-btn ${gateFilter === 'Buffer' ? 'active' : ''}`}
                        onClick={() => setGateFilter('Buffer')}
                      >
                        Buffer Gates ({bufferGatesCount})
                      </button>
                    </div>
                  </div>

                  {/* Gates Grid */}
                  <div className="pench-gates-grid">
                    {filteredGates.map((gate) => (
                      <div key={gate.id} className={`pench-gate-card ${gate.type === 'Core' ? 'core-compact' : 'buffer-compact'}`}>
                        <div>
                          <div className="pench-gate-top">
                            <span className={`pench-gate-type-pill ${gate.type === 'Core' ? 'core' : 'buffer'}`}>
                              {gate.type} Zone
                            </span>
                            <span className="pench-gate-district">{gate.district}</span>
                          </div>

                          <h3 className="pench-gate-name">{gate.name}</h3>
                          <p className="pench-gate-desc">{gate.description}</p>

                          {gate.highlights && (
                            <div className="pench-gate-highlights-box">
                              <strong>Highlights / Sightings:</strong> {gate.highlights}
                            </div>
                          )}
                        </div>

                        <div className="pench-gate-card-footer">
                          <span className="pench-gate-quota-text">
                            {gate.quota || (gate.type === 'Core' ? 'Core Quota Applies' : 'Buffer Quota Applies')}
                          </span>
                          {gate.mapLink && (
                            <a
                              href={gate.mapLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="pench-gate-map-btn"
                              title={`Locate ${gate.name} on Google Maps`}
                            >
                              <span>Maps Pin</span>
                              <MapPin size={13} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Administrative Border Scope Note */}
                  <div className="pench-scope-note mt-4">
                    <Info size={16} />
                    <span>
                      <strong>Administrative Scope Note:</strong> Pench Tiger Reserve straddles Madhya Pradesh and Maharashtra. This portal governs permits strictly for the <strong>Madhya Pradesh Directorate (Seoni &amp; Chhindwara districts)</strong>. Maharashtra gates (Sillari, Khursapar, Kolitmara, Chorbahuli, Surewani) operate under Maharashtra Forest Department’s separate booking portal.
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* ================= SECTION 4: HOW TO REACH PENCH ================= */}
            <section id="how-to-reach" className="pench-card pench-reach-section scroll-mt-24">
              <div className="pench-reach-header-wrap">
                <div>
                  <span className="pench-reach-eyebrow">ACCESS MATRIX</span>
                  <h2 className="pench-card-title">How to Reach Pench Tiger Reserve</h2>
                </div>
                <span className="pench-reach-tag-pill">NH-44 Express Highway</span>
              </div>

              <div className="pench-reach-grid">
                {/* Nearest Airport */}
                <div className="pench-reach-card">
                  <div>
                    <div className="pench-reach-icon-wrap">
                      <Plane size={20} />
                    </div>
                    <div className="pench-reach-card-type">NEAREST AIRPORT</div>
                    <h3 className="pench-reach-main-title">Nagpur &amp; Jabalpur</h3>
                    <p className="pench-reach-sub-info">
                      <strong>Dr. Babasaheb Ambedkar Airport (Nagpur - NAG):</strong> 90 km (~1.5 to 2 hours drive via 4-lane NH-44). Frequent direct flights from Delhi, Mumbai, Bengaluru, Hyderabad.
                    </p>
                    <div className="pench-reach-secondary-info">
                      <strong>Jabalpur Airport (JLR):</strong> 190 km (~4 hours drive) to northern gates.
                    </div>
                  </div>
                  <div className="pench-reach-footer-tag">Prime Recommended Hub: Nagpur</div>
                </div>

                {/* Nearest Railway Stations */}
                <div className="pench-reach-card">
                  <div>
                    <div className="pench-reach-icon-wrap">
                      <Train size={20} />
                    </div>
                    <div className="pench-reach-card-type">RAIL NETWORK</div>
                    <h3 className="pench-reach-main-title">Nagpur &amp; Seoni</h3>
                    <p className="pench-reach-sub-info">
                      <strong>Nagpur Junction (NGP):</strong> 90 km. Major railway terminus connecting Rajdhani, Vande Bharat, and Superfast express trains nationwide.
                    </p>
                    <div className="pench-reach-secondary-info">
                      <strong>Seoni Railway Station:</strong> 60 km. Connected via broad-gauge lines through Chhindwara/Jabalpur.
                    </div>
                  </div>
                  <div className="pench-reach-footer-tag">Pre-paid taxis available at station</div>
                </div>

                {/* Roadways & Corridors */}
                <div className="pench-reach-card">
                  <div>
                    <div className="pench-reach-icon-wrap">
                      <Car size={20} />
                    </div>
                    <div className="pench-reach-card-type">ROADWAYS &amp; CORRIDORS</div>
                    <h3 className="pench-reach-main-title">Direct NH-44 Access</h3>
                    <p className="pench-reach-sub-info">
                      Pench (Khawasa / Turia) is situated directly off National Highway 44 (Kanyakumari-Srinagar corridor) with elevated wildlife eco-duct passes.
                    </p>
                    <div className="pench-reach-secondary-info">
                      • Kanha: 180 km (4 hrs)<br />
                      • Tadoba: 250 km (4.5 hrs)<br />
                      • Jabalpur: 190 km (3.5 hrs)
                    </div>
                  </div>
                  <div className="pench-reach-footer-tag">Seamless Circuit Logistics</div>
                </div>
              </div>
            </section>

            {/* ================= SECTION 5: FAQS ================= */}
            <section id="faqs" className="pench-card pench-faqs-card scroll-mt-24">
              <div className="pench-faqs-header-wrap">
                <div>
                  <span className="pench-faqs-eyebrow">VERIFIED ANSWERS</span>
                  <h2 className="pench-card-title">Frequently Asked Questions</h2>
                </div>
                <span className="pench-faqs-count-badge">6 Essential Queries</span>
              </div>

              <div className="pench-faq-list" id="faq-accordion-group">
                {PENCH_FAQS.map((faq, idx) => (
                  <div
                    key={idx}
                    className={`pench-faq-item ${openFaqIndex === idx ? 'active' : ''}`}
                  >
                    <button
                      type="button"
                      className="pench-faq-question"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={openFaqIndex === idx}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown size={18} className="pench-faq-chevron" />
                    </button>
                    {openFaqIndex === idx && (
                      <div className="pench-faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ================= PROPOSAL CTA BANNER ================= */}
            <section className="pench-final-cta-card">
              <div className="pench-final-cta-left">
                <span className="pench-final-cta-tag">FIELD NATURALIST DESK</span>
                <h3 className="pench-final-cta-title">Request a Custom Safari Itinerary</h3>
                <p className="pench-final-cta-desc">
                  Need multi-gate permit synchronization, private naturalist escorts, or bespoke lodge pairings between Turia and Karmajhiri? Connect with our desk.
                </p>
              </div>
              <div className="pench-final-cta-actions">
                <Link
                  to={`/trip-request/new?destination=${destination.id}`}
                  className="pench-final-cta-btn"
                >
                  <span>Request Safari Proposal</span>
                  <ArrowUpRight size={18} />
                </Link>
                <a
                  href="https://forest.mponline.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pench-final-cta-secondary-btn"
                >
                  <span>Book via MPOnline</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PenchInformation;
```

---

## 3. Scoped Stylesheet (`PenchInformation.css`)

```css
/* ==========================================================
   PENCH TIGER RESERVE INFORMATION PAGE STYLES
   Visual Structure & Layout Tokens: Stitch Luxury Wildlife Layout
   Scoped Namespace: .pench-page & .pench-*
   ========================================================== */

/* =========================================================
   PAGE CONTAINER & DESIGN TOKENS (CSS VARIABLES)
   ========================================================= */
.pench-page {
  /* Stitch Color Palette */
  --primary: #003526;
  --primary-container: #174d3b;
  --primary-fixed: #b7eed5;
  --primary-fixed-dim: #9cd2ba;
  --on-primary: #ffffff;
  --on-primary-container: #87bda6;

  --secondary: #9a4600;
  --secondary-container: #fd8534;
  --secondary-fixed: #ffdbc9;
  --on-secondary: #ffffff;

  --tertiary: #003526;
  --tertiary-container: #004e3a;
  --tertiary-fixed: #aef0d4;

  --surface: #fdf9ee;
  --surface-container-lowest: #ffffff;
  --surface-container-low: #f8f3e8;
  --surface-container: #f2eee3;
  --surface-container-high: #ece8dd;
  --surface-container-highest: #e6e2d7;

  --on-surface: #1c1c15;
  --on-surface-variant: #404944;
  --outline: #707974;
  --outline-variant: #c0c9c2;

  --border: #dfe5e1;
  --accent: #e87524;
  --accent-dark: #c95e15;
  --muted: #54665d;

  /* Elevation Shadows */
  --shadow-sm: 0 2px 10px rgba(23, 77, 59, 0.05);
  --shadow-md: 0 6px 20px rgba(23, 77, 59, 0.08);
  --shadow-lg: 0 12px 35px rgba(23, 77, 59, 0.12);

  /* Radii */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;

  background-color: var(--surface);
  color: var(--on-surface);
  min-height: 100vh;
  box-sizing: border-box;
  overflow-x: hidden;
  width: 100%;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.pench-page * {
  box-sizing: border-box;
}

/* =========================================================
   1. COMPACT HERO SECTION (Max 440px)
   ========================================================= */
.pench-hero {
  position: relative;
  width: 100%;
  min-height: 420px;
  background-color: var(--primary-container);
  color: var(--on-primary);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.pench-hero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.05);
  transition: opacity 1.2s ease, transform 6s ease;
  filter: saturate(0.95);
}

.pench-hero-img.active {
  opacity: 0.40;
  transform: scale(1);
}

.pench-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 53, 38, 0.35) 0%,
    rgba(0, 53, 38, 0.75) 55%,
    rgba(0, 33, 22, 0.96) 100%
  );
  z-index: 1;
}

.pench-hero-content {
  position: relative;
  z-index: 2;
  max-width: 1360px;
  margin: 0 auto;
  width: 100%;
  padding: 2.2rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
}

.pench-hero-wrapper {
  max-width: 900px;
  width: 100%;
}

.pench-hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.65rem;
  background: rgba(253, 249, 238, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  width: fit-content;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.pench-hero-badge {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--primary-fixed);
  text-transform: uppercase;
}

.pench-hero-sublocation {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
}

.pench-hero-title {
  font-family: "Noto Serif", Georgia, serif;
  font-size: clamp(2rem, 3.8vw, 2.75rem);
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.15;
  color: var(--on-primary);
  margin: 0 0 0.45rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
}

.pench-hero-subtitle {
  font-size: 0.95rem;
  line-height: 1.55;
  color: rgba(245, 240, 229, 0.92);
  margin: 0 0 1.2rem 0;
  max-width: 780px;
}

.pench-hero-subtitle em {
  font-style: italic;
  color: var(--secondary-fixed);
}

.pench-hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 1.5rem;
}

.pench-hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.35rem;
  background-color: var(--secondary);
  color: var(--on-secondary);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  box-shadow: 0 3px 10px rgba(154, 70, 0, 0.35);
  transition: all 0.2s ease;
}

.pench-hero-cta:hover {
  background-color: var(--secondary-container);
  color: #321200;
  transform: translateY(-1px);
}

.pench-hero-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.35rem;
  background: rgba(253, 249, 238, 0.18);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  color: var(--on-primary);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pench-hero-secondary:hover {
  background: rgba(253, 249, 238, 0.28);
  transform: translateY(-1px);
}

.pench-hero-official-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary-fixed);
  letter-spacing: 0.04em;
  margin-left: 0.5rem;
}

/* =========================================================
   HERO SNAPSHOT TELEMETRY BAR
   ========================================================= */
.pench-hero-snapshot-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.85rem;
  width: 100%;
  margin-top: 1rem;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
}

.pench-hero-snapshot-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background: rgba(253, 249, 238, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.pench-hero-snapshot-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(253, 249, 238, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-fixed);
  flex-shrink: 0;
}

.pench-hero-snapshot-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.pench-hero-snapshot-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--primary-fixed);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pench-hero-snapshot-value {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--on-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Hero Carousel Controls */
.pench-hero-controls {
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 33, 22, 0.6);
  backdrop-filter: blur(8px);
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.pench-hero-nav-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.3rem;
  transition: opacity 0.2s;
}

.pench-hero-nav-btn:hover {
  color: var(--primary-fixed);
}

.pench-hero-dots {
  display: flex;
  gap: 0.35rem;
  align-items: center;
}

.pench-hero-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pench-hero-dot.active {
  width: 18px;
  border-radius: 999px;
  background: var(--primary-fixed);
}

/* =========================================================
   2. MAIN CONTAINER & 2-COLUMN LUXURY EDITORIAL LAYOUT
   ========================================================= */
.pench-container {
  max-width: 1360px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem 1.5rem 4rem;
}

.pench-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

/* =========================================================
   STICKY SIDEBAR (280px Desktop)
   ========================================================= */
.pench-sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 6rem;
  z-index: 20;
}

.pench-sidebar-card {
  background-color: var(--surface-container-low);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border: 1px solid var(--surface-container-high);
}

.pench-sidebar-header {
  display: flex;
  flex-direction: column;
}

.pench-sidebar-eyebrow {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--on-surface-variant);
  margin-bottom: 0.2rem;
}

.pench-sidebar-title {
  font-family: "Noto Serif", Georgia, serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary);
  margin: 0;
}

.pench-sidebar-nav-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.pench-sidebar-nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 0.75rem;
  border-radius: var(--radius-sm);
  color: var(--on-surface-variant);
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.pench-sidebar-nav-link:hover {
  background-color: var(--surface-container);
  color: var(--on-surface);
}

.pench-sidebar-nav-link.active {
  background-color: var(--surface-container-highest);
  color: var(--primary);
  font-weight: 700;
}

.pench-sidebar-link-content {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.pench-sidebar-arrow {
  font-size: 0.85rem;
  opacity: 0.6;
}

/* Sidebar Permit Booking Widget */
.pench-sidebar-permit-widget {
  background-color: var(--primary);
  color: var(--on-primary);
  padding: 1rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.pench-sidebar-widget-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pench-sidebar-widget-tag {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary-fixed);
}

.pench-sidebar-widget-badge {
  background-color: var(--secondary);
  color: var(--on-secondary);
  font-size: 0.6rem;
  font-weight: 800;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.pench-sidebar-widget-title {
  font-family: "Noto Serif", Georgia, serif;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.25;
}

.pench-sidebar-widget-desc {
  font-size: 0.74rem;
  line-height: 1.45;
  color: rgba(245, 240, 229, 0.82);
  margin: 0;
}

.pench-sidebar-widget-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.55rem;
  background-color: var(--secondary);
  color: var(--on-secondary);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  transition: background-color 0.2s ease;
  margin-top: 0.25rem;
}

.pench-sidebar-widget-btn:hover {
  background-color: var(--secondary-container);
  color: #321200;
}

.pench-sidebar-widget-contact {
  font-size: 0.68rem;
  color: var(--primary-fixed);
  text-align: center;
}

/* Sidebar Health Indicator */
.pench-sidebar-health-indicator {
  background-color: var(--surface-container);
  padding: 0.65rem 0.75rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pench-sidebar-health-status {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.pench-sidebar-health-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10b981;
}

.pench-sidebar-health-label {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--on-surface);
}

.pench-sidebar-health-sub {
  font-size: 0.62rem;
  color: var(--on-surface-variant);
}

/* =========================================================
   MAIN CONTENT CANVAS & CARDS
   ========================================================= */
.pench-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.pench-card {
  background-color: var(--surface-container-lowest);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--surface-container-high);
}

.scroll-mt-24 {
  scroll-margin-top: 6rem;
}

/* =========================================================
   SECTION 1: ABOUT & CONSERVATION
   ========================================================= */
.pench-about-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--surface-container-high);
  padding-bottom: 0.85rem;
  margin-bottom: 1.25rem;
}

.pench-about-eyebrow {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--secondary);
}

.pench-about-title {
  font-family: "Noto Serif", Georgia, serif;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--primary);
  letter-spacing: -0.01em;
  margin: 0.15rem 0 0 0;
}

.pench-about-badge {
  display: inline-flex;
  padding: 0.3rem 0.75rem;
  background-color: var(--surface-container);
  color: var(--primary);
  font-size: 0.72rem;
  font-weight: 700;
  border-radius: 999px;
}

.pench-about-grid {
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: 1.5rem;
  align-items: start;
}

.pench-about-narrative {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--on-surface-variant);
}

.pench-about-narrative strong {
  color: var(--on-surface);
  font-weight: 600;
}

.pench-provenance-box {
  background-color: var(--surface-container-low);
  padding: 0.85rem 1rem;
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--primary);
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--on-surface);
  margin-top: 0.35rem;
}

.pench-provenance-header {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--primary);
  font-size: 0.82rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.pench-about-sidebar-stats {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.pench-stat-total-card {
  background-color: var(--surface-container);
  padding: 0.85rem 1rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pench-stat-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--on-surface-variant);
}

.pench-stat-big-val {
  font-family: "Noto Serif", Georgia, serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1.2;
}

.pench-stat-unit {
  font-family: system-ui, sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--on-surface);
}

.pench-stat-watermark-icon {
  color: var(--primary);
  opacity: 0.25;
}

.pench-stat-sub-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
}

.pench-stat-sub-card {
  background-color: var(--surface-container-high);
  padding: 0.75rem;
  border-radius: var(--radius-sm);
}

.pench-stat-sub-label {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.pench-stat-sub-label.text-primary {
  color: var(--primary);
}

.pench-stat-sub-label.text-secondary {
  color: var(--secondary);
}

.pench-stat-sub-val {
  font-family: "Noto Serif", Georgia, serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--on-surface);
  line-height: 1.2;
  margin: 0.15rem 0;
}

.pench-stat-sub-note {
  font-size: 0.65rem;
  color: var(--on-surface-variant);
}

.pench-corridor-box {
  background-color: rgba(0, 53, 38, 0.05);
  padding: 0.75rem 0.85rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid rgba(0, 53, 38, 0.1);
}

.pench-corridor-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--primary-container);
  color: var(--on-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pench-corridor-text {
  display: flex;
  flex-direction: column;
}

.pench-corridor-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--primary);
}

.pench-corridor-desc {
  font-size: 0.7rem;
  line-height: 1.35;
  color: var(--on-surface-variant);
}

/* =========================================================
   SECTION 2: HISTORY & CONSERVATION MILESTONES
   ========================================================= */
.pench-history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.pench-history-eyebrow {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--secondary);
}

.pench-history-title {
  font-family: "Noto Serif", Georgia, serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--primary);
  margin: 0.15rem 0 0 0;
}

.pench-history-tag {
  font-size: 0.72rem;
  color: var(--on-surface-variant);
  background-color: var(--surface-container);
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
  font-weight: 600;
}

.pench-history-timeline-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
}

.pench-history-timeline-item {
  background-color: var(--surface-container-low);
  border-radius: var(--radius-sm);
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: background-color 0.2s ease;
  border: 1px solid var(--surface-container-high);
}

.pench-history-timeline-item:hover {
  background-color: var(--surface-container-high);
}

.pench-milestone-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.35rem;
}

.pench-history-year {
  font-family: "Noto Serif", Georgia, serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--secondary);
}

.pench-milestone-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: var(--surface-container-highest);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.68rem;
  font-weight: 800;
}

.pench-history-timeline-item:nth-child(3) .pench-milestone-num {
  background-color: var(--primary);
  color: var(--on-primary);
}

.pench-history-event-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--on-surface);
  line-height: 1.25;
  margin: 0 0 0.25rem 0;
}

.pench-history-event-desc {
  font-size: 0.72rem;
  line-height: 1.45;
  color: var(--on-surface-variant);
  margin: 0;
}

.pench-milestone-badge {
  margin-top: 0.65rem;
  font-size: 0.62rem;
  color: var(--primary);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* =========================================================
   SECTION 3: SAFARI PLANNING HUB (TABS & CONTENT)
   ========================================================= */
.pench-safari-header-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.pench-safari-eyebrow {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--secondary);
}

.pench-card-title {
  font-family: "Noto Serif", Georgia, serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary);
  margin: 0.15rem 0 0 0;
}

.pench-verified-tag {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background-color: var(--surface-container-high);
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-sm);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--on-surface);
}

.pench-verified-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--primary);
}

/* Tab Navigation */
.pench-tabs-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  border-bottom: 1px solid var(--surface-container-high);
  padding-bottom: 0.85rem;
  margin-bottom: 1.25rem;
}

.pench-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
  font-weight: 600;
  border: none;
  background-color: var(--surface-container);
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.2s ease;
}

.pench-tab-btn:hover {
  background-color: var(--surface-container-high);
  color: var(--on-surface);
}

.pench-tab-btn.active {
  background-color: var(--primary);
  color: var(--on-primary);
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 53, 38, 0.25);
}

.pench-tab-pane {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: penchFadeIn 0.25s ease;
}

@keyframes penchFadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tab 1: Vehicles & Quotas */
.pench-safari-vehicles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.pench-safari-vehicle-card {
  background-color: var(--surface-container-low);
  border-radius: var(--radius-sm);
  padding: 1.15rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid var(--surface-container-high);
}

.pench-vehicle-tag-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.pench-vehicle-tag-badge {
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
}

.pench-vehicle-tag-badge.primary {
  background-color: rgba(0, 53, 38, 0.1);
  color: var(--primary);
}

.pench-vehicle-tag-badge.secondary {
  background-color: rgba(154, 70, 0, 0.12);
  color: var(--secondary);
}

.pench-vehicle-tag-sub {
  font-size: 0.68rem;
  color: var(--on-surface-variant);
}

.pench-vehicle-title {
  font-family: "Noto Serif", Georgia, serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--primary);
  margin: 0 0 0.35rem 0;
}

.pench-vehicle-desc {
  font-size: 0.78rem;
  line-height: 1.55;
  color: var(--on-surface-variant);
  margin: 0 0 0.85rem 0;
}

.pench-vehicle-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.pench-vehicle-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.76rem;
  line-height: 1.45;
  color: var(--on-surface);
}

.pench-vehicle-check {
  color: var(--secondary);
  flex-shrink: 0;
  margin-top: 2px;
  width: 15px;
  height: 15px;
}

/* Vehicle Ceiling Box */
.pench-vehicle-ceiling-box {
  background-color: var(--surface-container-high);
  border-radius: var(--radius-sm);
  padding: 1rem;
}

.pench-ceiling-badge {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--primary);
  margin-bottom: 0.75rem;
}

.pench-ceiling-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  text-align: center;
}

.pench-ceiling-card {
  background-color: var(--surface-container-lowest);
  padding: 0.75rem 0.5rem;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}

.pench-ceiling-gate-name {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--on-surface-variant);
}

.pench-ceiling-gate-val {
  font-family: "Noto Serif", Georgia, serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0.15rem 0;
}

.pench-ceiling-gate-val.text-secondary {
  color: var(--secondary);
}

.pench-ceiling-gate-note {
  font-size: 0.68rem;
  color: var(--on-surface-variant);
}

/* Booking Disclaimer Note */
.pench-disclaimer-note {
  background-color: var(--surface-container);
  padding: 0.75rem 0.85rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.pench-disclaimer-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--on-surface);
}

.pench-disclaimer-icon {
  color: var(--secondary);
  flex-shrink: 0;
}

.pench-disclaimer-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.65rem;
  background-color: var(--primary);
  color: var(--on-primary);
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  text-decoration: none;
  flex-shrink: 0;
}

/* Tab 2: Timings & Schedule */
.pench-timings-banners-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.pench-timing-callout-card {
  padding: 0.85rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
}

.pench-timing-callout-card.orange {
  background-color: rgba(154, 70, 0, 0.08);
  border: 1px solid rgba(154, 70, 0, 0.18);
}

.pench-timing-callout-card.red {
  background-color: rgba(186, 26, 26, 0.08);
  border: 1px solid rgba(186, 26, 26, 0.18);
}

.pench-timing-callout-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.pench-timing-callout-icon.text-secondary {
  color: var(--secondary);
}

.pench-timing-callout-icon.text-red {
  color: #ba1a1a;
}

.pench-timing-callout-title {
  font-size: 0.82rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.pench-timing-callout-title.text-secondary {
  color: var(--secondary);
}

.pench-timing-callout-title.text-red {
  color: #ba1a1a;
}

.pench-timing-callout-desc {
  font-size: 0.72rem;
  line-height: 1.4;
  color: var(--on-surface-variant);
  margin: 0;
}

.pench-timings-box {
  background-color: var(--surface-container-low);
  border-radius: var(--radius-sm);
  padding: 1.15rem;
  border: 1px solid var(--surface-container-high);
}

.pench-timings-box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.85rem;
}

.pench-timings-box-eyebrow {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--secondary);
}

.pench-timings-title {
  font-family: "Noto Serif", Georgia, serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--primary);
  margin: 0.1rem 0 0 0;
}

.pench-timings-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  background-color: var(--surface-container-highest);
  color: var(--primary);
  border-radius: var(--radius-sm);
  font-size: 0.72rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pench-timings-toggle-btn:hover {
  background-color: var(--primary);
  color: var(--on-primary);
}

.pench-timings-quick-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.pench-timings-quick-card {
  background-color: var(--surface-container-lowest);
  padding: 0.75rem 0.85rem;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}

.pench-timings-month-tag {
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--on-surface-variant);
  display: block;
  margin-bottom: 0.35rem;
}

.pench-timings-row {
  font-size: 0.76rem;
  line-height: 1.45;
  color: var(--on-surface);
}

.pench-timings-table-container {
  overflow-x: auto;
  margin-top: 1rem;
  border-radius: var(--radius-sm);
  background-color: var(--surface-container-lowest);
  box-shadow: var(--shadow-sm);
}

.pench-timings-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.78rem;
}

.pench-timings-table th {
  background-color: var(--surface-container);
  color: var(--on-surface);
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.75rem 0.85rem;
  border-bottom: 1px solid var(--surface-container-high);
}

.pench-timings-table td {
  padding: 0.75rem 0.85rem;
  border-bottom: 1px solid var(--surface-container-low);
  color: var(--on-surface-variant);
}

.pench-timings-table tr:hover td {
  background-color: var(--surface-container-low);
}

.pench-table-closed-row td {
  background-color: rgba(230, 226, 215, 0.6);
  color: var(--on-surface);
  font-weight: 700;
}

/* Tab 3: Seasons & Weather */
.pench-seasons-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.pench-season-card {
  background-color: var(--surface-container-low);
  border-radius: var(--radius-sm);
  padding: 1.15rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid var(--surface-container-high);
}

.pench-season-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.pench-season-badge {
  font-size: 0.62rem;
  font-weight: 800;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  background-color: rgba(0, 53, 38, 0.1);
  color: var(--primary);
}

.pench-season-badge.secondary {
  background-color: rgba(154, 70, 0, 0.12);
  color: var(--secondary);
}

.pench-season-badge.closed {
  background-color: var(--surface-container-highest);
  color: var(--on-surface);
}

.pench-season-title {
  font-family: "Noto Serif", Georgia, serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--primary);
  margin: 0 0 0.35rem 0;
}

.pench-season-title.text-secondary {
  color: var(--secondary);
}

.pench-season-desc {
  font-size: 0.78rem;
  line-height: 1.55;
  color: var(--on-surface-variant);
  margin: 0 0 0.85rem 0;
}

.pench-season-timings {
  background-color: var(--surface-container-lowest);
  padding: 0.55rem 0.75rem;
  border-radius: 4px;
  font-size: 0.72rem;
  line-height: 1.4;
  color: var(--on-surface);
}

.pench-season-timings strong {
  display: block;
  margin-bottom: 0.15rem;
}

/* Tab 4: Safari Gates Directory */
.pench-gates-filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--surface-container-low);
  padding: 0.55rem 0.75rem;
  border-radius: var(--radius-sm);
}

.pench-gates-filter-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--on-surface);
}

.pench-gates-filter-buttons {
  display: flex;
  gap: 0.4rem;
}

.pench-gate-filter-btn {
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  border: none;
  font-size: 0.72rem;
  font-weight: 600;
  background-color: var(--surface-container);
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: all 0.2s ease;
}

.pench-gate-filter-btn:hover {
  background-color: var(--surface-container-high);
  color: var(--on-surface);
}

.pench-gate-filter-btn.active {
  background-color: var(--primary);
  color: var(--on-primary);
  font-weight: 700;
}

.pench-gates-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
}

.pench-gate-card {
  background-color: var(--surface-container-low);
  border-radius: var(--radius-sm);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--surface-container-high);
}

.pench-gate-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.pench-gate-type-pill {
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}

.pench-gate-type-pill.core {
  background-color: rgba(0, 53, 38, 0.1);
  color: var(--primary);
}

.pench-gate-type-pill.buffer {
  background-color: rgba(154, 70, 0, 0.12);
  color: var(--secondary);
}

.pench-gate-district {
  font-size: 0.68rem;
  color: var(--on-surface-variant);
}

.pench-gate-name {
  font-family: "Noto Serif", Georgia, serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--primary);
  margin: 0 0 0.35rem 0;
}

.pench-gate-desc {
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--on-surface-variant);
  margin: 0 0 0.65rem 0;
}

.pench-gate-highlights-box {
  background-color: var(--surface-container-lowest);
  padding: 0.5rem 0.65rem;
  border-radius: 4px;
  font-size: 0.7rem;
  line-height: 1.4;
  color: var(--on-surface);
  margin-bottom: 0.75rem;
}

.pench-gate-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.55rem;
  border-top: 1px solid var(--surface-container-high);
}

.pench-gate-quota-text {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--secondary);
}

.pench-gate-map-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.pench-gate-map-btn:hover {
  color: var(--secondary);
}

.pench-scope-note {
  background-color: var(--surface-container);
  padding: 0.75rem 0.85rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--on-surface-variant);
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.pench-scope-note strong {
  color: var(--on-surface);
}

/* =========================================================
   SECTION 4: HOW TO REACH PENCH
   ========================================================= */
.pench-reach-header-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.pench-reach-eyebrow {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--secondary);
}

.pench-reach-tag-pill {
  font-size: 0.72rem;
  color: var(--on-surface-variant);
  background-color: var(--surface-container);
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
  font-weight: 600;
}

.pench-reach-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.pench-reach-card {
  background-color: var(--surface-container-low);
  border-radius: var(--radius-sm);
  padding: 1.15rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid var(--surface-container-high);
}

.pench-reach-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background-color: var(--surface-container-highest);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.65rem;
}

.pench-reach-card-type {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--on-surface-variant);
}

.pench-reach-main-title {
  font-family: "Noto Serif", Georgia, serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--primary);
  margin: 0.15rem 0 0.35rem 0;
}

.pench-reach-sub-info {
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--on-surface-variant);
  margin: 0;
}

.pench-reach-sub-info strong {
  color: var(--on-surface);
}

.pench-reach-secondary-info {
  margin-top: 0.5rem;
  font-size: 0.74rem;
  line-height: 1.45;
  color: var(--on-surface-variant);
}

.pench-reach-footer-tag {
  margin-top: 0.85rem;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--secondary);
  letter-spacing: 0.04em;
}

/* =========================================================
   SECTION 5: FAQS (ACCORDION)
   ========================================================= */
.pench-faqs-header-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.pench-faqs-eyebrow {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--secondary);
}

.pench-faqs-count-badge {
  font-size: 0.72rem;
  color: var(--on-surface-variant);
}

.pench-faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.pench-faq-item {
  background-color: var(--surface-container-low);
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--surface-container-high);
  transition: all 0.2s ease;
}

.pench-faq-question {
  width: 100%;
  padding: 0.85rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  text-align: left;
  background: none;
  border: none;
  font-family: "Noto Serif", Georgia, serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.pench-faq-question:hover {
  background-color: var(--surface-container-high);
}

.pench-faq-chevron {
  flex-shrink: 0;
  transition: transform 0.25s ease;
}

.pench-faq-item.active .pench-faq-chevron {
  transform: rotate(180deg);
}

.pench-faq-answer {
  padding: 0 1rem 0.85rem 1rem;
  font-size: 0.8rem;
  line-height: 1.6;
  color: var(--on-surface-variant);
}

.pench-faq-answer p {
  margin: 0;
}

/* =========================================================
   PROPOSAL CTA BANNER
   ========================================================= */
.pench-final-cta-card {
  background-color: var(--primary);
  color: var(--on-primary);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
}

.pench-final-cta-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-width: 600px;
  position: relative;
  z-index: 2;
}

.pench-final-cta-tag {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--secondary-fixed);
}

.pench-final-cta-title {
  font-family: "Noto Serif", Georgia, serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--on-primary);
  margin: 0;
}

.pench-final-cta-desc {
  font-size: 0.78rem;
  line-height: 1.5;
  color: rgba(245, 240, 229, 0.9);
  margin: 0;
}

.pench-final-cta-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.pench-final-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1.25rem;
  background-color: var(--secondary);
  color: var(--on-secondary);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-decoration: none;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.pench-final-cta-btn:hover {
  background-color: var(--secondary-container);
  color: #321200;
  transform: translateY(-1px);
}

.pench-final-cta-secondary-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1.15rem;
  background: rgba(253, 249, 238, 0.15);
  backdrop-filter: blur(6px);
  color: var(--on-primary);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.pench-final-cta-secondary-btn:hover {
  background: rgba(253, 249, 238, 0.25);
}

/* =========================================================
   ACCESSIBILITY & FOCUS VISIBLE STATES
   ========================================================= */
.pench-hero-cta:focus-visible,
.pench-hero-secondary:focus-visible,
.pench-sidebar-nav-link:focus-visible,
.pench-sidebar-widget-btn:focus-visible,
.pench-tab-btn:focus-visible,
.pench-gate-filter-btn:focus-visible,
.pench-gate-map-btn:focus-visible,
.pench-faq-question:focus-visible,
.pench-final-cta-btn:focus-visible,
.pench-final-cta-secondary-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* =========================================================
   RESPONSIVE MEDIA QUERIES
   ========================================================= */
@media (max-width: 1024px) {
  .pench-layout {
    flex-direction: column;
  }

  .pench-sidebar {
    width: 100%;
    position: static;
  }

  .pench-about-grid {
    grid-template-columns: 1fr;
  }

  .pench-history-timeline-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .pench-gates-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .pench-hero-snapshot-bar {
    grid-template-columns: repeat(2, 1fr);
  }

  .pench-safari-vehicles-grid {
    grid-template-columns: 1fr;
  }

  .pench-ceiling-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .pench-timings-banners-grid {
    grid-template-columns: 1fr;
  }

  .pench-timings-quick-strip {
    grid-template-columns: 1fr;
  }

  .pench-seasons-grid {
    grid-template-columns: 1fr;
  }

  .pench-gates-grid {
    grid-template-columns: 1fr;
  }

  .pench-reach-grid {
    grid-template-columns: 1fr;
  }

  .pench-final-cta-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .pench-final-cta-actions {
    width: 100%;
    flex-direction: column;
  }

  .pench-final-cta-btn,
  .pench-final-cta-secondary-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .pench-hero {
    min-height: auto;
  }

  .pench-hero-content {
    padding: 1.5rem 1rem 0.85rem;
  }

  .pench-hero-snapshot-bar {
    grid-template-columns: 1fr;
  }

  .pench-container {
    padding: 1.25rem 1rem 3rem;
  }

  .pench-card {
    padding: 1rem;
  }

  .pench-history-timeline-grid {
    grid-template-columns: 1fr;
  }

  .pench-ceiling-grid {
    grid-template-columns: 1fr;
  }

  .pench-gates-filter-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pench-page *,
  .pench-hero-img {
    transition: none !important;
    animation: none !important;
  }
}
```
