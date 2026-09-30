/* ==========================================================
   Kanha Tiger Reserve Comprehensive Information Page
   Visual Structure & Layout: Matching Luxury Wildlife Standard
   ========================================================== */

import React, { useState, useEffect } from 'react';
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
  Car,
  Layers,
  Calendar,
  Plane,
  Train,
  TreePine,
  HelpCircle,
  Search
} from 'lucide-react';

import { Destination } from '../../services/destination.service';
import { Resort } from '../../services/resort.service';

// Scoped Page Stylesheet
import '../../styles/public/KanhaInformation.css';

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

interface KanhaDetailsProps {
  destination: Destination;
  resorts?: Resort[];
  safariGates?: SafariGate[];
}

const KANHA_HERO_IMAGE = 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1600&q=80';

const KANHA_MASTER_GATES: SafariGate[] = [
  // Core Gates (Physical entry points accessing Kanha, Kisli, Mukki, and Sarhi core zones)
  {
    id: 'core-khatia',
    name: 'Khatia Gate',
    type: 'Core',
    district: 'Mandla District, MP',
    description: 'Khatia village, near Kisli, western side of the reserve. Most popular gate providing access to Kanha, Kisli, Mukki, and Sarhi core zones, plus Khatia buffer.',
    highlights: 'Kisli & Kanha meadows, highest visitor hub, closest entrance when traveling from Jabalpur',
    quota: 'Morning & Afternoon Shifts (Wed afternoon closed)',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Khatia+Gate+Kanha+National+Park'
  },
  {
    id: 'core-mukki',
    name: 'Mukki Gate',
    type: 'Core',
    district: 'Balaghat District, MP',
    description: 'Mukki, southern side of the reserve. Prime tiger territory with direct access to Mukki, Kanha, and Kisli core zones, plus Khapa buffer.',
    highlights: 'Mukki zone waterholes, Babathenga waterbody, ideal for arrivals via Raipur, Gondia & Nagpur',
    quota: 'Morning & Afternoon Shifts (Wed afternoon closed)',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Mukki+Gate+Kanha+National+Park'
  },
  {
    id: 'core-sarhi',
    name: 'Sarhi Gate',
    type: 'Core',
    district: 'Mandla District (Bichhiya), MP',
    description: 'Sarhi, near Bichhiya on the northern fringe. Serene, uncrowded core entrance accessing Sarhi and Kanha core zones, plus Sijora buffer.',
    highlights: 'Rolling hills, tranquil sal tracks, exceptional raptor birdwatching, northern corridor access',
    quota: 'Morning & Afternoon Shifts (Wed afternoon closed)',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Sarhi+Gate+Kanha+National+Park'
  },
  // Buffer Gates
  {
    id: 'buf-khatia',
    name: 'Khatia Buffer Gate',
    type: 'Buffer',
    district: 'Mandla District, MP',
    description: 'Western side buffer zone accessed via Khatia gate. Kanha’s largest buffer zone spanning roughly 357 sq km of rich mixed deciduous woodland.',
    highlights: 'Year-round safari access (including monsoon), nocturnal species, active predator tracking',
    quota: 'Day & Year-Round Drives Available',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Khatia+Buffer+Gate+Kanha'
  },
  {
    id: 'buf-khapa',
    name: 'Khapa Buffer Gate',
    type: 'Buffer',
    district: 'Balaghat District, MP',
    description: 'Southwestern buffer zone accessed via Mukki gate. Lush forest corridors connecting southern ranges with steady wildlife movement.',
    highlights: 'Monsoon safari enabled, open meadow fringes, leopards and herbivore herds',
    quota: 'Day & Year-Round Drives Available',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Khapa+Buffer+Gate+Kanha'
  },
  {
    id: 'buf-sijora',
    name: 'Sijora / Sijhora Buffer Gate',
    type: 'Buffer',
    district: 'Mandla District, MP',
    description: 'Northern buffer sector accessed via Sarhi gate. Quiet landscape with scenic rocky outcroppings and seasonal water streams.',
    highlights: 'Offbeat wilderness exploration, birding trails, open year-round during monsoon',
    quota: 'Day & Year-Round Drives Available',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Sijora+Buffer+Gate+Kanha'
  },
  {
    id: 'buf-phen',
    name: 'Phen Wildlife Sanctuary Gate',
    type: 'Buffer',
    district: 'Mandla / Balaghat Border, MP',
    description: 'Contiguous 110.74 sq km satellite wildlife sanctuary managed as a satellite micro-core under unified control of the Kanha Field Director.',
    highlights: 'Pristine untouched wilderness, leopards, chital, gaur, exclusive eco-trails',
    quota: 'Special Buffer / Sanctuary Quota',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Phen+Wildlife+Sanctuary+Kanha'
  }
];

const KANHA_HISTORICAL_MILESTONES = [
  {
    year: '1933',
    stepNumber: '01',
    shortLabel: 'Sanctuaries Declared',
    title: 'Banjar & Halon Sanctuaries',
    description: 'The Banjar valley (233 sq km) in 1933 and Halon valley (500 sq km) in 1935 declared Wildlife Sanctuaries, marking the first formal wildlife protection decades after the 1879 reserve forest decree.',
    badge: 'Sanctuary Era'
  },
  {
    year: '1955',
    stepNumber: '02',
    shortLabel: 'National Park',
    title: 'Upgraded to Kanha National Park',
    description: 'On 1 June 1955, Banjar valley sanctuary was formally upgraded to Kanha National Park, establishing the cornerstone of Central India’s conservation landscape.',
    badge: 'National Park'
  },
  {
    year: '1973',
    stepNumber: '03',
    shortLabel: 'Project Tiger',
    title: 'Original 9 Project Tiger Reserves',
    description: 'Kanha inducted as one of India’s first 9 Project Tiger Reserves on 1 April 1973. Phased enlargement over subsequent decades expanded the National Park area to 940 sq km.',
    badge: 'Project Tiger'
  },
  {
    year: '1995',
    stepNumber: '04',
    shortLabel: 'Buffer Constituted',
    title: 'Dedicated Buffer Zone Constituted',
    description: 'A 1,134.36 sq km dedicated buffer management division was constituted from West-Mandla, East-Mandla, and North-Balaghat territorial forest divisions for unified landscape stewardship.',
    badge: 'Buffer Expansion'
  },
  {
    year: '2007',
    stepNumber: '05',
    shortLabel: 'Critical Habitat',
    title: 'Critical Tiger Habitat Notified',
    description: '917.43 sq km core area formally notified as Critical Tiger Habitat under the 2006 Wildlife Protection Act amendment, providing the highest tier of legal protection in India.',
    badge: 'Apex NTCA Status'
  }
];

const KANHA_SAFARI_TIMETABLE = [
  { season: 'October', slot: 'Morning', entryTime: '06:00 AM', exitTime: '11:00 AM' },
  { season: 'October', slot: 'Afternoon', entryTime: '15:00 PM', exitTime: '18:00 PM' },
  { season: 'November', slot: 'Morning', entryTime: '06:15 AM', exitTime: '11:00 AM' },
  { season: 'November', slot: 'Afternoon', entryTime: '15:00 PM', exitTime: '17:45 PM' },
  { season: 'December', slot: 'Morning', entryTime: '06:30 AM', exitTime: '11:00 AM' },
  { season: 'December', slot: 'Afternoon', entryTime: '15:00 PM', exitTime: '17:30 PM' },
  { season: 'January', slot: 'Morning', entryTime: '06:45 AM', exitTime: '11:00 AM' },
  { season: 'January', slot: 'Afternoon', entryTime: '15:00 PM', exitTime: '17:45 PM' },
  { season: 'February', slot: 'Morning', entryTime: '06:30 AM', exitTime: '11:00 AM' },
  { season: 'February', slot: 'Afternoon', entryTime: '15:00 PM', exitTime: '18:15 PM' },
  { season: 'March', slot: 'Morning', entryTime: '06:15 AM', exitTime: '11:00 AM' },
  { season: 'March', slot: 'Afternoon', entryTime: '15:00 PM', exitTime: '18:30 PM' },
  { season: 'April', slot: 'Morning', entryTime: '05:45 AM', exitTime: '11:00 AM' },
  { season: 'April', slot: 'Afternoon', entryTime: '16:00 PM', exitTime: '18:45 PM' },
  { season: 'May', slot: 'Morning', entryTime: '05:30 AM', exitTime: '11:00 AM' },
  { season: 'May', slot: 'Afternoon', entryTime: '16:00 PM', exitTime: '19:00 PM' },
  { season: 'June', slot: 'Morning', entryTime: '05:30 AM', exitTime: '11:00 AM' },
  { season: 'June', slot: 'Afternoon', entryTime: '16:00 PM', exitTime: '19:00 PM' }
];

const KANHA_FAQS = [
  {
    question: '1. What is the best time to visit Kanha Tiger Reserve?',
    answer:
      'Kanha is open from October 1 to June 30. December to February offers pleasant winter weather (temperatures can approach freezing in early mornings) with lush post-monsoon sal canopies. March to May (summer) provides peak tiger-sighting probabilities as wildlife concentrates around shrinking waterholes and open dadars. Core zones are closed during the monsoon (July to September/mid-October), but buffer zones remain open year-round.'
  },
  {
    question: '2. How do I book safari permits for Kanha?',
    answer:
      'Safaris are booked online through the official MP Forest Department portal (forest.mponline.gov.in). Bookings for core zones (Kanha, Kisli, Mukki, Sarhi) and buffer zones (Khatia, Khapa, Sijora) are made separately by zone. Advance bookings open up to 120 days prior at 08:00 AM IST. Vehicle and guide charges are paid separately at the gate.'
  },
  {
    question: '3. How long does a safari last, and how many can I take in a day?',
    answer:
      'Two shifts operate daily — morning (roughly 4.5 to 5 hours, starting 05:30–06:45 AM to 11:00 AM) and afternoon/evening (roughly 3 to 3.5 hours, ending at sunset). Only one safari per shift is permitted per vehicle permit.'
  },
  {
    question: '4. Which entry gate should I choose — Khatia, Mukki, or Sarhi?',
    answer:
      'Khatia Gate (western side) is the most popular, providing access to all four core zones (Kanha, Kisli, Mukki, Sarhi) and closest to Jabalpur. Mukki Gate (southern side) is renowned for tiger tracking and ideal for guests arriving from Raipur, Gondia, or Nagpur. Sarhi Gate (northern side) is tranquil, ideal for birdwatching and avoiding safari traffic.'
  },
  {
    question: '5. What identity documents and essentials should I carry?',
    answer:
      'Original government-issued photo ID (Aadhaar, Passport, Voter ID, or Driving License) used during MPOnline booking is mandatory for gate verification. Warm layers and jackets are essential for winter morning safaris, while hats, sunscreen, and light cottons are recommended for March–June drives.'
  }
];

const KanhaInformation = ({
  destination,
  resorts: _resorts,
  safariGates = KANHA_MASTER_GATES
}: KanhaDetailsProps) => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'timings' | 'gates'>('vehicles');
  const [gateFilter, setGateFilter] = useState<'all' | 'Core' | 'Buffer'>('all');
  const [gateSearchQuery, setGateSearchQuery] = useState<string>('');
  const [timingSlotFilter, setTimingSlotFilter] = useState<'All' | 'Morning' | 'Afternoon'>('All');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeSection, setActiveSection] = useState<string>('about');
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number>(0);

  // Sticky Sub-Nav Scroll-Spy Listener
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['about', 'history', 'safari-hub', 'how-to-reach', 'faqs'];
      const scrollPos = window.scrollY + 180;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const elem = document.getElementById(id);
        if (elem) {
          if (scrollPos >= elem.offsetTop) {
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

  // Filter gates dynamically from props & search query
  const filteredGates = safariGates.filter((gate) => {
    const matchesFilter = gateFilter === 'all' || gate.type === gateFilter;
    const matchesSearch = gate.name.toLowerCase().includes(gateSearchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const coreGatesCount = safariGates.filter((g) => g.type === 'Core').length;
  const bufferGatesCount = safariGates.filter((g) => g.type === 'Buffer').length;

  const filteredTimings = timingSlotFilter === 'All'
    ? KANHA_SAFARI_TIMETABLE
    : KANHA_SAFARI_TIMETABLE.filter((t) => t.slot === timingSlotFilter);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const scrollToSection = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const elem = document.getElementById(id);
    if (elem) {
      const headerOffset = 135;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="kanha-page">
      {/* ================= 1. COMPACT LUXURY HERO SECTION ================= */}
      <section className="kanha-hero">
        <img
          src={destination.coverImage || (destination.images && destination.images[0]) || KANHA_HERO_IMAGE}
          alt={destination.name || 'Kanha scenic background'}
          className="kanha-hero-img"
        />

        <div className="kanha-hero-overlay" />

        <div className="kanha-hero-content">
          <div className="kanha-hero-wrapper">
            <div className="kanha-hero-eyebrow">
              <span className="kanha-hero-sublocation">MANDLA &amp; BALAGHAT, MADHYA PRADESH</span>
            </div>

            <h1 className="kanha-hero-title">
              {destination.name || 'Kanha Tiger Reserve'}
            </h1>

            <p className="kanha-hero-subtitle">
              The iconic wilderness that inspired <em>The Jungle Book</em> and saved the hard-ground Barasingha from extinction. Spanning over 2,074 sq km of towering sal forests, open meadows ('dadars'), and thriving tiger habitats across the Maikal hills.
            </p>

            <div className="kanha-hero-actions">
              <Link
                to={`/trip-request/new?destination=${destination.id}`}
                className="kanha-hero-cta"
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
                className="kanha-hero-secondary"
              >
                <span>Explore Safari Gates</span>
                <Compass size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. FLOATING HORIZONTAL SECTION NAV ================= */}
      <div className="kanha-nav-wrapper">
        <nav className="kanha-sticky-nav" aria-label="Reserve Sections Navigation">
          <div className="kanha-sticky-nav-inner">
            <div className="kanha-sticky-nav-links">
              <button
                type="button"
                onClick={(e) => scrollToSection('about', e)}
                className={`kanha-sticky-nav-link ${activeSection === 'about' ? 'active' : ''}`}
              >
                <TreePine size={16} />
                <span>Overview &amp; Habitat</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('history', e)}
                className={`kanha-sticky-nav-link ${activeSection === 'history' ? 'active' : ''}`}
              >
                <History size={16} />
                <span>Milestones</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('safari-hub', e)}
                className={`kanha-sticky-nav-link ${activeSection === 'safari-hub' ? 'active' : ''}`}
              >
                <Compass size={16} />
                <span>Safari Planning Hub</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('how-to-reach', e)}
                className={`kanha-sticky-nav-link ${activeSection === 'how-to-reach' ? 'active' : ''}`}
              >
                <MapPin size={16} />
                <span>How to Reach</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('faqs', e)}
                className={`kanha-sticky-nav-link ${activeSection === 'faqs' ? 'active' : ''}`}
              >
                <HelpCircle size={16} />
                <span>FAQs</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* ================= 3. FULL-WIDTH LUXURY CONTAINER ================= */}
      <div className="kanha-container">
        <main className="kanha-main">
          {/* ================= SECTION 1: ABOUT & HABITAT ================= */}
          <section id="about" className="kanha-card kanha-about-card">
            <div className="kanha-card-header">
              <span className="kanha-card-eyebrow">ABOUT KANHA</span>
              <h2 className="kanha-card-title">The Land of Sal Canopies &amp; Barasingha</h2>
            </div>

            <div className="kanha-about-body">
              <p>
                Spread across the Maikal range of the Satpura hills in southeastern Madhya Pradesh, Kanha Tiger Reserve is the state's largest national park and one of India's most celebrated wildlife destinations. Its lowland forests are a lush mix of sal (<em>Shorea robusta</em>) and mixed deciduous trees interspersed with open, rolling grasslands (locally called 'dadars'), while the highlands support moist bamboo thickets. Kanha is globally renowned as the last natural refuge that saved the <strong>hard-ground barasingha (swamp deer)</strong> from extinction, sustaining an estimated <strong>105+ resident Bengal tigers</strong>, leopards, Indian gaur, sloth bears, dholes (Asiatic wild dogs), and over 300 bird species.
              </p>
            </div>

            {/* Metric Stats Cards */}
            <div className="kanha-stats-grid">
              <div className="kanha-stat-card">
                <span className="kanha-stat-value">~2,074.32</span>
                <span className="kanha-stat-unit">SQ KM</span>
                <span className="kanha-stat-label">TOTAL PROTECTED AREA</span>
              </div>

              <div className="kanha-stat-card">
                <span className="kanha-stat-value">~917.43</span>
                <span className="kanha-stat-unit">SQ KM</span>
                <span className="kanha-stat-label">CRITICAL CORE HABITAT</span>
              </div>

              <div className="kanha-stat-card">
                <span className="kanha-stat-value">~1,134.36</span>
                <span className="kanha-stat-unit">SQ KM</span>
                <span className="kanha-stat-label">BUFFER CORRIDOR (+ PHEN WLS)</span>
              </div>
            </div>

            {/* Story / Provenance of Kanha */}
            <div className="kanha-story-card">
              <div className="kanha-story-badge">
                <TreePine size={16} />
                <span>VALLEY HERITAGE &amp; TRIBAL LINEAGE</span>
              </div>
              <h3 className="kanha-story-title">The Legend of the Maikal Valley</h3>
              <p className="kanha-story-text">
                First declared a reserve forest in 1879, the sanctuary derives its name directly from the ancient Kanha valley within the Maikal hills. Alongside neighboring Pench, these rolling sal highlands are widely celebrated as the geographical inspiration for Rudyard Kipling’s 1894 classic <em>The Jungle Book</em>. Kanha also shares deep indigenous connections with the Gond and Baiga tribal communities, whose historical stewardship shaped the conservation ethics of the reserve.
              </p>
            </div>
          </section>

          {/* ================= SECTION 2: HISTORICAL MILESTONES ================= */}
          <section id="history" className="kanha-card kanha-history-card">
            <div className="kanha-card-header">
              <span className="kanha-card-eyebrow">CHRONICLES OF CONSERVATION</span>
              <h2 className="kanha-card-title">Historical Milestones</h2>
              <p className="kanha-card-subtitle">
                From 19th-century reserve forests to India’s flagship Project Tiger Reserve — explore Kanha's conservation journey. Hover or tap any year to view details.
              </p>
            </div>

            {/* Interactive Horizontal Year Track */}
            <div className="kanha-milestone-track-container">
              <div className="kanha-milestone-track-line" />
              <div className="kanha-milestone-nodes">
                {KANHA_HISTORICAL_MILESTONES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveMilestoneIndex(idx)}
                    onMouseEnter={() => setActiveMilestoneIndex(idx)}
                    className={`kanha-milestone-node ${activeMilestoneIndex === idx ? 'active' : ''}`}
                    aria-label={`Milestone year ${item.year}: ${item.title}`}
                  >
                    <span className="kanha-milestone-node-dot" />
                    <span className="kanha-milestone-node-year">{item.year}</span>
                    <span className="kanha-milestone-node-label">{item.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Milestone Detail Card */}
            <div className="kanha-milestone-detail-card">
              <div className="kanha-milestone-detail-watermark">
                {KANHA_HISTORICAL_MILESTONES[activeMilestoneIndex].year}
              </div>

              <div className="kanha-milestone-detail-inner">
                <div className="kanha-milestone-detail-top-badge">
                  <span className="kanha-milestone-badge-pill">
                    <span className="kanha-milestone-badge-dot" />
                    {KANHA_HISTORICAL_MILESTONES[activeMilestoneIndex].badge}
                  </span>
                </div>

                <div className="kanha-milestone-detail-body">
                  <div className="kanha-milestone-detail-lead">
                    <span className="kanha-milestone-detail-year-highlight">
                      {KANHA_HISTORICAL_MILESTONES[activeMilestoneIndex].year}
                    </span>
                    <h3 className="kanha-milestone-detail-title">
                      {KANHA_HISTORICAL_MILESTONES[activeMilestoneIndex].title}
                    </h3>
                  </div>
                  <p className="kanha-milestone-detail-desc">
                    {KANHA_HISTORICAL_MILESTONES[activeMilestoneIndex].description}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 3: SAFARI PLANNING HUB ================= */}
          <section id="safari-hub" className="kanha-card kanha-safari-hub-card">
            <div className="kanha-card-header">
              <span className="kanha-card-eyebrow">SAFARI PLANNING &amp; GATES DIRECTORY</span>
              <h2 className="kanha-card-title">Kanha Safari Planning Hub</h2>
              <p className="kanha-card-subtitle">
                Interactive directory of official 4x4 safari vehicles, monthly gate shift timings, and MP core vs. buffer gate locations.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="kanha-hub-tabs">
              <button
                type="button"
                className={`kanha-hub-tab ${activeTab === 'vehicles' ? 'active' : ''}`}
                onClick={() => setActiveTab('vehicles')}
              >
                <Car size={16} />
                <span>Vehicles &amp; Capacities</span>
              </button>

              <button
                type="button"
                className={`kanha-hub-tab ${activeTab === 'timings' ? 'active' : ''}`}
                onClick={() => setActiveTab('timings')}
              >
                <Clock size={16} />
                <span>Shift Timings &amp; Rules</span>
              </button>

              <button
                type="button"
                className={`kanha-hub-tab ${activeTab === 'gates' ? 'active' : ''}`}
                onClick={() => setActiveTab('gates')}
              >
                <MapPin size={16} />
                <span>Gates Directory ({safariGates.length})</span>
              </button>
            </div>

            {/* Tab 1: Vehicles & Capacities */}
            {activeTab === 'vehicles' && (
              <div className="kanha-tab-pane">
                <div className="kanha-vehicles-grid">
                  <div className="kanha-vehicle-card">
                    <div className="kanha-vehicle-header">
                      <div className="kanha-vehicle-icon-wrap">
                        <Car size={24} />
                      </div>
                      <div>
                        <span className="kanha-vehicle-tag">STANDARD SAFARI</span>
                        <h3 className="kanha-vehicle-title">Open 4x4 Maruti Gypsy</h3>
                      </div>
                    </div>
                    <p className="kanha-vehicle-desc">
                      Standard registered open 4x4 Gypsy vehicle operated for official forest drives across all core zones (Kanha, Kisli, Mukki, Sarhi) and buffer tracks.
                    </p>
                    <ul className="kanha-vehicle-features">
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Permit Scope:</strong> Valid across 4 Core Zones &amp; 4 Buffer Gates</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Occupancy:</strong> Strictly capped at 6 tourists + 1 guide + 1 driver</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Shift Types:</strong> Morning &amp; Afternoon Game Drives</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Booking Type:</strong> Full vehicle permit or single-seat reservation</span>
                      </li>
                    </ul>
                  </div>

                  <div className="kanha-vehicle-card">
                    <div className="kanha-vehicle-header">
                      <div className="kanha-vehicle-icon-wrap">
                        <Layers size={24} />
                      </div>
                      <div>
                        <span className="kanha-vehicle-tag">ZONE CEILINGS</span>
                        <h3 className="kanha-vehicle-title">Vehicle Quota Allocation</h3>
                      </div>
                    </div>
                    <p className="kanha-vehicle-desc">
                      Strict daily vehicle ceilings enforced by the MP Forest Department to preserve wildlife ecology.
                    </p>
                    <ul className="kanha-vehicle-features">
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Kanha &amp; Mukki Core:</strong> Up to 36/23 and 30/28 vehicles per shift</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Kisli &amp; Sarhi Core:</strong> Up to 15/10 and 19/17 vehicles per shift</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Buffer Zones:</strong> Khatia (25/15), Khapa (20/12), Sijora (20/12)</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Permit Window:</strong> MPOnline portal opens 120 days in advance at 08:00 AM</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Timings & Rules */}
            {activeTab === 'timings' && (
              <div className="kanha-tab-pane">
                <div className="kanha-timings-filter-bar">
                  <div className="kanha-timings-filter-buttons">
                    {(['All', 'Morning', 'Afternoon'] as const).map((slot) => {
                      const count = slot === 'All'
                        ? KANHA_SAFARI_TIMETABLE.length
                        : KANHA_SAFARI_TIMETABLE.filter((t) => t.slot === slot).length;
                      return (
                        <button
                          key={slot}
                          type="button"
                          className={`kanha-timing-filter-btn ${timingSlotFilter === slot ? 'active' : ''}`}
                          onClick={() => setTimingSlotFilter(slot)}
                        >
                          {slot === 'All' ? 'All Slots' : `${slot} Slot`} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="kanha-timings-table-wrapper compact">
                  <table className="kanha-timings-table compact">
                    <thead>
                      <tr>
                        <th>Safari Season / Month</th>
                        <th>Slot</th>
                        <th>Entry Time</th>
                        <th>Exit Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTimings.map((row, idx) => (
                        <tr key={idx}>
                          <td className="kanha-timing-season"><strong>{row.season}</strong></td>
                          <td className="kanha-timing-slot">{row.slot}</td>
                          <td className="kanha-timing-time">{row.entryTime}</td>
                          <td className="kanha-timing-time">{row.exitTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Closure Warnings */}
                <div className="kanha-closure-box compact">
                  <div className="kanha-closure-item">
                    <AlertTriangle className="kanha-closure-icon" size={16} />
                    <div>
                      <strong>Wednesday Afternoon Closure:</strong> All Core and Buffer safari zones are closed every Wednesday afternoon (morning safaris run normally).
                    </div>
                  </div>
                  <div className="kanha-closure-item">
                    <AlertTriangle className="kanha-closure-icon" size={16} />
                    <div>
                      <strong>Monsoon Policy:</strong> Core zones close July 1 to Sept 30. Buffer zones (Khatia, Khapa, Sijora) remain open year-round for ecotourism.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Gates Directory */}
            {activeTab === 'gates' && (
              <div className="kanha-tab-pane">
                <div className="kanha-gates-filter-bar">
                  <div className="kanha-gates-filter-buttons">
                    <button
                      type="button"
                      className={`kanha-gate-filter-btn ${gateFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setGateFilter('all')}
                    >
                      All Safari Gates ({safariGates.length})
                    </button>
                    <button
                      type="button"
                      className={`kanha-gate-filter-btn ${gateFilter === 'Core' ? 'active' : ''}`}
                      onClick={() => setGateFilter('Core')}
                    >
                      Core Gates ({coreGatesCount})
                    </button>
                    <button
                      type="button"
                      className={`kanha-gate-filter-btn ${gateFilter === 'Buffer' ? 'active' : ''}`}
                      onClick={() => setGateFilter('Buffer')}
                    >
                      Buffer Gates ({bufferGatesCount})
                    </button>
                  </div>

                  <div className="kanha-gates-search-box">
                    <Search size={15} className="kanha-gates-search-icon" />
                    <input
                      type="text"
                      value={gateSearchQuery}
                      onChange={(e) => setGateSearchQuery(e.target.value)}
                      placeholder="Search gate name..."
                      className="kanha-gates-search-input"
                    />
                  </div>
                </div>

                <div className="kanha-gates-compact-grid">
                  {filteredGates.map((gate) => (
                    <div key={gate.id} className={`kanha-gate-compact-card ${gate.type.toLowerCase()}`}>
                      <div className="kanha-gate-compact-main">
                        <span className={`kanha-gate-type-badge ${gate.type.toLowerCase()}`}>
                          {gate.type} Gate
                        </span>
                        <h4 className="kanha-gate-compact-name">{gate.name}</h4>
                      </div>

                      {gate.mapLink && (
                        <a
                          href={gate.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="kanha-gate-compact-map-btn"
                          title={`Open ${gate.name} location in Google Maps`}
                        >
                          <MapPin size={14} />
                          <span>Location</span>
                          <ArrowUpRight size={13} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                {filteredGates.length === 0 && (
                  <div className="kanha-gates-empty-state">
                    <p>No safari gates found matching "{gateSearchQuery}".</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ================= SECTION 4: HOW TO REACH ================= */}
          <section id="how-to-reach" className="kanha-card kanha-reach-card">
            <div className="kanha-card-header">
              <span className="kanha-card-eyebrow">TRAVEL &amp; CONNECTIVITY</span>
              <h2 className="kanha-card-title">How to Reach Kanha</h2>
              <p className="kanha-card-subtitle">
                Accessible via major Madhya Pradesh &amp; Maharashtra transit corridors, connecting regional airports and railway junctions.
              </p>
            </div>

            <div className="kanha-reach-grid">
              {/* By Air */}
              <div className="kanha-reach-card-item air">
                <div className="kanha-reach-card-top">
                  <div className="kanha-reach-icon-badge air">
                    <Plane size={20} />
                  </div>
                  <span className="kanha-reach-pill air">BY AIR</span>
                </div>

                <div className="kanha-reach-card-main">
                  <h3 className="kanha-reach-title">Jabalpur, Raipur &amp; Nagpur</h3>
                  <p className="kanha-reach-desc">
                    Jabalpur Airport (Dumna - JLR) is the closest hub (~160–177 km). Raipur (RPR - ~210 km) and Nagpur (NAG - ~260 km) offer excellent connectivity for Mukki gate.
                  </p>
                </div>

                <div className="kanha-reach-meta-box">
                  <div className="kanha-reach-stat">
                    <span className="kanha-reach-stat-label">Jabalpur (JLR)</span>
                    <span className="kanha-reach-stat-val">~165 km (~3.5 hrs)</span>
                  </div>
                  <div className="kanha-reach-stat">
                    <span className="kanha-reach-stat-label">Raipur (RPR)</span>
                    <span className="kanha-reach-stat-val">~210 km (~4.5 hrs)</span>
                  </div>
                </div>
              </div>

              {/* By Rail */}
              <div className="kanha-reach-card-item rail">
                <div className="kanha-reach-card-top">
                  <div className="kanha-reach-icon-badge rail">
                    <Train size={20} />
                  </div>
                  <span className="kanha-reach-pill rail">BY RAIL</span>
                </div>

                <div className="kanha-reach-card-main">
                  <h3 className="kanha-reach-title">Jabalpur &amp; Gondia Junctions</h3>
                  <p className="kanha-reach-desc">
                    Jabalpur Junction (160–215 km) connects superfast trains nationwide. Gondia Junction (120–145 km) is closest for arrivals from Mumbai and Nagpur.
                  </p>
                </div>

                <div className="kanha-reach-meta-box">
                  <div className="kanha-reach-stat">
                    <span className="kanha-reach-stat-label">Jabalpur Jn (JBP)</span>
                    <span className="kanha-reach-stat-val">~165 km (~4 hrs)</span>
                  </div>
                  <div className="kanha-reach-stat">
                    <span className="kanha-reach-stat-label">Gondia Jn (G)</span>
                    <span className="kanha-reach-stat-val">~130 km (~3 hrs)</span>
                  </div>
                </div>
              </div>

              {/* By Road */}
              <div className="kanha-reach-card-item road">
                <div className="kanha-reach-card-top">
                  <div className="kanha-reach-icon-badge road">
                    <Car size={20} />
                  </div>
                  <span className="kanha-reach-pill road">BY ROAD</span>
                </div>

                <div className="kanha-reach-card-main">
                  <h3 className="kanha-reach-title">State &amp; National Corridors</h3>
                  <p className="kanha-reach-desc">
                    Well-maintained highways connecting Kanha to central Indian wildlife circuit hubs via Mandla, Balaghat, and Baihar.
                  </p>
                </div>

                <div className="kanha-reach-cities-grid">
                  <div className="kanha-reach-city-chip">
                    <span className="city">Jabalpur</span>
                    <span className="dist">165 km</span>
                  </div>
                  <div className="kanha-reach-city-chip">
                    <span className="city">Raipur</span>
                    <span className="dist">210 km</span>
                  </div>
                  <div className="kanha-reach-city-chip">
                    <span className="city">Pench Corridor</span>
                    <span className="dist">180 km</span>
                  </div>
                  <div className="kanha-reach-city-chip">
                    <span className="city">Nagpur</span>
                    <span className="dist">260 km</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 5: FAQS ================= */}
          <section id="faqs" className="kanha-card kanha-faqs-card">
            <div className="kanha-card-header">
              <span className="kanha-card-eyebrow">COMMON QUERIES</span>
              <h2 className="kanha-card-title">Frequently Asked Questions</h2>
              <p className="kanha-card-subtitle">
                Essential MPOnline booking guidance, permit timelines, and safari rules for Kanha.
              </p>
            </div>

            <div className="kanha-faqs-list">
              {KANHA_FAQS.map((faq, index) => (
                <div
                  key={index}
                  className={`kanha-faq-item ${openFaqIndex === index ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    className="kanha-faq-question-btn"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`kanha-faq-chevron ${openFaqIndex === index ? 'rotate' : ''}`}
                      size={18}
                    />
                  </button>

                  {openFaqIndex === index && (
                    <div className="kanha-faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ================= SECTION 6: FINAL LUXURY CTA ================= */}
          <section className="kanha-final-cta-card">
            <div className="kanha-final-cta-content">
              <h2 className="kanha-final-cta-title">
                Ready for an Unforgettable Kanha Safari?
              </h2>
              <p className="kanha-final-cta-desc">
                Let our dedicated safari specialists curate your MPOnline permits, handpicked jungle lodge stays, and naturalist-guided jeep drives across Kanha's prime zones.
              </p>

              <div className="kanha-final-cta-actions">
                <Link
                  to={`/trip-request/new?destination=${destination.id}`}
                  className="kanha-final-cta-btn"
                >
                  <span>Request a Custom Proposal</span>
                  <ArrowUpRight size={18} />
                </Link>
              </div>

              <div className="kanha-final-cta-trust">
                <span><CheckCircle2 size={16} /> Guaranteed Forest Permits</span>
                <span><CheckCircle2 size={16} /> Handpicked Jungle Lodges</span>
                <span><CheckCircle2 size={16} /> Certified Naturalists</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default KanhaInformation;
