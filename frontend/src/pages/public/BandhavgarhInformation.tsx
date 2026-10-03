/* ==========================================================
   Bandhavgarh Tiger Reserve Comprehensive Information Page
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
  Search,
  Shield
} from 'lucide-react';

import { Destination } from '../../services/destination.service';
import { Resort } from '../../services/resort.service';

// Scoped Page Stylesheet
import '../../styles/public/BandhavgarhInformation.css';

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

interface BandhavgarhDetailsProps {
  destination: Destination;
  resorts?: Resort[];
  safariGates?: SafariGate[];
}

const BANDHAVGARH_HERO_IMAGE = 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1600&q=80';

const BANDHAVGARH_MASTER_GATES: SafariGate[] = [
  // Core Gates
  {
    id: 'core-tala',
    name: 'Tala Zone Gate',
    type: 'Core',
    district: 'Tala Village, Umaria District, MP',
    description: 'The most famous and historic zone of Bandhavgarh. It is the primary tourist hub, offering incredible views of the 2,000-year-old fort, lush meadows, and historically the highest tiger sightings.',
    highlights: 'Highest tiger sighting chances, Bandhavgarh Fort views, 10th-century Shesh Shaiya Vishnu statue, Chakradhara meadow',
    quota: 'Up to 28 morning / 27 evening vehicles (Wed afternoon closed)',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Tala+Gate+Bandhavgarh+National+Park'
  },
  {
    id: 'core-magdhi',
    name: 'Magdhi Zone Gate',
    type: 'Core',
    district: 'Magdhi Range, Umaria District, MP',
    description: 'A beautiful zone with rolling grasslands, bamboo forests, natural caves, and waterholes. Highly popular for frequent tiger and leopard sightings in open landscapes.',
    highlights: 'Charger Point, Sukhi Patiha waterhole, scenic open meadows, excellent tiger & leopard tracking',
    quota: 'Up to 26 morning / 25 evening vehicles (Wed afternoon closed)',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Magdhi+Gate+Bandhavgarh+National+Park'
  },
  {
    id: 'core-khitauli',
    name: 'Khitauli Zone Gate',
    type: 'Core',
    district: 'Khitauli Range, Umaria District, MP',
    description: 'Known for scenic sandstone hills, bamboo thickets, and deep dry forests. It is the top zone to spot wild elephant herds, sloth bears, blue bulls (nilgai), and tigers.',
    highlights: 'Wild elephant herds (recolonised in 2018), sloth bears, blue bulls (nilgai), dhole packs & scenic hill tracks',
    quota: 'Up to 21 morning / 20 evening vehicles (Wed afternoon closed)',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Khitauli+Gate+Bandhavgarh+National+Park'
  },
  // Buffer Gates
  {
    id: 'buf-dhamokhar',
    name: 'Dhamokhar Buffer Gate',
    type: 'Buffer',
    district: 'Parasi Village, Umaria District, MP',
    description: 'A peaceful buffer forest near Parasi village. Perfect for uncrowded drives, night safaris, village culture, and steady tiger and leopard movements.',
    highlights: 'Easily accessible via Parasi gate, tranquil sal forest drives, active leopard and tiger territory',
    quota: 'Up to 20 vehicles per shift (Wed afternoon closed)',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Dhamokhar+Buffer+Gate+Bandhavgarh'
  },
  {
    id: 'buf-johila',
    name: 'Johila Buffer Gate',
    type: 'Buffer',
    district: 'Cechpur / Gajwahi, Umaria District, MP',
    description: 'Stretches along the beautiful Johila River with rocky gorges, flowing streams, and lush greenery. A paradise for birdwatchers and nature photographers.',
    highlights: 'Johila river stream, excellent birdwatching, rocky gorges, peaceful offbeat wildlife drives',
    quota: 'Up to 20 vehicles per shift (Wed afternoon closed)',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Johila+Buffer+Gate+Bandhavgarh'
  },
  {
    id: 'buf-panpatha',
    name: 'Panpatha Buffer Gate',
    type: 'Buffer',
    district: 'Pachpedi, Umaria / Katni Border, MP',
    description: 'Located on the northern edge of the park near Katni. Features open woodlands and vital wildlife corridors where Indian gaur, sambar, and tigers freely roam.',
    highlights: 'Connected to Katni route, open woodland drives, Indian gaur (bison), sambar & tiger corridors',
    quota: 'Up to 20 vehicles per shift (Wed afternoon closed)',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Panpatha+Buffer+Gate+Bandhavgarh'
  }
];

const BANDHAVGARH_HISTORICAL_MILESTONES = [
  {
    year: '1968',
    stepNumber: '01',
    shortLabel: 'National Park',
    title: 'Declared a National Park',
    description: 'Maharaja Martand Singh of Rewa took the initiative to protect 105 sq km around Tala village, creating Bandhavgarh National Park to preserve its rich forests and Royal Bengal Tigers.',
    badge: 'National Park Formed'
  },
  {
    year: '1982',
    stepNumber: '02',
    shortLabel: 'Park Extension',
    title: 'Park Size Quadrupled',
    description: 'The reserve expanded fourfold by adding the Magdhi, Khitauli, and Kallawah forest ranges, creating a vast 448 sq km sanctuary for growing wildlife populations.',
    badge: 'Range Expansion'
  },
  {
    year: '1983',
    stepNumber: '03',
    shortLabel: 'Panpatha Sanctuary',
    title: 'Panpatha Sanctuary Added',
    description: 'A dedicated 245 sq km wildlife sanctuary at Panpatha was established next to Bandhavgarh, protecting vital natural migration corridors for predators and herbivores.',
    badge: 'Corridor Protection'
  },
  {
    year: '1993',
    stepNumber: '04',
    shortLabel: 'Project Tiger',
    title: 'Inducted into Project Tiger',
    description: 'Bandhavgarh officially joined India’s elite Project Tiger network, merging Panpatha Sanctuary into the core zone to give tigers national-level protection and monitoring.',
    badge: 'Project Tiger Reserve'
  },
  {
    year: '2007',
    stepNumber: '05',
    shortLabel: 'Critical Habitat',
    title: 'Critical Tiger Habitat Notified',
    description: 'Formally designated as a Critical Tiger Habitat with a 716 sq km core and an 820 sq km buffer (1,536 sq km total), making it one of the most protected wildlife havens in Asia.',
    badge: 'Apex Conservation Status'
  }
];

const BANDHAVGARH_SAFARI_TIMETABLE = [
  { season: 'October', slot: 'Morning', entryTime: '06:00 AM', exitTime: '11:30 AM' },
  { season: 'October', slot: 'Afternoon', entryTime: '15:00 PM', exitTime: '18:00 PM' },
  { season: 'November', slot: 'Morning', entryTime: '06:15 AM', exitTime: '11:30 AM' },
  { season: 'November', slot: 'Afternoon', entryTime: '15:00 PM', exitTime: '17:45 PM' },
  { season: 'December', slot: 'Morning', entryTime: '06:30 AM', exitTime: '11:30 AM' },
  { season: 'December', slot: 'Afternoon', entryTime: '15:00 PM', exitTime: '17:30 PM' },
  { season: 'January', slot: 'Morning', entryTime: '06:30 AM', exitTime: '11:30 AM' },
  { season: 'January', slot: 'Afternoon', entryTime: '15:00 PM', exitTime: '17:30 PM' },
  { season: 'February', slot: 'Morning', entryTime: '06:30 AM', exitTime: '11:30 AM' },
  { season: 'February', slot: 'Afternoon', entryTime: '15:00 PM', exitTime: '18:00 PM' },
  { season: 'March', slot: 'Morning', entryTime: '06:15 AM', exitTime: '11:30 AM' },
  { season: 'March', slot: 'Afternoon', entryTime: '15:00 PM', exitTime: '18:15 PM' },
  { season: 'April', slot: 'Morning', entryTime: '05:30 AM', exitTime: '11:00 AM' },
  { season: 'April', slot: 'Afternoon', entryTime: '16:00 PM', exitTime: '18:45 PM' },
  { season: 'May', slot: 'Morning', entryTime: '05:30 AM', exitTime: '10:30 AM' },
  { season: 'May', slot: 'Afternoon', entryTime: '16:00 PM', exitTime: '19:00 PM' },
  { season: 'June', slot: 'Morning', entryTime: '05:30 AM', exitTime: '10:00 AM' },
  { season: 'June', slot: 'Afternoon', entryTime: '16:00 PM', exitTime: '19:00 PM' }
];

const BANDHAVGARH_FAQS = [
  {
    question: '1. What is the best time to visit Bandhavgarh for tiger sightings?',
    answer:
      'Bandhavgarh is open for safaris from 15 October to 30 June each year. For pleasant weather and green landscapes, November to February is ideal. For the highest chances of spotting tigers, March to May (summer) is the best time, as animals frequently visit waterholes and vegetation is thinner. The park core zones remain closed during monsoon from 1 July to 14 October.'
  },
  {
    question: '2. How do I book a Bandhavgarh safari permit?',
    answer:
      'Safari permits are booked online through the official Madhya Pradesh Forest Department portal (forest.mponline.gov.in). Because Bandhavgarh is one of India’s most popular tiger reserves, permits for popular zones like Tala and Magdhi sell out weeks in advance. We recommend booking your safari permits at least 60 to 90 days before your travel date.'
  },
  {
    question: '3. How many safaris can I do in a day, and how long are they?',
    answer:
      'You can take up to two safaris per day — one Morning shift (approx. 4.5 to 5 hours, starting around sunrise) and one Afternoon shift (approx. 3 to 3.5 hours, finishing at sunset). Note that all safari zones are closed on Wednesday afternoons for park rest and maintenance.'
  },
  {
    question: '4. Which safari zone should I choose — Tala, Magdhi, or Khitauli?',
    answer:
      'All three core zones offer great wildlife experiences! Tala is legendary for historic monuments (Bandhavgarh Fort, Shesh Shaiya) and high tiger activity. Magdhi has open meadows and waterholes with outstanding predator tracking. Khitauli features scenic hills, bamboo forests, wild elephant herds, and sloth bears. Buffer zones (Dhamokhar, Johila, Panpatha) offer peaceful, budget-friendly safaris and night drives.'
  },
  {
    question: '5. What identity documents and essentials should I carry on safari?',
    answer:
      'You must carry the original Government Photo ID (Passport for foreign tourists, Aadhaar/Voter ID/Driving License for Indian citizens) that matches the name on your booking permit. Wear earthy, neutral-colored clothing (khaki, olive green, brown). In winter (Nov–Feb), bring warm layers and a windcheater for chilly morning drives; in summer (Mar–Jun), pack sunblock, sunglasses, and a wide-brim hat.'
  }
];

const BandhavgarhInformation = ({
  destination,
  resorts: _resorts,
  safariGates = BANDHAVGARH_MASTER_GATES
}: BandhavgarhDetailsProps) => {
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
    ? BANDHAVGARH_SAFARI_TIMETABLE
    : BANDHAVGARH_SAFARI_TIMETABLE.filter((t) => t.slot === timingSlotFilter);

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
    <div className="bandhavgarh-page">
      {/* ================= 1. COMPACT LUXURY HERO SECTION ================= */}
      <section className="bandhavgarh-hero">
        <img
          src={destination.coverImage || (destination.images && destination.images[0]) || BANDHAVGARH_HERO_IMAGE}
          alt={destination.name || 'Bandhavgarh scenic background'}
          className="bandhavgarh-hero-img"
        />

        <div className="bandhavgarh-hero-overlay" />

        <div className="bandhavgarh-hero-content">
          <div className="bandhavgarh-hero-wrapper">
            <div className="bandhavgarh-hero-eyebrow">
              <span className="bandhavgarh-hero-sublocation">UMARIA &amp; KATNI, MADHYA PRADESH</span>
            </div>

            <h1 className="bandhavgarh-hero-title">
              {destination.name || 'Bandhavgarh Tiger Reserve'}
            </h1>

            <p className="bandhavgarh-hero-subtitle">
              The Tiger Capital of India — world-famous for having one of the highest chances to see wild Royal Bengal Tigers. Explore lush bamboo forests, ancient 2,000-year-old fort ruins, and open grasslands where tigers, leopards, and wild elephants roam freely.
            </p>

            <div className="bandhavgarh-hero-actions">
              <Link
                to={`/trip-request/new?destination=${destination.id}`}
                className="bandhavgarh-hero-cta"
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
                className="bandhavgarh-hero-secondary"
              >
                <span>Explore Safari Gates</span>
                <Compass size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. FLOATING HORIZONTAL SECTION NAV ================= */}
      <div className="bandhavgarh-nav-wrapper">
        <nav className="bandhavgarh-sticky-nav" aria-label="Reserve Sections Navigation">
          <div className="bandhavgarh-sticky-nav-inner">
            <div className="bandhavgarh-sticky-nav-links">
              <button
                type="button"
                onClick={(e) => scrollToSection('about', e)}
                className={`bandhavgarh-sticky-nav-link ${activeSection === 'about' ? 'active' : ''}`}
              >
                <TreePine size={16} />
                <span>Overview &amp; Habitat</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('history', e)}
                className={`bandhavgarh-sticky-nav-link ${activeSection === 'history' ? 'active' : ''}`}
              >
                <History size={16} />
                <span>Milestones</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('safari-hub', e)}
                className={`bandhavgarh-sticky-nav-link ${activeSection === 'safari-hub' ? 'active' : ''}`}
              >
                <Compass size={16} />
                <span>Safari Planning Hub</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('how-to-reach', e)}
                className={`bandhavgarh-sticky-nav-link ${activeSection === 'how-to-reach' ? 'active' : ''}`}
              >
                <MapPin size={16} />
                <span>How to Reach</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('faqs', e)}
                className={`bandhavgarh-sticky-nav-link ${activeSection === 'faqs' ? 'active' : ''}`}
              >
                <HelpCircle size={16} />
                <span>FAQs</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* ================= 3. FULL-WIDTH LUXURY CONTAINER ================= */}
      <div className="bandhavgarh-container">
        <main className="bandhavgarh-main">
          {/* ================= SECTION 1: ABOUT & HABITAT ================= */}
          <section id="about" className="bandhavgarh-card bandhavgarh-about-card">
            <div className="bandhavgarh-card-header">
              <span className="bandhavgarh-card-eyebrow">ABOUT BANDHAVGARH</span>
              <h2 className="bandhavgarh-card-title">The Tiger Capital &amp; Ancient Fort Ruins</h2>
            </div>

            <div className="bandhavgarh-about-body">
              <p>
                Located in the Vindhya hills of Madhya Pradesh, <strong>Bandhavgarh Tiger Reserve</strong> is one of the world's best places to witness Royal Bengal Tigers in their natural wild habitat. Centered around a towering cliff crowned by the ancient <strong>Bandhavgarh Fort</strong>, the park features a stunning mix of sal tree forests, green bamboo valleys, natural caves, and open grassy meadows (called <em>bahs</em>).
              </p>
              <p>
                Bandhavgarh is home to an estimated <strong>135+ tigers</strong>, giving visitors remarkably high sighting opportunities. The park also protects leopards, sloth bears, Indian gaur (bison), spotted deer, wild boars, sambar, and a resident herd of wild elephants that migrated here in 2018 — making wildlife safaris thrilling and diverse.
              </p>
            </div>

            {/* Metric Stats Cards */}
            <div className="bandhavgarh-stats-grid">
              <div className="bandhavgarh-stat-card">
                <span className="bandhavgarh-stat-value">1,536.94</span>
                <span className="bandhavgarh-stat-unit">SQ KM</span>
                <span className="bandhavgarh-stat-label">TOTAL PROTECTED AREA</span>
              </div>

              <div className="bandhavgarh-stat-card">
                <span className="bandhavgarh-stat-value">716.90</span>
                <span className="bandhavgarh-stat-unit">SQ KM</span>
                <span className="bandhavgarh-stat-label">CRITICAL CORE HABITAT</span>
              </div>

              <div className="bandhavgarh-stat-card">
                <span className="bandhavgarh-stat-value">820.04</span>
                <span className="bandhavgarh-stat-unit">SQ KM</span>
                <span className="bandhavgarh-stat-label">BUFFER CORRIDOR ZONE</span>
              </div>

              <div className="bandhavgarh-stat-card">
                <span className="bandhavgarh-stat-value">~135</span>
                <span className="bandhavgarh-stat-unit">TIGERS</span>
                <span className="bandhavgarh-stat-label">2022 CENSUS POPULATION</span>
              </div>
            </div>

            {/* Story / Legend of Bandhavgarh */}
            <div className="bandhavgarh-story-card">
              <div className="bandhavgarh-story-badge">
                <Shield size={16} />
                <span>EPIC LEGEND &amp; ROYAL HISTORY</span>
              </div>
              <h3 className="bandhavgarh-story-title">The Legend of the "Brother's Fort" (Bandhav-Garh)</h3>
              <p className="bandhavgarh-story-text">
                According to ancient Indian epics, Lord Rama gifted the hilltop fort to his loyal brother Lakshmana to keep watch over Lanka — giving it the name <strong>Bandhavgarh</strong> (<em>Bandhav</em> means brother, and <em>Garh</em> means fort). Inscriptions on rock shelters date back nearly 2,000 years to 300 AD. For centuries, the Maharajas of Rewa preserved these dense jungles as their private royal game preserve, which helped protect this pristine forest until it became a National Park in 1968.
              </p>
            </div>
          </section>

          {/* ================= SECTION 2: HISTORICAL MILESTONES ================= */}
          <section id="history" className="bandhavgarh-card bandhavgarh-history-card">
            <div className="bandhavgarh-card-header">
              <span className="bandhavgarh-card-eyebrow">CHRONICLES OF CONSERVATION</span>
              <h2 className="bandhavgarh-card-title">Historical Milestones</h2>
              <p className="bandhavgarh-card-subtitle">
                From princely royal reserve to India's premier high-density tiger haven — explore Bandhavgarh's conservation timeline.
              </p>
            </div>

            {/* Interactive Horizontal Year Track */}
            <div className="bandhavgarh-milestone-track-container">
              <div className="bandhavgarh-milestone-track-line" />
              <div className="bandhavgarh-milestone-nodes">
                {BANDHAVGARH_HISTORICAL_MILESTONES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveMilestoneIndex(idx)}
                    onMouseEnter={() => setActiveMilestoneIndex(idx)}
                    className={`bandhavgarh-milestone-node ${activeMilestoneIndex === idx ? 'active' : ''}`}
                    aria-label={`Milestone year ${item.year}: ${item.title}`}
                  >
                    <span className="bandhavgarh-milestone-node-dot" />
                    <span className="bandhavgarh-milestone-node-year">{item.year}</span>
                    <span className="bandhavgarh-milestone-node-label">{item.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Milestone Detail Card */}
            <div className="bandhavgarh-milestone-detail-card">
              <div className="bandhavgarh-milestone-detail-watermark">
                {BANDHAVGARH_HISTORICAL_MILESTONES[activeMilestoneIndex].year}
              </div>

              <div className="bandhavgarh-milestone-detail-inner">
                <div className="bandhavgarh-milestone-detail-top-badge">
                  <span className="bandhavgarh-milestone-badge-pill">
                    <span className="bandhavgarh-milestone-badge-dot" />
                    {BANDHAVGARH_HISTORICAL_MILESTONES[activeMilestoneIndex].badge}
                  </span>
                </div>

                <div className="bandhavgarh-milestone-detail-body">
                  <div className="bandhavgarh-milestone-detail-lead">
                    <span className="bandhavgarh-milestone-detail-year-highlight">
                      {BANDHAVGARH_HISTORICAL_MILESTONES[activeMilestoneIndex].year}
                    </span>
                    <h3 className="bandhavgarh-milestone-detail-title">
                      {BANDHAVGARH_HISTORICAL_MILESTONES[activeMilestoneIndex].title}
                    </h3>
                  </div>
                  <p className="bandhavgarh-milestone-detail-desc">
                    {BANDHAVGARH_HISTORICAL_MILESTONES[activeMilestoneIndex].description}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 3: SAFARI PLANNING HUB ================= */}
          <section id="safari-hub" className="bandhavgarh-card bandhavgarh-safari-hub-card">
            <div className="bandhavgarh-card-header">
              <span className="bandhavgarh-card-eyebrow">SAFARI PLANNING &amp; GATES DIRECTORY</span>
              <h2 className="bandhavgarh-card-title">Bandhavgarh Safari Planning Hub</h2>
              <p className="bandhavgarh-card-subtitle">
                Official guide to 4x4 Gypsy capacities, seasonal entry/exit shift schedules, and core vs. buffer gate directories.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="bandhavgarh-hub-tabs">
              <button
                type="button"
                className={`bandhavgarh-hub-tab ${activeTab === 'vehicles' ? 'active' : ''}`}
                onClick={() => setActiveTab('vehicles')}
              >
                <Car size={16} />
                <span>Vehicles &amp; Capacities</span>
              </button>

              <button
                type="button"
                className={`bandhavgarh-hub-tab ${activeTab === 'timings' ? 'active' : ''}`}
                onClick={() => setActiveTab('timings')}
              >
                <Clock size={16} />
                <span>Shift Timings &amp; Rules</span>
              </button>

              <button
                type="button"
                className={`bandhavgarh-hub-tab ${activeTab === 'gates' ? 'active' : ''}`}
                onClick={() => setActiveTab('gates')}
              >
                <MapPin size={16} />
                <span>Gates Directory ({safariGates.length})</span>
              </button>
            </div>

            {/* Tab 1: Vehicles & Capacities */}
            {activeTab === 'vehicles' && (
              <div className="bandhavgarh-tab-pane">
                <div className="bandhavgarh-vehicles-grid">
                  <div className="bandhavgarh-vehicle-card">
                    <div className="bandhavgarh-vehicle-header">
                      <div className="bandhavgarh-vehicle-icon-wrap">
                        <Car size={24} />
                      </div>
                      <div>
                        <span className="bandhavgarh-vehicle-tag">OPEN 4X4 GYPSY</span>
                        <h3 className="bandhavgarh-vehicle-title">Maruti 4x4 Gypsy Safari</h3>
                      </div>
                    </div>
                    <p className="bandhavgarh-vehicle-desc">
                      The classic open-top safari vehicle designed for incredible 360-degree jungle views, photography, and smooth navigation over rugged tracks.
                    </p>
                    <ul className="bandhavgarh-vehicle-features">
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Available Zones:</strong> 3 Core Zones (Tala, Magdhi, Khitauli) &amp; 3 Buffer Zones</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Capacity:</strong> Up to 6 tourists + 1 registered forest guide + 1 driver</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Daily Shifts:</strong> Morning (sunrise) &amp; Afternoon (until sunset)</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Booking Options:</strong> Book a private Full Vehicle or individual Single Seats</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bandhavgarh-vehicle-card">
                    <div className="bandhavgarh-vehicle-header">
                      <div className="bandhavgarh-vehicle-icon-wrap">
                        <Layers size={24} />
                      </div>
                      <div>
                        <span className="bandhavgarh-vehicle-tag">ZONE PERMIT LIMITS</span>
                        <h3 className="bandhavgarh-vehicle-title">Daily Vehicle Limits</h3>
                      </div>
                    </div>
                    <p className="bandhavgarh-vehicle-desc">
                      To protect wildlife habitats and prevent overcrowding, the Forest Department sets fixed vehicle quotas per shift:
                    </p>
                    <ul className="bandhavgarh-vehicle-features">
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Tala Core Zone:</strong> Max 28 Morning / 27 Evening vehicles</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Magdhi Core Zone:</strong> Max 26 Morning / 25 Evening vehicles</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Khitauli Core Zone:</strong> Max 21 Morning / 20 Evening vehicles</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Buffer Zones:</strong> Dhamokhar, Johila &amp; Panpatha (20 vehicles per shift)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Timings & Rules */}
            {activeTab === 'timings' && (
              <div className="bandhavgarh-tab-pane">
                <div className="bandhavgarh-timings-filter-bar">
                  <div className="bandhavgarh-timings-filter-buttons">
                    {(['All', 'Morning', 'Afternoon'] as const).map((slot) => {
                      const count = slot === 'All'
                        ? BANDHAVGARH_SAFARI_TIMETABLE.length
                        : BANDHAVGARH_SAFARI_TIMETABLE.filter((t) => t.slot === slot).length;
                      return (
                        <button
                          key={slot}
                          type="button"
                          className={`bandhavgarh-timing-filter-btn ${timingSlotFilter === slot ? 'active' : ''}`}
                          onClick={() => setTimingSlotFilter(slot)}
                        >
                          {slot === 'All' ? 'All Slots' : `${slot} Slot`} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bandhavgarh-timings-table-wrapper compact">
                  <table className="bandhavgarh-timings-table compact">
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
                          <td className="bandhavgarh-timing-season"><strong>{row.season}</strong></td>
                          <td className="bandhavgarh-timing-slot">{row.slot}</td>
                          <td className="bandhavgarh-timing-time">{row.entryTime}</td>
                          <td className="bandhavgarh-timing-time">{row.exitTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Closure Warnings */}
                <div className="bandhavgarh-closure-box compact">
                  <div className="bandhavgarh-closure-item">
                    <AlertTriangle className="bandhavgarh-closure-icon" size={16} />
                    <div>
                      <strong>Wednesday Afternoon Rest:</strong> All core and buffer zones are closed on Wednesday afternoons to allow forest rest and maintenance. Morning safaris operate normally.
                    </div>
                  </div>
                  <div className="bandhavgarh-closure-item">
                    <AlertTriangle className="bandhavgarh-closure-icon" size={16} />
                    <div>
                      <strong>Annual Monsoon Closure:</strong> Core safari zones are closed during the rainy season from 1 July to 14 October, reopening every year on 15 October.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Gates Directory */}
            {activeTab === 'gates' && (
              <div className="bandhavgarh-tab-pane">
                <div className="bandhavgarh-gates-filter-bar">
                  <div className="bandhavgarh-gates-filter-buttons">
                    <button
                      type="button"
                      className={`bandhavgarh-gate-filter-btn ${gateFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setGateFilter('all')}
                    >
                      All Safari Gates ({safariGates.length})
                    </button>
                    <button
                      type="button"
                      className={`bandhavgarh-gate-filter-btn ${gateFilter === 'Core' ? 'active' : ''}`}
                      onClick={() => setGateFilter('Core')}
                    >
                      Core Gates ({coreGatesCount})
                    </button>
                    <button
                      type="button"
                      className={`bandhavgarh-gate-filter-btn ${gateFilter === 'Buffer' ? 'active' : ''}`}
                      onClick={() => setGateFilter('Buffer')}
                    >
                      Buffer Gates ({bufferGatesCount})
                    </button>
                  </div>

                  <div className="bandhavgarh-gates-search-box">
                    <Search size={15} className="bandhavgarh-gates-search-icon" />
                    <input
                      type="text"
                      value={gateSearchQuery}
                      onChange={(e) => setGateSearchQuery(e.target.value)}
                      placeholder="Search gate name..."
                      className="bandhavgarh-gates-search-input"
                    />
                  </div>
                </div>

                <div className="bandhavgarh-gates-compact-grid">
                  {filteredGates.map((gate) => (
                    <div key={gate.id} className={`bandhavgarh-gate-compact-card ${gate.type.toLowerCase()}`}>
                      <div className="bandhavgarh-gate-compact-main">
                        <span className={`bandhavgarh-gate-type-badge ${gate.type.toLowerCase()}`}>
                          {gate.type} Gate
                        </span>
                        <h4 className="bandhavgarh-gate-compact-name">{gate.name}</h4>
                      </div>

                      {gate.mapLink && (
                        <a
                          href={gate.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bandhavgarh-gate-compact-map-btn"
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
                  <div className="bandhavgarh-gates-empty-state">
                    <p>No safari gates found matching "{gateSearchQuery}".</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ================= SECTION 4: HOW TO REACH ================= */}
          <section id="how-to-reach" className="bandhavgarh-card bandhavgarh-reach-card">
            <div className="bandhavgarh-card-header">
              <span className="bandhavgarh-card-eyebrow">TRAVEL &amp; CONNECTIVITY</span>
              <h2 className="bandhavgarh-card-title">How to Reach Bandhavgarh</h2>
              <p className="bandhavgarh-card-subtitle">
                Centrally positioned in northern Madhya Pradesh with convenient railheads at Umaria and Katni, and regional airports at Jabalpur and Khajuraho.
              </p>
            </div>

            <div className="bandhavgarh-reach-grid">
              {/* By Air */}
              <div className="bandhavgarh-reach-card-item air">
                <div className="bandhavgarh-reach-card-top">
                  <div className="bandhavgarh-reach-icon-badge air">
                    <Plane size={20} />
                  </div>
                  <span className="bandhavgarh-reach-pill air">BY AIR</span>
                </div>

                <div className="bandhavgarh-reach-card-main">
                  <h3 className="bandhavgarh-reach-title">Jabalpur &amp; Khajuraho</h3>
                  <p className="bandhavgarh-reach-desc">
                    Jabalpur Airport (JLR - ~170 km) is the primary flight gateway with daily connections to Delhi and Mumbai. Khajuraho Airport (HJR - ~226 km) serves northern tourists.
                  </p>
                </div>

                <div className="bandhavgarh-reach-meta-box">
                  <div className="bandhavgarh-reach-stat">
                    <span className="bandhavgarh-reach-stat-label">Jabalpur (JLR)</span>
                    <span className="bandhavgarh-reach-stat-val">~170 km (~3.5 hrs)</span>
                  </div>
                  <div className="bandhavgarh-reach-stat">
                    <span className="bandhavgarh-reach-stat-label">Khajuraho (HJR)</span>
                    <span className="bandhavgarh-reach-stat-val">~226 km (~5 hrs)</span>
                  </div>
                </div>
              </div>

              {/* By Rail */}
              <div className="bandhavgarh-reach-card-item rail">
                <div className="bandhavgarh-reach-card-top">
                  <div className="bandhavgarh-reach-icon-badge rail">
                    <Train size={20} />
                  </div>
                  <span className="bandhavgarh-reach-pill rail">BY RAIL</span>
                </div>

                <div className="bandhavgarh-reach-card-main">
                  <h3 className="bandhavgarh-reach-title">Umaria &amp; Katni Junctions</h3>
                  <p className="bandhavgarh-reach-desc">
                    Umaria (UMR - 32 km) is the closest railway station on Katni-Bilaspur line (~45 min taxi drive to Tala). Katni Jn (KTE - 97 km) connects major trunk lines nationwide.
                  </p>
                </div>

                <div className="bandhavgarh-reach-meta-box">
                  <div className="bandhavgarh-reach-stat">
                    <span className="bandhavgarh-reach-stat-label">Umaria Station (UMR)</span>
                    <span className="bandhavgarh-reach-stat-val">~32 km (~45 mins)</span>
                  </div>
                  <div className="bandhavgarh-reach-stat">
                    <span className="bandhavgarh-reach-stat-label">Katni Junction (KTE)</span>
                    <span className="bandhavgarh-reach-stat-val">~97 km (~2.5 hrs)</span>
                  </div>
                </div>
              </div>

              {/* By Road */}
              <div className="bandhavgarh-reach-card-item road">
                <div className="bandhavgarh-reach-card-top">
                  <div className="bandhavgarh-reach-icon-badge road">
                    <Car size={20} />
                  </div>
                  <span className="bandhavgarh-reach-pill road">BY ROAD</span>
                </div>

                <div className="bandhavgarh-reach-card-main">
                  <h3 className="bandhavgarh-reach-title">State Highways to Tala Village</h3>
                  <p className="bandhavgarh-reach-desc">
                    Direct access via Satna–Umaria and Rewa–Umaria state highways leading directly to Tala village hub.
                  </p>
                </div>

                <div className="bandhavgarh-reach-cities-grid">
                  <div className="bandhavgarh-reach-city-chip">
                    <span className="city">Umaria</span>
                    <span className="dist">32 km</span>
                  </div>
                  <div className="bandhavgarh-reach-city-chip">
                    <span className="city">Katni</span>
                    <span className="dist">97 km</span>
                  </div>
                  <div className="bandhavgarh-reach-city-chip">
                    <span className="city">Rewa</span>
                    <span className="dist">115 km</span>
                  </div>
                  <div className="bandhavgarh-reach-city-chip">
                    <span className="city">Satna</span>
                    <span className="dist">117 km</span>
                  </div>
                  <div className="bandhavgarh-reach-city-chip">
                    <span className="city">Jabalpur</span>
                    <span className="dist">170 km</span>
                  </div>
                  <div className="bandhavgarh-reach-city-chip">
                    <span className="city">Khajuraho</span>
                    <span className="dist">226 km</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 5: FAQS ================= */}
          <section id="faqs" className="bandhavgarh-card bandhavgarh-faqs-card">
            <div className="bandhavgarh-card-header">
              <span className="bandhavgarh-card-eyebrow">COMMON QUERIES</span>
              <h2 className="bandhavgarh-card-title">Frequently Asked Questions</h2>
              <p className="bandhavgarh-card-subtitle">
                Essential booking recommendations, zone comparisons, and safari preparation tips.
              </p>
            </div>

            <div className="bandhavgarh-faqs-list">
              {BANDHAVGARH_FAQS.map((faq, index) => (
                <div
                  key={index}
                  className={`bandhavgarh-faq-item ${openFaqIndex === index ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    className="bandhavgarh-faq-question-btn"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`bandhavgarh-faq-chevron ${openFaqIndex === index ? 'rotate' : ''}`}
                      size={18}
                    />
                  </button>

                  {openFaqIndex === index && (
                    <div className="bandhavgarh-faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ================= SECTION 6: FINAL LUXURY CTA ================= */}
          <section className="bandhavgarh-final-cta-card">
            <div className="bandhavgarh-final-cta-content">
              <h2 className="bandhavgarh-final-cta-title">
                Ready for the Kingdom of Tigers?
              </h2>
              <p className="bandhavgarh-final-cta-desc">
                Experience the highest tiger density in India. Let our certified wildlife team arrange your MPOnline Tala permits, luxury lodge stays, and private 4x4 Gypsy safaris.
              </p>

              <div className="bandhavgarh-final-cta-actions">
                <Link
                  to={`/trip-request/new?destination=${destination.id}`}
                  className="bandhavgarh-final-cta-btn"
                >
                  <span>Request a Custom Proposal</span>
                  <ArrowUpRight size={18} />
                </Link>
              </div>

              <div className="bandhavgarh-final-cta-trust">
                <span><CheckCircle2 size={16} /> Official MPOnline Permits</span>
                <span><CheckCircle2 size={16} /> Curated Luxury Lodges</span>
                <span><CheckCircle2 size={16} /> Expert Tiger Trackers</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default BandhavgarhInformation;
