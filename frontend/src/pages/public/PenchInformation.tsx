/* ==========================================================
   Pench Tiger Reserve Comprehensive Information Page
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

const PENCH_HERO_IMAGE = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80';

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
    shortLabel: 'Sanctuary Act',
    title: 'Wildlife Sanctuary Declared',
    description: '449.39 sq km declared Sanctuary; initial protection of Seoni Mowgli lands and rich teak bio-corridors.',
    badge: 'First Protected Era'
  },
  {
    year: '1983',
    stepNumber: '02',
    shortLabel: 'National Park',
    title: 'National Park Established',
    description: '292.85 sq km carved as Pench National Park within Seoni and Chhindwara districts to secure critical core habitats.',
    badge: 'Core Demarcation'
  },
  {
    year: '1992',
    stepNumber: '03',
    shortLabel: 'Project Tiger',
    title: '19th Project Tiger Reserve',
    description: 'Inducted as India’s 19th Project Tiger Reserve, establishing apex NTCA conservation over 411.33 sq km core.',
    badge: 'Apex NTCA Status'
  },
  {
    year: '2002',
    stepNumber: '04',
    shortLabel: 'Indira Priyadarshini',
    title: 'Indira Priyadarshini Nomenclature',
    description: 'Renamed Indira Priyadarshini Pench National Park & Mowgli Sanctuary, celebrating its Kipling literary heritage.',
    badge: 'Official Nomenclature'
  },
  {
    year: '2010',
    stepNumber: '05',
    shortLabel: 'Buffer Notified',
    title: 'Buffer Zone Notification',
    description: '768.30 sq km buffer formally notified, bringing total MP sanctuary landscape to 1,179.63 sq km.',
    badge: 'Current Boundaries'
  }
];

const PENCH_SAFARI_TIMETABLE = [
  { season: 'October (From Oct 1)', slot: 'Morning', entryTime: '06:00 AM', exitTime: '11:00 AM' },
  { season: 'October (From Oct 1)', slot: 'Evening', entryTime: '14:30 PM', exitTime: '17:30 PM' },
  { season: 'November', slot: 'Morning', entryTime: '06:15 AM', exitTime: '11:00 AM' },
  { season: 'November', slot: 'Evening', entryTime: '14:30 PM', exitTime: '17:15 PM' },
  { season: 'December', slot: 'Morning', entryTime: '06:30 AM', exitTime: '11:00 AM' },
  { season: 'December', slot: 'Evening', entryTime: '14:30 PM', exitTime: '17:15 PM' },
  { season: 'January', slot: 'Morning', entryTime: '06:45 AM', exitTime: '11:15 AM' },
  { season: 'January', slot: 'Evening', entryTime: '14:30 PM', exitTime: '17:30 PM' },
  { season: 'February', slot: 'Morning', entryTime: '06:30 AM', exitTime: '11:00 AM' },
  { season: 'February', slot: 'Evening', entryTime: '14:45 PM', exitTime: '17:45 PM' },
  { season: 'March', slot: 'Morning', entryTime: '06:00 AM', exitTime: '10:30 AM' },
  { season: 'March', slot: 'Evening', entryTime: '15:00 PM', exitTime: '18:00 PM' },
  { season: 'April', slot: 'Morning', entryTime: '05:45 AM', exitTime: '10:15 AM' },
  { season: 'April', slot: 'Evening', entryTime: '15:30 PM', exitTime: '18:30 PM' },
  { season: 'May – June', slot: 'Morning', entryTime: '05:30 AM', exitTime: '10:00 AM' },
  { season: 'May – June', slot: 'Evening', entryTime: '15:30 PM', exitTime: '18:45 PM' }
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
  const [activeTab, setActiveTab] = useState<'vehicles' | 'timings' | 'gates'>('vehicles');
  const [gateFilter, setGateFilter] = useState<'all' | 'Core' | 'Buffer'>('all');
  const [gateSearchQuery, setGateSearchQuery] = useState<string>('');
  const [timingSlotFilter, setTimingSlotFilter] = useState<'All' | 'Morning' | 'Evening'>('All');
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
    ? PENCH_SAFARI_TIMETABLE
    : PENCH_SAFARI_TIMETABLE.filter((t) => t.slot === timingSlotFilter);

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
    <div className="pench-page">
      {/* ================= 1. COMPACT LUXURY HERO SECTION ================= */}
      <section className="pench-hero">
        <img
          src={destination.bannerImage || destination.imageUrl || PENCH_HERO_IMAGE}
          alt={destination.name || 'Pench scenic background'}
          className="pench-hero-img"
        />

        <div className="pench-hero-overlay" />

        <div className="pench-hero-content">
          <div className="pench-hero-wrapper">
            <div className="pench-hero-eyebrow">
              <span className="pench-hero-sublocation">SEONI &amp; CHHINDWARA, MADHYA PRADESH</span>
            </div>

            <h1 className="pench-hero-title">
              {destination.name || 'Pench Tiger Reserve'}
            </h1>

            <p className="pench-hero-subtitle">
              The legendary wilderness that inspired Rudyard Kipling’s <em>The Jungle Book</em>. Spanning 1,179.63 sq km across the Satpura-Maikal hills, teak canopies, and the life-giving Pench River.
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
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. FLOATING HORIZONTAL SECTION NAV ================= */}
      <div className="pench-nav-wrapper">
        <nav className="pench-sticky-nav" aria-label="Reserve Sections Navigation">
          <div className="pench-sticky-nav-inner">
            <div className="pench-sticky-nav-links">
              <button
                type="button"
                onClick={(e) => scrollToSection('about', e)}
                className={`pench-sticky-nav-link ${activeSection === 'about' ? 'active' : ''}`}
              >
                <TreePine size={16} />
                <span>Overview &amp; Habitat</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('history', e)}
                className={`pench-sticky-nav-link ${activeSection === 'history' ? 'active' : ''}`}
              >
                <History size={16} />
                <span>Milestones</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('safari-hub', e)}
                className={`pench-sticky-nav-link ${activeSection === 'safari-hub' ? 'active' : ''}`}
              >
                <Compass size={16} />
                <span>Safari Planning Hub</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('how-to-reach', e)}
                className={`pench-sticky-nav-link ${activeSection === 'how-to-reach' ? 'active' : ''}`}
              >
                <MapPin size={16} />
                <span>How to Reach</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('faqs', e)}
                className={`pench-sticky-nav-link ${activeSection === 'faqs' ? 'active' : ''}`}
              >
                <HelpCircle size={16} />
                <span>FAQs</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* ================= 3. FULL-WIDTH LUXURY CONTAINER ================= */}
      <div className="pench-container">
        <main className="pench-main">
          {/* ================= SECTION 1: ABOUT & HABITAT ================= */}
          <section id="about" className="pench-card pench-about-card">
            <div className="pench-card-header">
              <span className="pench-card-eyebrow">ABOUT PENCH</span>
              <h2 className="pench-card-title">The Land of The Jungle Book</h2>
            </div>

            <div className="pench-about-body">
              <p>
                Named after the meandering <strong>Pench River</strong> that bisects the sanctuary from north to south, Pench Tiger Reserve encompasses a rich mosaic of tropical dry and moist teak forests, open savannah grasses, and riverine banks. It acts as an indispensable ecological corridor connecting <strong>Kanha Tiger Reserve</strong> to the east and <strong>Satpura Tiger Reserve</strong> to the west, harboring prime populations of Bengal tigers, leopards, dholes, and sloth bears.
              </p>
            </div>

            {/* Metric Stats Cards */}
            <div className="pench-stats-grid">
              <div className="pench-stat-card">
                <span className="pench-stat-value">~1,179.63</span>
                <span className="pench-stat-unit">SQ KM</span>
                <span className="pench-stat-label">TOTAL PROTECTED AREA (MP)</span>
              </div>

              <div className="pench-stat-card">
                <span className="pench-stat-value">~411.33</span>
                <span className="pench-stat-unit">SQ KM</span>
                <span className="pench-stat-label">PRISTINE CORE ZONE</span>
              </div>

              <div className="pench-stat-card">
                <span className="pench-stat-value">~768.30</span>
                <span className="pench-stat-unit">SQ KM</span>
                <span className="pench-stat-label">BUFFER CORRIDOR</span>
              </div>
            </div>

            {/* Story / Provenance of Pench */}
            <div className="pench-story-card">
              <div className="pench-story-badge">
                <TreePine size={16} />
                <span>LITERARY HERITAGE</span>
              </div>
              <h3 className="pench-story-title">Mowgli and The Jungle Book</h3>
              <p className="pench-story-text">
                The dense teak valleys of Pench and Seoni highlands served as the authentic geographical backdrop for Rudyard Kipling's 1894 classic <em>The Jungle Book</em>. Inspired by historical accounts of human-wolf encounters documented by British naturalists in the 19th century, Pench preserves the timeless beauty of the Seeonee wolf packs, Sher Khan's trails, and the life-giving Pench River.
              </p>
            </div>
          </section>

          {/* ================= SECTION 2: HISTORICAL MILESTONES ================= */}
          <section id="history" className="pench-card pench-history-card">
            <div className="pench-card-header">
              <span className="pench-card-eyebrow">CHRONICLES OF CONSERVATION</span>
              <h2 className="pench-card-title">Historical Milestones</h2>
              <p className="pench-card-subtitle">
                From protected Mowgli sanctuary to India’s 19th Project Tiger Reserve — explore the key conservation eras. Hover or tap any year to view details.
              </p>
            </div>

            {/* Interactive Horizontal Year Track */}
            <div className="pench-milestone-track-container">
              <div className="pench-milestone-track-line" />
              <div className="pench-milestone-nodes">
                {PENCH_HISTORICAL_MILESTONES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveMilestoneIndex(idx)}
                    onMouseEnter={() => setActiveMilestoneIndex(idx)}
                    className={`pench-milestone-node ${activeMilestoneIndex === idx ? 'active' : ''}`}
                    aria-label={`Milestone year ${item.year}: ${item.title}`}
                  >
                    <span className="pench-milestone-node-dot" />
                    <span className="pench-milestone-node-year">{item.year}</span>
                    <span className="pench-milestone-node-label">{item.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Milestone Detail Card */}
            <div className="pench-milestone-detail-card">
              <div className="pench-milestone-detail-watermark">
                {PENCH_HISTORICAL_MILESTONES[activeMilestoneIndex].year}
              </div>

              <div className="pench-milestone-detail-inner">
                <div className="pench-milestone-detail-top-badge">
                  <span className="pench-milestone-badge-pill">
                    <span className="pench-milestone-badge-dot" />
                    {PENCH_HISTORICAL_MILESTONES[activeMilestoneIndex].badge}
                  </span>
                </div>

                <div className="pench-milestone-detail-body">
                  <div className="pench-milestone-detail-lead">
                    <span className="pench-milestone-detail-year-highlight">
                      {PENCH_HISTORICAL_MILESTONES[activeMilestoneIndex].year}
                    </span>
                    <h3 className="pench-milestone-detail-title">
                      {PENCH_HISTORICAL_MILESTONES[activeMilestoneIndex].title}
                    </h3>
                  </div>
                  <p className="pench-milestone-detail-desc">
                    {PENCH_HISTORICAL_MILESTONES[activeMilestoneIndex].description}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 3: SAFARI PLANNING HUB ================= */}
          <section id="safari-hub" className="pench-card pench-safari-hub-card">
            <div className="pench-card-header">
              <span className="pench-card-eyebrow">SAFARI PLANNING &amp; GATES DIRECTORY</span>
              <h2 className="pench-card-title">Pench Safari Planning Hub</h2>
              <p className="pench-card-subtitle">
                Interactive directory of official safari vehicles, monthly gate shift timings, and MP core vs. buffer gate locations.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="pench-hub-tabs">
              <button
                type="button"
                className={`pench-hub-tab ${activeTab === 'vehicles' ? 'active' : ''}`}
                onClick={() => setActiveTab('vehicles')}
              >
                <Car size={16} />
                <span>Vehicles &amp; Capacities</span>
              </button>

              <button
                type="button"
                className={`pench-hub-tab ${activeTab === 'timings' ? 'active' : ''}`}
                onClick={() => setActiveTab('timings')}
              >
                <Clock size={16} />
                <span>Shift Timings &amp; Rules</span>
              </button>

              <button
                type="button"
                className={`pench-hub-tab ${activeTab === 'gates' ? 'active' : ''}`}
                onClick={() => setActiveTab('gates')}
              >
                <MapPin size={16} />
                <span>Gates Directory ({safariGates.length})</span>
              </button>
            </div>

            {/* Tab 1: Vehicles & Capacities */}
            {activeTab === 'vehicles' && (
              <div className="pench-tab-pane">
                <div className="pench-vehicles-grid">
                  <div className="pench-vehicle-card">
                    <div className="pench-vehicle-header">
                      <div className="pench-vehicle-icon-wrap">
                        <Car size={24} />
                      </div>
                      <div>
                        <span className="pench-vehicle-tag">STANDARD SAFARI</span>
                        <h3 className="pench-vehicle-title">Open 4x4 Maruti Gypsy</h3>
                      </div>
                    </div>
                    <p className="pench-vehicle-desc">
                      Standard 4x4 registered open vehicle operated for official forest drives across core and buffer sectors.
                    </p>
                    <ul className="pench-vehicle-features">
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Permit Scope:</strong> Valid across 3 Core Gates &amp; 5 Buffer Gates (MP)</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Occupancy:</strong> Strictly capped at 6 tourists + 1 guide + 1 driver</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Shift Types:</strong> Morning &amp; Evening Game Drives</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Booking Type:</strong> Full vehicle permit or single-seat reservation</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pench-vehicle-card">
                    <div className="pench-vehicle-header">
                      <div className="pench-vehicle-icon-wrap">
                        <Layers size={24} />
                      </div>
                      <div>
                        <span className="pench-vehicle-tag">SHARED SERVICE</span>
                        <h3 className="pench-vehicle-title">Open Canter (Safari Bus)</h3>
                      </div>
                    </div>
                    <p className="pench-vehicle-desc">
                      Higher-elevation shared safari vehicle operating on designated core routes from select gate hubs.
                    </p>
                    <ul className="pench-vehicle-features">
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Route Scope:</strong> Selected gates (Turia Gate Hub)</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Capacity:</strong> Shared vehicle with 12 to 18 tourist seats</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Naturalist:</strong> Escorted by certified forest department guide</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Cost Advantage:</strong> Economical individual per-seat booking</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Timings & Rules */}
            {activeTab === 'timings' && (
              <div className="pench-tab-pane">
                <div className="pench-timings-filter-bar">
                  <div className="pench-timings-filter-buttons">
                    {(['All', 'Morning', 'Evening'] as const).map((slot) => {
                      const count = slot === 'All'
                        ? PENCH_SAFARI_TIMETABLE.length
                        : PENCH_SAFARI_TIMETABLE.filter((t) => t.slot === slot).length;
                      return (
                        <button
                          key={slot}
                          type="button"
                          className={`pench-timing-filter-btn ${timingSlotFilter === slot ? 'active' : ''}`}
                          onClick={() => setTimingSlotFilter(slot)}
                        >
                          {slot === 'All' ? 'All Slots' : `${slot} Slot`} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pench-timings-table-wrapper compact">
                  <table className="pench-timings-table compact">
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
                          <td className="pench-timing-season"><strong>{row.season}</strong></td>
                          <td className="pench-timing-slot">{row.slot}</td>
                          <td className="pench-timing-time">{row.entryTime}</td>
                          <td className="pench-timing-time">{row.exitTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Closure Warnings */}
                <div className="pench-closure-box compact">
                  <div className="pench-closure-item">
                    <AlertTriangle className="pench-closure-icon" size={16} />
                    <div>
                      <strong>Wednesday Afternoon Closure:</strong> All Core and Buffer safari zones are closed every Wednesday afternoon.
                    </div>
                  </div>
                  <div className="pench-closure-item">
                    <AlertTriangle className="pench-closure-icon" size={16} />
                    <div>
                      <strong>Monsoon Core Closure:</strong> Core zones are closed from July 1 to Sept 30 (Buffer zones offer limited ecotourism).
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Gates Directory */}
            {activeTab === 'gates' && (
              <div className="pench-tab-pane">
                <div className="pench-gates-filter-bar">
                  <div className="pench-gates-filter-buttons">
                    <button
                      type="button"
                      className={`pench-gate-filter-btn ${gateFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setGateFilter('all')}
                    >
                      All Safari Gates ({safariGates.length})
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

                  <div className="pench-gates-search-box">
                    <Search size={15} className="pench-gates-search-icon" />
                    <input
                      type="text"
                      value={gateSearchQuery}
                      onChange={(e) => setGateSearchQuery(e.target.value)}
                      placeholder="Search gate name..."
                      className="pench-gates-search-input"
                    />
                  </div>
                </div>

                <div className="pench-gates-compact-grid">
                  {filteredGates.map((gate) => (
                    <div key={gate.id} className={`pench-gate-compact-card ${gate.type.toLowerCase()}`}>
                      <div className="pench-gate-compact-main">
                        <span className={`pench-gate-type-badge ${gate.type.toLowerCase()}`}>
                          {gate.type} Gate
                        </span>
                        <h4 className="pench-gate-compact-name">{gate.name}</h4>
                      </div>

                      {gate.mapLink && (
                        <a
                          href={gate.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pench-gate-compact-map-btn"
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
                  <div className="pench-gates-empty-state">
                    <p>No safari gates found matching "{gateSearchQuery}".</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ================= SECTION 4: HOW TO REACH ================= */}
          <section id="how-to-reach" className="pench-card pench-reach-card">
            <div className="pench-card-header">
              <span className="pench-card-eyebrow">TRAVEL &amp; CONNECTIVITY</span>
              <h2 className="pench-card-title">How to Reach Pench</h2>
              <p className="pench-card-subtitle">
                Strategically situated along National Highway 44 (NH-44), seamlessly connected to international airports and major railway junctions.
              </p>
            </div>

            <div className="pench-reach-grid">
              {/* By Air */}
              <div className="pench-reach-card-item air">
                <div className="pench-reach-card-top">
                  <div className="pench-reach-icon-badge air">
                    <Plane size={20} />
                  </div>
                  <span className="pench-reach-pill air">BY AIR</span>
                </div>

                <div className="pench-reach-card-main">
                  <h3 className="pench-reach-title">Nagpur &amp; Jabalpur Airports</h3>
                  <p className="pench-reach-desc">
                    Dr. Babasaheb Ambedkar Airport (Nagpur - NAG) is the primary aviation hub with direct metro connections. Jabalpur (JLR) serves northern gates.
                  </p>
                </div>

                <div className="pench-reach-meta-box">
                  <div className="pench-reach-stat">
                    <span className="pench-reach-stat-label">Nagpur Airport (NAG)</span>
                    <span className="pench-reach-stat-val">~90 km (~1.5–2 hrs)</span>
                  </div>
                  <div className="pench-reach-stat">
                    <span className="pench-reach-stat-label">Jabalpur Airport (JLR)</span>
                    <span className="pench-reach-stat-val">~190 km (~4 hrs)</span>
                  </div>
                </div>
              </div>

              {/* By Rail */}
              <div className="pench-reach-card-item rail">
                <div className="pench-reach-card-top">
                  <div className="pench-reach-icon-badge rail">
                    <Train size={20} />
                  </div>
                  <span className="pench-reach-pill rail">BY RAIL</span>
                </div>

                <div className="pench-reach-card-main">
                  <h3 className="pench-reach-title">Nagpur Jn &amp; Seoni Stations</h3>
                  <p className="pench-reach-desc">
                    Nagpur Junction connects superfast expresses nationwide. Seoni Station offers close regional broad-gauge rail connectivity.
                  </p>
                </div>

                <div className="pench-reach-meta-box">
                  <div className="pench-reach-stat">
                    <span className="pench-reach-stat-label">Nagpur Jn (NGP)</span>
                    <span className="pench-reach-stat-val">~90 km (~1.5 hrs)</span>
                  </div>
                  <div className="pench-reach-stat">
                    <span className="pench-reach-stat-label">Seoni Station</span>
                    <span className="pench-reach-stat-val">~60 km (~1 hr)</span>
                  </div>
                </div>
              </div>

              {/* By Road */}
              <div className="pench-reach-card-item road">
                <div className="pench-reach-card-top">
                  <div className="pench-reach-icon-badge road">
                    <Car size={20} />
                  </div>
                  <span className="pench-reach-pill road">BY ROAD</span>
                </div>

                <div className="pench-reach-card-main">
                  <h3 className="pench-reach-title">NH-44 Express Highway</h3>
                  <p className="pench-reach-desc">
                    Pench gates (Turia / Khawasa) sit right on 4-lane NH-44 with world-class elevated wildlife eco-duct corridors.
                  </p>
                </div>

                <div className="pench-reach-cities-grid">
                  <div className="pench-reach-city-chip">
                    <span className="city">Nagpur</span>
                    <span className="dist">90 km</span>
                  </div>
                  <div className="pench-reach-city-chip">
                    <span className="city">Seoni</span>
                    <span className="dist">60 km</span>
                  </div>
                  <div className="pench-reach-city-chip">
                    <span className="city">Kanha</span>
                    <span className="dist">180 km</span>
                  </div>
                  <div className="pench-reach-city-chip">
                    <span className="city">Tadoba / Jabalpur</span>
                    <span className="dist">250 / 190 km</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 5: FAQS ================= */}
          <section id="faqs" className="pench-card pench-faqs-card">
            <div className="pench-card-header">
              <span className="pench-card-eyebrow">COMMON QUERIES</span>
              <h2 className="pench-card-title">Frequently Asked Questions</h2>
              <p className="pench-card-subtitle">
                Essential MPOnline rules, vehicle quotas, permit timelines, and safari guidance.
              </p>
            </div>

            <div className="pench-faqs-list">
              {PENCH_FAQS.map((faq, index) => (
                <div
                  key={index}
                  className={`pench-faq-item ${openFaqIndex === index ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    className="pench-faq-question-btn"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`pench-faq-chevron ${openFaqIndex === index ? 'rotate' : ''}`}
                      size={18}
                    />
                  </button>

                  {openFaqIndex === index && (
                    <div className="pench-faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ================= SECTION 6: FINAL LUXURY CTA ================= */}
          <section className="pench-final-cta-card">
            <div className="pench-final-cta-content">
              <h2 className="pench-final-cta-title">
                Ready for an Unforgettable Pench Safari?
              </h2>
              <p className="pench-final-cta-desc">
                Let our dedicated safari specialists curate your MPOnline permits, handpicked resort stays, and naturalist-guided jeep drives across Pench's prime zones.
              </p>

              <div className="pench-final-cta-actions">
                <Link
                  to={`/trip-request/new?destination=${destination.id}`}
                  className="pench-final-cta-btn"
                >
                  <span>Request a Custom Proposal</span>
                  <ArrowUpRight size={18} />
                </Link>
              </div>

              <div className="pench-final-cta-trust">
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

export default PenchInformation;
