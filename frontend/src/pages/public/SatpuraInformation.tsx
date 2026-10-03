/* ==========================================================
   Satpura Tiger Reserve Comprehensive Information Page
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
  Calendar,
  Plane,
  Train,
  TreePine,
  HelpCircle,
  Search,
  Footprints,
  Ship,
  Moon
} from 'lucide-react';

import { Destination } from '../../services/destination.service';
import { Resort } from '../../services/resort.service';

// Scoped Page Stylesheet
import '../../styles/public/SatpuraInformation.css';

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

interface SatpuraDetailsProps {
  destination: Destination;
  resorts?: Resort[];
  safariGates?: SafariGate[];
}

const SATPURA_HERO_IMAGE = 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=80';

const SATPURA_MASTER_GATES: SafariGate[] = [
  // Core Gates
  {
    id: 'core-madhai',
    name: 'Madhai Gate',
    type: 'Core',
    district: 'Sarangpur / Sohagpur, Narmadapuram District, MP',
    description: 'The main and most popular entry point to Satpura. Visitors cross the scenic Denwa River by boat to enter the core forest for jeep safaris, walking trails, and boat rides.',
    highlights: 'Scenic river boat crossing, starting point for walking safaris, canoe trips, and Keria, Lagda & Churna jeep routes',
    quota: 'Morning & Evening Shifts (Wed afternoon closed)',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Madhai+Gate+Satpura+Tiger+Reserve'
  },
  {
    id: 'core-bheemkund',
    name: 'Bheemkund Gate (Churna Zone)',
    type: 'Core',
    district: 'Bhaura, Narmadapuram / Betul Border, MP',
    description: 'Located on the Betul/Itarsi side, this gate leads deep into the untouched core forest of Churna. Ideal for wildlife enthusiasts seeking deep-forest drives.',
    highlights: 'Deep core forest expedition, giant teak trees, vast open Churna grasslands, excellent tiger and gaur tracking',
    quota: 'Morning & Evening Shifts (Wed afternoon closed)',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Bheemkund+Gate+Churna+Satpura'
  },
  {
    id: 'core-panarpani',
    name: 'Panarpani Gate (Pachmarhi Zone)',
    type: 'Core',
    district: 'Pachmarhi Plateau, Narmadapuram District, MP',
    description: 'Located in the cool highlands of Pachmarhi hill station. Perfect for tourists who want to combine a hill-station vacation with core jungle wildlife safaris.',
    highlights: 'Panarpani butterfly nursery, mist-covered sal hills, easy access from Pachmarhi hotels & resorts',
    quota: 'Morning & Evening Shifts (Wed afternoon closed)',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Panarpani+Gate+Pachmarhi+Satpura'
  },
  {
    id: 'core-mallupura',
    name: 'Mallupura Gate',
    type: 'Core',
    district: 'Narmadapuram District, MP',
    description: 'A tranquil, less-crowded core gate offering peaceful jungle drives, riverine habitats, and rich birdwatching opportunities.',
    highlights: 'Quiet offbeat entry, untouched riverbanks, rich birdlife, and diverse flora and fauna',
    quota: 'Morning & Evening Shifts (Wed afternoon closed)',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Mallupura+Gate+Satpura+Tiger+Reserve'
  },
  // Buffer Gates
  {
    id: 'buf-burgodi',
    name: 'Burgodi Gate (Pipariya Buffer)',
    type: 'Buffer',
    district: 'Near Pipariya Town, Narmadapuram District, MP',
    description: 'Located conveniently close to Pipariya railway town. Offers lovely buffer jungle drives, night safaris, and guided walking nature walks.',
    highlights: 'Convenient from Pipariya station, exciting night safaris, walking trails, leopard and sloth bear sightings',
    quota: 'Day & Night Drives Available (Wed afternoon closed)',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Burgodi+Gate+Satpura'
  },
  {
    id: 'buf-parsapani',
    name: 'Parsapani Gate',
    type: 'Buffer',
    district: 'Madhai Buffer Sector, Narmadapuram District, MP',
    description: 'Located right next to Madhai, Parsapani is famous among photographers for popular nocturnal night safaris and frequent leopard sightings.',
    highlights: 'Top-rated night safari spot, high leopard sighting frequency, owls, civets, and nocturnal wildlife',
    quota: 'Day & Night Drives Available (Wed afternoon closed)',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Parsapani+Gate+Satpura'
  },
  {
    id: 'buf-jamani-dev',
    name: 'Jamani Dev Gate',
    type: 'Buffer',
    district: 'Denwa Buffer / West Chhindwara Border, MP',
    description: 'A serene buffer zone along the Denwa River range that serves as an essential corridor for herds of Indian gaur (bison) and deer.',
    highlights: 'Denwa river watershed, scenic wilderness tracks, large gaur (bison) herds and peaceful scenery',
    quota: 'Day & Evening Drives Available (Wed afternoon closed)',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Jamani+Dev+Gate+Satpura'
  },
  {
    id: 'buf-tamia',
    name: 'Tamia Delakhari Gate',
    type: 'Buffer',
    district: 'Tamia Range, Chhindwara District, MP',
    description: 'Southern buffer gate connecting the spectacular Patalkot gorge and Tamia hills with Satpura’s protected wildlife forests.',
    highlights: 'Dramatic deep valleys and ravines, scenic mountain trails, medicinal plants & tribal heritage',
    quota: 'Day Drives Available (Wed afternoon closed)',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Tamia+Delakhari+Gate+Satpura'
  }
];

const SATPURA_HISTORICAL_MILESTONES = [
  {
    year: '1981',
    stepNumber: '01',
    shortLabel: 'National Park',
    title: 'Satpura National Park Established',
    description: 'Building upon India’s very first forest reserve at Bori (created in 1865), 483 sq km of pristine forests and gorges were officially declared Satpura National Park.',
    badge: 'National Park Formed'
  },
  {
    year: '1999',
    stepNumber: '02',
    shortLabel: 'Biosphere Reserve',
    title: 'First Biosphere Reserve in MP',
    description: 'UNESCO recognized the Pachmarhi Biosphere Reserve (uniting Satpura National Park, Bori, and Pachmarhi Sanctuaries) for its world-class biodiversity and unique rock art.',
    badge: 'UNESCO Biosphere'
  },
  {
    year: '2000',
    stepNumber: '03',
    shortLabel: 'Project Tiger',
    title: 'Inducted into Project Tiger',
    description: 'Satpura became a Project Tiger Reserve spanning 1,486 sq km, uniting the national park with Bori and Pachmarhi sanctuaries into a vast, contiguous tiger sanctuary.',
    badge: 'Project Tiger Reserve'
  },
  {
    year: '2007',
    stepNumber: '04',
    shortLabel: 'Critical Habitat',
    title: 'Critical Tiger Habitat Notified',
    description: 'A 1,339 sq km core area was formally notified as Critical Tiger Habitat, ensuring total legal protection for tigers, leopards, and rare hard-ground barasingha.',
    badge: 'Critical Core Notified'
  },
  {
    year: '2013',
    stepNumber: '05',
    shortLabel: 'Unified Control',
    title: 'Ranked #2 Tiger Reserve in India',
    description: 'Core and buffer areas (totaling 2,133 sq km) were brought under single unified management, earning Satpura the prestigious #2 National Rank for Best-Managed Tiger Reserves.',
    badge: 'National Top Rank #2'
  }
];

const SATPURA_SAFARI_TIMETABLE = [
  { season: 'October (Winter Timing)', slot: 'Morning', entryTime: '06:00 AM', exitTime: '10:00 AM' },
  { season: 'October (Winter Timing)', slot: 'Afternoon', entryTime: '14:30 PM', exitTime: '17:30 PM' },
  { season: 'November (Winter Timing)', slot: 'Morning', entryTime: '06:00 AM', exitTime: '10:00 AM' },
  { season: 'November (Winter Timing)', slot: 'Afternoon', entryTime: '14:30 PM', exitTime: '17:30 PM' },
  { season: 'December (Winter Timing)', slot: 'Morning', entryTime: '06:00 AM', exitTime: '10:00 AM' },
  { season: 'December (Winter Timing)', slot: 'Afternoon', entryTime: '14:30 PM', exitTime: '17:30 PM' },
  { season: 'January (Winter Timing)', slot: 'Morning', entryTime: '06:00 AM', exitTime: '10:00 AM' },
  { season: 'January (Winter Timing)', slot: 'Afternoon', entryTime: '14:30 PM', exitTime: '17:30 PM' },
  { season: 'February (Winter Timing)', slot: 'Morning', entryTime: '06:00 AM', exitTime: '10:00 AM' },
  { season: 'February (Winter Timing)', slot: 'Afternoon', entryTime: '14:30 PM', exitTime: '17:30 PM' },
  { season: 'March (Summer Timing)', slot: 'Morning', entryTime: '05:45 AM', exitTime: '09:30 AM' },
  { season: 'March (Summer Timing)', slot: 'Afternoon', entryTime: '15:00 PM', exitTime: '18:30 PM' },
  { season: 'April (Summer Timing)', slot: 'Morning', entryTime: '05:45 AM', exitTime: '09:30 AM' },
  { season: 'April (Summer Timing)', slot: 'Afternoon', entryTime: '15:00 PM', exitTime: '18:30 PM' },
  { season: 'May (Summer Timing)', slot: 'Morning', entryTime: '05:45 AM', exitTime: '09:30 AM' },
  { season: 'May (Summer Timing)', slot: 'Afternoon', entryTime: '15:00 PM', exitTime: '18:30 PM' },
  { season: 'June (Summer Timing)', slot: 'Morning', entryTime: '05:45 AM', exitTime: '09:30 AM' },
  { season: 'June (Summer Timing)', slot: 'Afternoon', entryTime: '15:00 PM', exitTime: '18:30 PM' }
];

const SATPURA_FAQS = [
  {
    question: '1. What makes Satpura unique compared to other tiger reserves in India?',
    answer:
      'Satpura is the only tiger reserve in India where you can experience guided walking safaris inside the core forest on foot with armed forest escorts! It also offers silent boat and canoe safaris along the Denwa River backwaters, classic 4x4 Gypsy drives, and evening night safaris in the buffer zones.'
  },
  {
    question: '2. What is the best time of year to visit Satpura?',
    answer:
      'Satpura is open for tourism from 15 October to 30 June each year. October to March offers cool, pleasant weather — perfect for walking safaris, boating, and birdwatching. April to June (summer) is the best time for spotting tigers, leopards, and sloth bears as animals gather near the Denwa River and waterholes. The core zone closes during monsoon (July to mid-October), though Pachmarhi hill station remains open year-round.'
  },
  {
    question: '3. How do I book safaris in Satpura, and which gates are best?',
    answer:
      'Permits are booked online via the official Madhya Pradesh Forest Department portal (forest.mponline.gov.in). Madhai Gate is the most popular and central entry hub, offering boat transfers, walking safaris, and jeep routes. Bheemkund (Churna) is ideal for deep-forest full-day expeditions, and Panarpani is best if you are staying in the Pachmarhi hill station.'
  },
  {
    question: '4. How long do safaris last, and what formats can I choose from?',
    answer:
      'Morning jeep safaris run approx. 3.5 to 4 hours (starting at sunrise) and afternoon safaris run approx. 3 to 3.5 hours (until sunset). Walking safaris typically last 2 to 3 hours over gentle forest trails. You can also book 1-to-2 hour boat or canoe cruises, or full-day jeep safaris deep into the Churna range.'
  },
  {
    question: '5. What should I pack and wear for a Satpura safari trip?',
    answer:
      'Bring your original Government Photo ID (matching your booking voucher). Wear earthy, neutral clothing (khakis, greens, and browns) and comfortable, closed-toe walking shoes. Winter mornings (Nov–Feb) can be chilly, especially near the water or on Pachmarhi plateau, so pack warm layers and a jacket. Bring sunglasses, sunscreen, and binoculars for birdwatching.'
  }
];

const SatpuraInformation = ({
  destination,
  resorts: _resorts,
  safariGates = SATPURA_MASTER_GATES
}: SatpuraDetailsProps) => {
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
    ? SATPURA_SAFARI_TIMETABLE
    : SATPURA_SAFARI_TIMETABLE.filter((t) => t.slot === timingSlotFilter);

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
    <div className="satpura-page">
      {/* ================= 1. COMPACT LUXURY HERO SECTION ================= */}
      <section className="satpura-hero">
        <img
          src={destination.coverImage || (destination.images && destination.images[0]) || SATPURA_HERO_IMAGE}
          alt={destination.name || 'Satpura scenic background'}
          className="satpura-hero-img"
        />

        <div className="satpura-hero-overlay" />

        <div className="satpura-hero-content">
          <div className="satpura-hero-wrapper">
            <div className="satpura-hero-eyebrow">
              <span className="satpura-hero-sublocation">NARMADAPURAM &amp; BETUL, MADHYA PRADESH</span>
            </div>

            <h1 className="satpura-hero-title">
              {destination.name || 'Satpura Tiger Reserve'}
            </h1>

            <p className="satpura-hero-subtitle">
              India's Only Walking Safari Tiger Reserve — Wild, Rugged and Untamed. Spanning 2,133 sq km of prehistoric sandstone gorges, tranquil Denwa river backwaters, and untamed forests crowned by Mount Dhoopgarh (1,350 m).
            </p>

            <div className="satpura-hero-actions">
              <Link
                to={`/trip-request/new?destination=${destination.id}`}
                className="satpura-hero-cta"
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
                className="satpura-hero-secondary"
              >
                <span>Explore Safari Gates</span>
                <Compass size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. FLOATING HORIZONTAL SECTION NAV ================= */}
      <div className="satpura-nav-wrapper">
        <nav className="satpura-sticky-nav" aria-label="Reserve Sections Navigation">
          <div className="satpura-sticky-nav-inner">
            <div className="satpura-sticky-nav-links">
              <button
                type="button"
                onClick={(e) => scrollToSection('about', e)}
                className={`satpura-sticky-nav-link ${activeSection === 'about' ? 'active' : ''}`}
              >
                <TreePine size={16} />
                <span>Overview &amp; Habitat</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('history', e)}
                className={`satpura-sticky-nav-link ${activeSection === 'history' ? 'active' : ''}`}
              >
                <History size={16} />
                <span>Milestones</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('safari-hub', e)}
                className={`satpura-sticky-nav-link ${activeSection === 'safari-hub' ? 'active' : ''}`}
              >
                <Compass size={16} />
                <span>Safari Planning Hub</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('how-to-reach', e)}
                className={`satpura-sticky-nav-link ${activeSection === 'how-to-reach' ? 'active' : ''}`}
              >
                <MapPin size={16} />
                <span>How to Reach</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('faqs', e)}
                className={`satpura-sticky-nav-link ${activeSection === 'faqs' ? 'active' : ''}`}
              >
                <HelpCircle size={16} />
                <span>FAQs</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* ================= 3. FULL-WIDTH LUXURY CONTAINER ================= */}
      <div className="satpura-container">
        <main className="satpura-main">
          {/* ================= SECTION 1: ABOUT & HABITAT ================= */}
          <section id="about" className="satpura-card satpura-about-card">
            <div className="satpura-card-header">
              <span className="satpura-card-eyebrow">ABOUT SATPURA</span>
              <h2 className="satpura-card-title">Prehistoric Highlands &amp; Multi-Format Wilderness</h2>
            </div>

            <div className="satpura-about-body">
              <p>
                Set in the rugged Satpura hill range south of the Narmada River in Madhya Pradesh, <strong>Satpura Tiger Reserve</strong> represents one of India's most pristine, uncommercialized wildlife sanctuaries. Uniting <strong>Satpura National Park</strong> with the historic <strong>Bori</strong> and <strong>Pachmarhi Wildlife Sanctuaries</strong>, its dramatic terrain ranges from sandstone ravines and waterfalls to Mount Dhoopgarh (1,350 m — MP’s highest peak) down to the sprawling Churna grasslands.
              </p>
              <p>
                Satpura is unique across all 55+ Indian tiger reserves for offering four distinct safari modes: <strong>guided core-zone walking safaris</strong>, <strong>boat and canoe safaris</strong> across the Tawa/Denwa backwaters, <strong>open 4x4 jeep safaris</strong>, and <strong>buffer night drives</strong>. It is a triumphant conservation landscape for the reintroduced hard-ground barasingha, Indian gaur, leopards, dholes, sloth bears, and an expanding tiger population.
              </p>
            </div>

            {/* Metric Stats Cards */}
            <div className="satpura-stats-grid">
              <div className="satpura-stat-card">
                <span className="satpura-stat-value">2,133.30</span>
                <span className="satpura-stat-unit">SQ KM</span>
                <span className="satpura-stat-label">TOTAL PROTECTED AREA</span>
              </div>

              <div className="satpura-stat-card">
                <span className="satpura-stat-value">1,339.26</span>
                <span className="satpura-stat-unit">SQ KM</span>
                <span className="satpura-stat-label">CRITICAL CORE HABITAT</span>
              </div>

              <div className="satpura-stat-card">
                <span className="satpura-stat-value">794.04</span>
                <span className="satpura-stat-unit">SQ KM</span>
                <span className="satpura-stat-label">BUFFER EXPANSION ZONE</span>
              </div>

              <div className="satpura-stat-card">
                <span className="satpura-stat-value">#2 RANK</span>
                <span className="satpura-stat-unit">NATIONAL MEE</span>
                <span className="satpura-stat-label">MANAGEMENT EFFECTIVENESS (2023)</span>
              </div>
            </div>

            {/* Story / Provenance of Satpura */}
            <div className="satpura-story-card">
              <div className="satpura-story-badge">
                <TreePine size={16} />
                <span>ANCIENT SANSKRIT HERITAGE &amp; ROCK ART</span>
              </div>
              <h3 className="satpura-story-title">The Seven Sacred Folds ("Sapta-Pura")</h3>
              <p className="satpura-story-text">
                The name <em>Satpura</em> derives from the Sanskrit compound <strong>Sapta-Pura</strong> (<em>Sapta</em> = seven, <em>Pura</em> = mountain folds), honoring the seven continuous hill ranges of Central India. First documented systematically by British Captain James Forsyth in 1862 during his historic survey (chronicled in <em>The Highlands of Central India</em>), the region is also globally celebrated for its archaeological heritage: over 50 documented sandstone rock shelters featuring prehistoric paintings dating from 1,500 to over 10,000 years old.
              </p>
            </div>
          </section>

          {/* ================= SECTION 2: HISTORICAL MILESTONES ================= */}
          <section id="history" className="satpura-card satpura-history-card">
            <div className="satpura-card-header">
              <span className="satpura-card-eyebrow">CHRONICLES OF CONSERVATION</span>
              <h2 className="satpura-card-title">Historical Milestones</h2>
              <p className="satpura-card-subtitle">
                From India's earliest 1865 reserved forest to a world-class biosphere reserve and walking tiger sanctuary.
              </p>
            </div>

            {/* Interactive Horizontal Year Track */}
            <div className="satpura-milestone-track-container">
              <div className="satpura-milestone-track-line" />
              <div className="satpura-milestone-nodes">
                {SATPURA_HISTORICAL_MILESTONES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveMilestoneIndex(idx)}
                    onMouseEnter={() => setActiveMilestoneIndex(idx)}
                    className={`satpura-milestone-node ${activeMilestoneIndex === idx ? 'active' : ''}`}
                    aria-label={`Milestone year ${item.year}: ${item.title}`}
                  >
                    <span className="satpura-milestone-node-dot" />
                    <span className="satpura-milestone-node-year">{item.year}</span>
                    <span className="satpura-milestone-node-label">{item.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Milestone Detail Card */}
            <div className="satpura-milestone-detail-card">
              <div className="satpura-milestone-detail-watermark">
                {SATPURA_HISTORICAL_MILESTONES[activeMilestoneIndex].year}
              </div>

              <div className="satpura-milestone-detail-inner">
                <div className="satpura-milestone-detail-top-badge">
                  <span className="satpura-milestone-badge-pill">
                    <span className="satpura-milestone-badge-dot" />
                    {SATPURA_HISTORICAL_MILESTONES[activeMilestoneIndex].badge}
                  </span>
                </div>

                <div className="satpura-milestone-detail-body">
                  <div className="satpura-milestone-detail-lead">
                    <span className="satpura-milestone-detail-year-highlight">
                      {SATPURA_HISTORICAL_MILESTONES[activeMilestoneIndex].year}
                    </span>
                    <h3 className="satpura-milestone-detail-title">
                      {SATPURA_HISTORICAL_MILESTONES[activeMilestoneIndex].title}
                    </h3>
                  </div>
                  <p className="satpura-milestone-detail-desc">
                    {SATPURA_HISTORICAL_MILESTONES[activeMilestoneIndex].description}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 3: SAFARI PLANNING HUB ================= */}
          <section id="safari-hub" className="satpura-card satpura-safari-hub-card">
            <div className="satpura-card-header">
              <span className="satpura-card-eyebrow">SAFARI PLANNING &amp; GATES DIRECTORY</span>
              <h2 className="satpura-card-title">Satpura Safari Planning Hub</h2>
              <p className="satpura-card-subtitle">
                Directory of multi-modal safari formats (Jeep, Walking, Boat, Canoe), seasonal shifts, and core vs. buffer gates.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="satpura-hub-tabs">
              <button
                type="button"
                className={`satpura-hub-tab ${activeTab === 'vehicles' ? 'active' : ''}`}
                onClick={() => setActiveTab('vehicles')}
              >
                <Compass size={16} />
                <span>Safari Formats &amp; Modes</span>
              </button>

              <button
                type="button"
                className={`satpura-hub-tab ${activeTab === 'timings' ? 'active' : ''}`}
                onClick={() => setActiveTab('timings')}
              >
                <Clock size={16} />
                <span>Shift Timings &amp; Rules</span>
              </button>

              <button
                type="button"
                className={`satpura-hub-tab ${activeTab === 'gates' ? 'active' : ''}`}
                onClick={() => setActiveTab('gates')}
              >
                <MapPin size={16} />
                <span>Gates Directory ({safariGates.length})</span>
              </button>
            </div>

            {/* Tab 1: Formats & Modes */}
            {activeTab === 'vehicles' && (
              <div className="satpura-tab-pane">
                <div className="satpura-vehicles-grid">
                  {/* Walking Safari */}
                  <div className="satpura-vehicle-card signature">
                    <div className="satpura-vehicle-header">
                      <div className="satpura-vehicle-icon-wrap walking">
                        <Footprints size={24} />
                      </div>
                      <div>
                        <span className="satpura-vehicle-tag">EXCLUSIVE SIGNATURE</span>
                        <h3 className="satpura-vehicle-title">Guided Walking Safaris</h3>
                      </div>
                    </div>
                    <p className="satpura-vehicle-desc">
                      Satpura is the only tiger reserve in India where visitors can traverse core wilderness trails on foot, accompanied by trained naturalists and armed forest guards.
                    </p>
                    <ul className="satpura-vehicle-features">
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Trail Focus:</strong> Pugmarks, birding, micro-fauna, botany &amp; silent stalking</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Safety:</strong> Mandatory accompaniment by armed forest guards</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Starting Point:</strong> Madhai core trailheads (via Denwa boat crossing)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Boat & Canoe Safari */}
                  <div className="satpura-vehicle-card">
                    <div className="satpura-vehicle-header">
                      <div className="satpura-vehicle-icon-wrap boat">
                        <Ship size={24} />
                      </div>
                      <div>
                        <span className="satpura-vehicle-tag">WATER SAFARI</span>
                        <h3 className="satpura-vehicle-title">Boat &amp; Canoe Safaris</h3>
                      </div>
                    </div>
                    <p className="satpura-vehicle-desc">
                      Glide silently across the tranquil Tawa and Denwa reservoir backwaters for exceptional marsh crocodile and waterfowl watching.
                    </p>
                    <ul className="satpura-vehicle-features">
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Water Activities:</strong> Motor boat cruises, silent canoeing &amp; shoreline birding</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Species Seen:</strong> Marsh crocodiles, Indian skimmers, osprey, migratory ducks</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Eco-friendly:</strong> Cycling and canoe permits officially permitted</span>
                      </li>
                    </ul>
                  </div>

                  {/* Open 4x4 Jeep */}
                  <div className="satpura-vehicle-card">
                    <div className="satpura-vehicle-header">
                      <div className="satpura-vehicle-icon-wrap">
                        <Car size={24} />
                      </div>
                      <div>
                        <span className="satpura-vehicle-tag">CORE &amp; BUFFER JEEP</span>
                        <h3 className="satpura-vehicle-title">Open 4x4 Gypsy Safaris</h3>
                      </div>
                    </div>
                    <p className="satpura-vehicle-desc">
                      Traditional open 4x4 vehicle game drives exploring rugged sandstone valleys, Keria, Lagda, and the epic 30 km deep Churna plains.
                    </p>
                    <ul className="satpura-vehicle-features">
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Core Routes:</strong> Keria, Lagda, and full-day deep Churna drives</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Capacity:</strong> 6 tourists + 1 registered guide + 1 driver</span>
                      </li>
                    </ul>
                  </div>

                  {/* Night Buffer Safari */}
                  <div className="satpura-vehicle-card">
                    <div className="satpura-vehicle-header">
                      <div className="satpura-vehicle-icon-wrap night">
                        <Moon size={24} />
                      </div>
                      <div>
                        <span className="satpura-vehicle-tag">BUFFER EXPEDITION</span>
                        <h3 className="satpura-vehicle-title">Nocturnal Night Safaris</h3>
                      </div>
                    </div>
                    <p className="satpura-vehicle-desc">
                      Conducted in select buffer zones such as Parsapani and Burgodi after dusk to observe leopards, rusty-spotted cats, civets, and owls.
                    </p>
                    <ul className="satpura-vehicle-features">
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Prime Locations:</strong> Parsapani and Burgodi Buffer gates</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Sightings:</strong> High frequency of leopards and nocturnal predators</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Timings & Rules */}
            {activeTab === 'timings' && (
              <div className="satpura-tab-pane">
                <div className="satpura-timings-filter-bar">
                  <div className="satpura-timings-filter-buttons">
                    {(['All', 'Morning', 'Afternoon'] as const).map((slot) => {
                      const count = slot === 'All'
                        ? SATPURA_SAFARI_TIMETABLE.length
                        : SATPURA_SAFARI_TIMETABLE.filter((t) => t.slot === slot).length;
                      return (
                        <button
                          key={slot}
                          type="button"
                          className={`satpura-timing-filter-btn ${timingSlotFilter === slot ? 'active' : ''}`}
                          onClick={() => setTimingSlotFilter(slot)}
                        >
                          {slot === 'All' ? 'All Slots' : `${slot} Slot`} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="satpura-timings-table-wrapper compact">
                  <table className="satpura-timings-table compact">
                    <thead>
                      <tr>
                        <th>Safari Season / Timing Cycle</th>
                        <th>Slot</th>
                        <th>Entry Time</th>
                        <th>Exit Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTimings.map((row, idx) => (
                        <tr key={idx}>
                          <td className="satpura-timing-season"><strong>{row.season}</strong></td>
                          <td className="satpura-timing-slot">{row.slot}</td>
                          <td className="satpura-timing-time">{row.entryTime}</td>
                          <td className="satpura-timing-time">{row.exitTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Closure Warnings */}
                <div className="satpura-closure-box compact">
                  <div className="satpura-closure-item">
                    <AlertTriangle className="satpura-closure-icon" size={16} />
                    <div>
                      <strong>Wednesday Afternoon Closure:</strong> Consistent with MP state forest regulations, afternoon safaris are closed every Wednesday for forest rest (morning safaris run normally).
                    </div>
                  </div>
                  <div className="satpura-closure-item">
                    <AlertTriangle className="satpura-closure-icon" size={16} />
                    <div>
                      <strong>Monsoon Closure Period:</strong> Core safari zones are closed from July 1 to mid-October. The Pachmarhi hill station area remains open year-round.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Gates Directory */}
            {activeTab === 'gates' && (
              <div className="satpura-tab-pane">
                <div className="satpura-gates-filter-bar">
                  <div className="satpura-gates-filter-buttons">
                    <button
                      type="button"
                      className={`satpura-gate-filter-btn ${gateFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setGateFilter('all')}
                    >
                      All Safari Gates ({safariGates.length})
                    </button>
                    <button
                      type="button"
                      className={`satpura-gate-filter-btn ${gateFilter === 'Core' ? 'active' : ''}`}
                      onClick={() => setGateFilter('Core')}
                    >
                      Core Gates ({coreGatesCount})
                    </button>
                    <button
                      type="button"
                      className={`satpura-gate-filter-btn ${gateFilter === 'Buffer' ? 'active' : ''}`}
                      onClick={() => setGateFilter('Buffer')}
                    >
                      Buffer Gates ({bufferGatesCount})
                    </button>
                  </div>

                  <div className="satpura-gates-search-box">
                    <Search size={15} className="satpura-gates-search-icon" />
                    <input
                      type="text"
                      value={gateSearchQuery}
                      onChange={(e) => setGateSearchQuery(e.target.value)}
                      placeholder="Search gate name..."
                      className="satpura-gates-search-input"
                    />
                  </div>
                </div>

                <div className="satpura-gates-compact-grid">
                  {filteredGates.map((gate) => (
                    <div key={gate.id} className={`satpura-gate-compact-card ${gate.type.toLowerCase()}`}>
                      <div className="satpura-gate-compact-main">
                        <span className={`satpura-gate-type-badge ${gate.type.toLowerCase()}`}>
                          {gate.type} Gate
                        </span>
                        <h4 className="satpura-gate-compact-name">{gate.name}</h4>
                      </div>

                      {gate.mapLink && (
                        <a
                          href={gate.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="satpura-gate-compact-map-btn"
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
                  <div className="satpura-gates-empty-state">
                    <p>No safari gates found matching "{gateSearchQuery}".</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ================= SECTION 4: HOW TO REACH ================= */}
          <section id="how-to-reach" className="satpura-card satpura-reach-card">
            <div className="satpura-card-header">
              <span className="satpura-card-eyebrow">TRAVEL &amp; CONNECTIVITY</span>
              <h2 className="satpura-card-title">How to Reach Satpura</h2>
              <p className="satpura-card-subtitle">
                Easily accessible via Bhopal Airport and major central railway hubs at Itarsi Junction and Pipariya.
              </p>
            </div>

            <div className="satpura-reach-grid">
              {/* By Air */}
              <div className="satpura-reach-card-item air">
                <div className="satpura-reach-card-top">
                  <div className="satpura-reach-icon-badge air">
                    <Plane size={20} />
                  </div>
                  <span className="satpura-reach-pill air">BY AIR</span>
                </div>

                <div className="satpura-reach-card-main">
                  <h3 className="satpura-reach-title">Bhopal Raja Bhoj Airport</h3>
                  <p className="satpura-reach-desc">
                    Bhopal Airport (BHO - ~170–220 km) is the principal flight hub with nonstop flights from Mumbai, Delhi, and Bangalore. Jabalpur (230 km) and Nagpur (340 km) are also convenient.
                  </p>
                </div>

                <div className="satpura-reach-meta-box">
                  <div className="satpura-reach-stat">
                    <span className="satpura-reach-stat-label">Bhopal (BHO)</span>
                    <span className="satpura-reach-stat-val">~170 km (~3.5 hrs)</span>
                  </div>
                  <div className="satpura-reach-stat">
                    <span className="satpura-reach-stat-label">Jabalpur (JLR)</span>
                    <span className="satpura-reach-stat-val">~230 km (~5 hrs)</span>
                  </div>
                </div>
              </div>

              {/* By Rail */}
              <div className="satpura-reach-card-item rail">
                <div className="satpura-reach-card-top">
                  <div className="satpura-reach-icon-badge rail">
                    <Train size={20} />
                  </div>
                  <span className="satpura-reach-pill rail">BY RAIL</span>
                </div>

                <div className="satpura-reach-card-main">
                  <h3 className="satpura-reach-title">Itarsi, Sohagpur &amp; Pipariya</h3>
                  <p className="satpura-reach-desc">
                    Itarsi Junction (ET - ~65–70 km) is India's premier railway cross-junction connecting north, south, east, and west. Pipariya (45 km) and Sohagpur (18 km) provide immediate Madhai access.
                  </p>
                </div>

                <div className="satpura-reach-meta-box">
                  <div className="satpura-reach-stat">
                    <span className="satpura-reach-stat-label">Itarsi Junction (ET)</span>
                    <span className="satpura-reach-stat-val">~65 km (~1.5 hrs)</span>
                  </div>
                  <div className="satpura-reach-stat">
                    <span className="satpura-reach-stat-label">Pipariya (PPI)</span>
                    <span className="satpura-reach-stat-val">~45 km (~1 hr)</span>
                  </div>
                </div>
              </div>

              {/* By Road */}
              <div className="satpura-reach-card-item road">
                <div className="satpura-reach-card-top">
                  <div className="satpura-reach-icon-badge road">
                    <Car size={20} />
                  </div>
                  <span className="satpura-reach-pill road">BY ROAD</span>
                </div>

                <div className="satpura-reach-card-main">
                  <h3 className="satpura-reach-title">Highways from Bhopal &amp; Itarsi</h3>
                  <p className="satpura-reach-desc">
                    Smooth four-lane highways connecting Bhopal, Hoshangabad (Narmadapuram), and Sohagpur directly to the Madhai boat ferry terminal.
                  </p>
                </div>

                <div className="satpura-reach-cities-grid">
                  <div className="satpura-reach-city-chip">
                    <span className="city">Sohagpur</span>
                    <span className="dist">18 km</span>
                  </div>
                  <div className="satpura-reach-city-chip">
                    <span className="city">Pipariya</span>
                    <span className="dist">45 km</span>
                  </div>
                  <div className="satpura-reach-city-chip">
                    <span className="city">Itarsi</span>
                    <span className="dist">65 km</span>
                  </div>
                  <div className="satpura-reach-city-chip">
                    <span className="city">Bhopal</span>
                    <span className="dist">170 km</span>
                  </div>
                  <div className="satpura-reach-city-chip">
                    <span className="city">Jabalpur</span>
                    <span className="dist">230 km</span>
                  </div>
                  <div className="satpura-reach-city-chip">
                    <span className="city">Pench Corridor</span>
                    <span className="dist">250 km</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 5: FAQS ================= */}
          <section id="faqs" className="satpura-card satpura-faqs-card">
            <div className="satpura-card-header">
              <span className="satpura-card-eyebrow">COMMON QUERIES</span>
              <h2 className="satpura-card-title">Frequently Asked Questions</h2>
              <p className="satpura-card-subtitle">
                Key guidance regarding walking safari regulations, boat transfers, and seasonal schedules.
              </p>
            </div>

            <div className="satpura-faqs-list">
              {SATPURA_FAQS.map((faq, index) => (
                <div
                  key={index}
                  className={`satpura-faq-item ${openFaqIndex === index ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    className="satpura-faq-question-btn"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`satpura-faq-chevron ${openFaqIndex === index ? 'rotate' : ''}`}
                      size={18}
                    />
                  </button>

                  {openFaqIndex === index && (
                    <div className="satpura-faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ================= SECTION 6: FINAL LUXURY CTA ================= */}
          <section className="satpura-final-cta-card">
            <div className="satpura-final-cta-content">
              <h2 className="satpura-final-cta-title">
                Experience India's Most Untamed Tiger Haven
              </h2>
              <p className="satpura-final-cta-desc">
                Walk through the core forest on foot, canoe across mist-laden waters, and embark on exclusive leopard night safaris. Let our naturalists design your custom Satpura itinerary.
              </p>

              <div className="satpura-final-cta-actions">
                <Link
                  to={`/trip-request/new?destination=${destination.id}`}
                  className="satpura-final-cta-btn"
                >
                  <span>Request a Custom Proposal</span>
                  <ArrowUpRight size={18} />
                </Link>
              </div>

              <div className="satpura-final-cta-trust">
                <span><CheckCircle2 size={16} /> Official Walking Safari Permits</span>
                <span><CheckCircle2 size={16} /> Handpicked Riverside Eco-Lodges</span>
                <span><CheckCircle2 size={16} /> Certified Armed Forest Escorts</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SatpuraInformation;
