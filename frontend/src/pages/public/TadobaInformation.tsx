/* ==========================================================
   Tadoba Andhari Tiger Reserve Comprehensive Information Page
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
import '../../styles/public/TadobaInformation.css';

import matkasur from '../../assets/Tiger&Logo Image/Matkasur.JPG';

interface SafariGate {
  id: string;
  name: string;
  type: 'Core' | 'Buffer';
  description: string;
  highlights?: string;
  mapLink?: string;
  quota?: string;
}

interface TadobaDetailsProps {
  destination: Destination;
  resorts?: Resort[];
  safariGates?: SafariGate[];
}

const TADOBA_MASTER_GATES: SafariGate[] = [
  // Core Gates
  {
    id: 'core-moharli',
    name: 'Moharli Gate',
    type: 'Core',
    description: 'Moharli, Chandrapur, Maharashtra. The most famous and historic gate with maximum resort access and prime tiger territory.',
    highlights: 'Telia Dam, Moharli waterhole, Khatoda grassland, highest tiger sighting frequency',
    quota: 'Morning & Afternoon Shifts',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Moharli+Gate+Tadoba'
  },
  {
    id: 'core-kolara',
    name: 'Kolara Gate',
    type: 'Core',
    description: 'Kolara, Chandrapur, Maharashtra. Premier northern core entrance offering scenic landscapes and high tiger movement.',
    highlights: 'Kolara lake, Jamunbodi, productive bamboo thickets, direct access from Nagpur',
    quota: 'Morning & Afternoon Shifts',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Kolara+Gate+Tadoba'
  },
  {
    id: 'core-khutwanda',
    name: 'Khutwanda Gate',
    type: 'Core',
    description: 'Khutwanda, Chandrapur, Maharashtra. Situated between Moharli and Kolara, known for tranquil forest tracks.',
    highlights: 'Panchdhara, Jamni waterhole, tranquil core tracking',
    quota: 'Morning & Afternoon Shifts',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Khutwanda+Gate+Tadoba'
  },
  {
    id: 'core-navegaon',
    name: 'Navegaon Gate',
    type: 'Core',
    description: 'Navegaon, Chandrapur, Maharashtra. Northern gate serving as an excellent entry for visitors approaching via Nagpur.',
    highlights: 'Navegaon meadow, rich birdlife, leopard and tiger territory',
    quota: 'Morning & Afternoon Shifts',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Navegaon+Gate+Tadoba'
  },
  {
    id: 'core-zari',
    name: 'Zari Gate',
    type: 'Core',
    description: 'Zari, Chandrapur, Maharashtra. Southern sector core gate with rolling forest ridges and pristine valleys.',
    highlights: 'Zari waterhole, southern tiger corridors, sloth bear habitat',
    quota: 'Morning & Afternoon Shifts',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Zari+Gate+Tadoba'
  },
  {
    id: 'core-pangdi',
    name: 'Pangadi Gate',
    type: 'Core',
    description: 'Pangadi, Chandrapur, Maharashtra. Remote southern core gate offering exclusive, uncrowded wildlife encounters.',
    highlights: 'Pristine deep forest, wild dog packs, gaur herds',
    quota: 'Morning & Afternoon Shifts',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Pangadi+Gate+Tadoba'
  },
  // Buffer Gates
  {
    id: 'buf-agarzari',
    name: 'Agarzari Gate',
    type: 'Buffer',
    description: 'Agarzari, Chandrapur, Maharashtra. One of the most famous buffer gates with regular tiger and leopard sightings.',
    highlights: 'Agarzari lake, night safaris, excellent tiger tracking records',
    quota: 'Day & Night Drives Available',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Agarzari+Gate+Tadoba'
  },
  {
    id: 'buf-devada',
    name: 'Devada-Adegaon Gate',
    type: 'Buffer',
    description: 'Devada-Adegaon, Chandrapur, Maharashtra. Highly popular buffer zone near Moharli with prolific tiger movement.',
    highlights: 'Junona-Devada corridor, night drives, resident tigresses',
    quota: 'Day & Night Drives Available',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Devada+Adegaon+Gate+Tadoba'
  },
  {
    id: 'buf-adegaon',
    name: 'Adegaon Gate',
    type: 'Buffer',
    description: 'Adegaon, Chandrapur, Maharashtra. Rich scrub and mixed deciduous habitat with frequent predator activity.',
    highlights: 'Scenic waterbodies, active tiger corridor',
    quota: 'Buffer Quota Applies',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Adegaon+Gate+Tadoba'
  },
  {
    id: 'buf-junona',
    name: 'Junona Gate',
    type: 'Buffer',
    description: 'Junona, Chandrapur, Maharashtra. Located close to Moharli; renowned for night safaris and leopard sightings.',
    highlights: 'Junona waterhole, nocturnal wildlife, close to prime resorts',
    quota: 'Day & Night Drives Available',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Junona+Gate+Tadoba'
  },
  {
    id: 'buf-alizanza',
    name: 'Alizanza Gate',
    type: 'Buffer',
    description: 'Alizanza, Chandrapur, Maharashtra. Peaceful buffer zone with beautiful bamboo hills and birding spots.',
    highlights: 'Birdwatching, tranquil forest routes',
    quota: 'Buffer Quota Applies',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Alizanza+Gate+Tadoba'
  },
  {
    id: 'buf-madnapur',
    name: 'Madnapur Gate',
    type: 'Buffer',
    description: 'Madnapur, Chandrapur, Maharashtra. Located adjacent to Kolara; highly favored by northern resort guests.',
    highlights: 'Kolara buffer corridor, high tiger activity, waterbody checks',
    quota: 'Day & Night Drives Available',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Madnapur+Gate+Tadoba'
  },
  {
    id: 'buf-shirkheda',
    name: 'Shirkheda Gate',
    type: 'Buffer',
    description: 'Shirkheda, Chandrapur, Maharashtra. Dense buffer forest sector with rolling landscapes.',
    highlights: 'Wild boars, spotted deer herds, seasonal streams',
    quota: 'Buffer Quota Applies',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Shirkheda+Gate+Tadoba'
  },
  {
    id: 'buf-kolara-chauradeo',
    name: 'Kolara Chauradeo Gate',
    type: 'Buffer',
    description: 'Kolara Chauradeo, Chandrapur, Maharashtra. Key buffer zone on the northern rim with steady tiger presence.',
    highlights: 'Chauradeo hillock, northern predator corridor',
    quota: 'Buffer Quota Applies',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Kolara+Chauradeo+Gate+Tadoba'
  },
  {
    id: 'buf-palasgaon',
    name: 'Palasgaon Gate',
    type: 'Buffer',
    description: 'Palasgaon, Chandrapur, Maharashtra. Serene forest tracks ideal for offbeat safari enthusiasts.',
    highlights: 'Quiet tracking, sloth bears, diverse raptors',
    quota: 'Buffer Quota Applies',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Palasgaon+Gate+Tadoba'
  },
  {
    id: 'buf-belara',
    name: 'Belara Gate',
    type: 'Buffer',
    description: 'Belara, Chandrapur, Maharashtra. Buffer gateway connecting dense vegetation zones.',
    highlights: 'Lush greenery, herbivore herds',
    quota: 'Buffer Quota Applies',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Belara+Gate+Tadoba'
  },
  {
    id: 'buf-mamla',
    name: 'Mamla Gate',
    type: 'Buffer',
    description: 'Mamla, Chandrapur, Maharashtra. Known for good birding and quiet forest exploration.',
    highlights: 'Mamla lake, nocturnal tracking routes',
    quota: 'Buffer Quota Applies',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Mamla+Gate+Tadoba'
  },
  {
    id: 'buf-navegaon-ramdegi',
    name: 'Navegaon-Ramdegi Gate',
    type: 'Buffer',
    description: 'Navegaon-Ramdegi, Chandrapur, Maharashtra. Scenic buffer sector known for temple ruins, cliffs, and rich wildlife.',
    highlights: 'Ramdegi temple hills, scenic viewpoints, leopard habitats',
    quota: 'Buffer Quota Applies',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Navegaon+Ramdegi+Gate+Tadoba'
  },
  {
    id: 'buf-nimdhela',
    name: 'Nimdhela Gate',
    type: 'Buffer',
    description: 'Nimdhela, Chandrapur, Maharashtra. Close to Kolara, famous for frequent big cat tracking on scenic pathways.',
    highlights: 'Nimdhela meadow, waterholes, high big cat sightings',
    quota: 'Buffer Quota Applies',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Nimdhela+Gate+Tadoba'
  },
  {
    id: 'buf-aswal-chuha',
    name: 'Pangadi Aswal Chuha Gate',
    type: 'Buffer',
    description: 'Pangadi Aswal Chuha, Chandrapur, Maharashtra. Southern buffer with rugged charm and bear habitats.',
    highlights: 'Sloth bear territory, pristine untouched wilderness',
    quota: 'Buffer Quota Applies',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Pangadi+Aswal+Chuha+Gate+Tadoba'
  },
  {
    id: 'buf-keslaghat',
    name: 'Keslaghat Gate',
    type: 'Buffer',
    description: 'Keslaghat, Chandrapur, Maharashtra. Southern sector buffer gate with scenic rocky ridges.',
    highlights: 'Hilly terrain, raptors, tranquil forest trails',
    quota: 'Buffer Quota Applies',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Keslaghat+Gate+Tadoba'
  },
  {
    id: 'buf-zari-peth',
    name: 'Zari Peth Gate',
    type: 'Buffer',
    description: 'Zari Peth, Chandrapur, Maharashtra. Buffer section offering relaxed wilderness drives.',
    highlights: 'Waterbodies, dense teak groves',
    quota: 'Buffer Quota Applies',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Zari+Peth+Gate+Tadoba'
  },
  {
    id: 'buf-somnath',
    name: 'Somnath Gate',
    type: 'Buffer',
    description: 'Somnath, Chandrapur, Maharashtra. Serene eastern fringe buffer with lush seasonal flora.',
    highlights: 'Somnath river valley, off-the-beaten-path safari',
    quota: 'Buffer Quota Applies',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Somnath+Gate+Tadoba'
  }
];

const TADOBA_HISTORICAL_MILESTONES = [
  {
    year: '1935',
    stepNumber: '01',
    shortLabel: 'Game Sanctuary',
    title: 'Game Sanctuary Declared',
    description: 'Tadoba Lake area first protected as a game sanctuary under British forestry administration, laying the foundation for modern wildlife protection.',
    badge: 'First Protected Era'
  },
  {
    year: '1955',
    stepNumber: '02',
    shortLabel: 'National Park',
    title: 'Maharashtra’s 1st National Park',
    description: '116.54 sq km declared as Tadoba National Park, establishing it as the oldest and first ever National Park in the state of Maharashtra.',
    badge: 'Oldest in Maharashtra'
  },
  {
    year: '1986',
    stepNumber: '03',
    shortLabel: 'Andhari WLS',
    title: 'Andhari Wildlife Sanctuary Notified',
    description: '508.85 sq km of adjoining dense teak and bamboo forests officially notified as the Andhari Wildlife Sanctuary to safeguard wildlife corridors.',
    badge: 'Sanctuary Expansion'
  },
  {
    year: '1995',
    stepNumber: '04',
    shortLabel: 'Project Tiger',
    title: '41st Project Tiger Reserve (TATR)',
    description: 'Tadoba National Park and Andhari Sanctuary united to form the 41st Project Tiger Reserve in India, now celebrated worldwide as TATR.',
    badge: 'Project Tiger Notified'
  },
  {
    year: '2009',
    stepNumber: '05',
    shortLabel: 'TATRCF Foundation',
    title: 'TATR Conservation Foundation',
    description: 'Tadoba-Andhari Tiger Reserve Conservation Foundation constituted to empower eco-development, buffer zone stewardship, and local community welfare.',
    badge: 'Foundation Era'
  }
];

const TADOBA_SAFARI_TIMETABLE = [
  { season: '1 Apr to 30 Jun', slot: 'Afternoon', entryTime: '15:00 PM', exitTime: '19:00 PM' },
  { season: '1 Feb to 31 Mar', slot: 'Afternoon', entryTime: '14:30 PM', exitTime: '18:30 PM' },
  { season: '1 Jul to 30 Sep', slot: 'Full Day', entryTime: '05:45 AM', exitTime: '18:45 PM' },
  { season: '1 Jul to 30 Sep', slot: 'Afternoon', entryTime: '14:30 PM', exitTime: '18:30 PM' },
  { season: '1 Jul to 30 Sep', slot: 'Morning', entryTime: '6:00 AM', exitTime: '10:00 AM' },
  { season: '1 Mar to 30 Apr', slot: 'Morning', entryTime: '6:00 AM', exitTime: '10:00 AM' },
  { season: '1 Mar to 30 Apr', slot: 'Full Day', entryTime: '05:45 AM', exitTime: '18:45 PM' },
  { season: '1 May to 30 Jun', slot: 'Morning', entryTime: '5:30 AM', exitTime: '9:30 AM' },
  { season: '1 May to 30 Jun', slot: 'Full Day', entryTime: '05:15 AM', exitTime: '19:15 PM' },
  { season: '1 Nov to 31 Jan', slot: 'Afternoon', entryTime: '14:00 PM', exitTime: '18:00 PM' },
  { season: '1 Nov to 29 Feb', slot: 'Morning', entryTime: '6:00 AM', exitTime: '10:30 AM' },
  { season: '1 Nov to 29 Feb', slot: 'Full Day', entryTime: '06:15 AM', exitTime: '18:15 PM' },
  { season: '1 Oct to 31 Oct', slot: 'Morning', entryTime: '6:00 AM', exitTime: '10:00 AM' },
  { season: '1 Oct to 31 Oct', slot: 'Afternoon', entryTime: '14:30 PM', exitTime: '18:30 PM' },
  { season: '1 Oct to 31 Oct', slot: 'Full Day', entryTime: '05:45 AM', exitTime: '18:45 PM' }
];

const TADOBA_FAQS = [
  {
    question: '1. How many tigers are there in Tadoba Tiger Reserve?',
    answer:
      'Tadoba-Andhari Tiger Reserve is home to an estimated 100+ tigers across its core and buffer areas, making it one of the highest-density tiger reserves in Central India.'
  },
  {
    question: '2. Which safari gate is best for tiger sightings in Tadoba?',
    answer:
      'Moharli and Kolara are historically the most renowned core gates with extensive track networks. However, buffer gates like Agarzari, Devada, and Junona also offer phenomenal tiger and leopard sighting records.'
  },
  {
    question: '3. How far in advance should I book Tadoba safari permits?',
    answer:
      'Core zone permits open up to 60 to 120 days in advance on the official Maharashtra Forest Department portal. Because quotas are strictly limited, early booking is highly recommended, especially for peak weekends and holiday seasons.'
  },
  {
    question: '4. Are core zones closed during the monsoon season?',
    answer:
      'Yes, Tadoba’s core zones remain closed from July 1 to September 30 each year for wildlife breeding and terrain maintenance. Select buffer safari gates remain open year-round for eco-tourism.'
  },
  {
    question: '5. What is the key difference between Core and Buffer zones?',
    answer:
      'Core zones form the protected national park and sanctuary interior where human activity is strictly prohibited. Core gates are closed on Tuesdays. Buffer zones surround the core, offering regulated safaris, night drives, and nature walks (closed on Wednesdays).'
  }
];

const TadobaDetails = ({
  destination,
  resorts: _resorts,
  safariGates = TADOBA_MASTER_GATES
}: TadobaDetailsProps) => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'timings' | 'gates'>('vehicles');
  const [gateFilter, setGateFilter] = useState<'all' | 'Core' | 'Buffer'>('all');
  const [gateSearchQuery, setGateSearchQuery] = useState<string>('');
  const [timingSlotFilter, setTimingSlotFilter] = useState<'All' | 'Morning' | 'Afternoon' | 'Full Day'>('All');
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
    ? TADOBA_SAFARI_TIMETABLE
    : TADOBA_SAFARI_TIMETABLE.filter((t) => t.slot === timingSlotFilter);

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
    <div className="tadoba-page">
      {/* ================= 1. COMPACT LUXURY HERO SECTION ================= */}
      <section className="tadoba-hero">
        <img
          src={matkasur}
          alt={destination.name || 'Tadoba scenic background'}
          className="tadoba-hero-img"
        />

        <div className="tadoba-hero-overlay" />

        <div className="tadoba-hero-content">
          <div className="tadoba-hero-wrapper">
            <div className="tadoba-hero-eyebrow">
              <span className="tadoba-hero-sublocation">CHANDRAPUR, MAHARASHTRA</span>
            </div>

            <h1 className="tadoba-hero-title">
              {destination.name || 'Tadoba Andhari Tiger Reserve'}
            </h1>

            <p className="tadoba-hero-subtitle">
              Maharashtra’s oldest and premier tiger reserve, spanning 1,727 sq km of pristine teak forests, tranquil lakes, and one of Central India’s highest wild tiger densities.
            </p>

            <div className="tadoba-hero-actions">
              <Link
                to={`/trip-request/new?destination=${destination.id}`}
                className="tadoba-hero-cta"
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
                className="tadoba-hero-secondary"
              >
                <span>Explore Safari Gates</span>
                <Compass size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. FLOATING HORIZONTAL SECTION NAV ================= */}
      <div className="tadoba-nav-wrapper">
        <nav className="tadoba-sticky-nav" aria-label="Reserve Sections Navigation">
          <div className="tadoba-sticky-nav-inner">
            <div className="tadoba-sticky-nav-links">
              <button
                type="button"
                onClick={(e) => scrollToSection('about', e)}
                className={`tadoba-sticky-nav-link ${activeSection === 'about' ? 'active' : ''}`}
              >
                <TreePine size={16} />
                <span>Overview &amp; Habitat</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('history', e)}
                className={`tadoba-sticky-nav-link ${activeSection === 'history' ? 'active' : ''}`}
              >
                <History size={16} />
                <span>Milestones</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('safari-hub', e)}
                className={`tadoba-sticky-nav-link ${activeSection === 'safari-hub' ? 'active' : ''}`}
              >
                <Compass size={16} />
                <span>Safari Planning Hub</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('how-to-reach', e)}
                className={`tadoba-sticky-nav-link ${activeSection === 'how-to-reach' ? 'active' : ''}`}
              >
                <MapPin size={16} />
                <span>How to Reach</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection('faqs', e)}
                className={`tadoba-sticky-nav-link ${activeSection === 'faqs' ? 'active' : ''}`}
              >
                <HelpCircle size={16} />
                <span>FAQs</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* ================= 3. FULL-WIDTH LUXURY CONTAINER ================= */}
      <div className="tadoba-container">
        <main className="tadoba-main">
          {/* ================= SECTION 1: ABOUT & HABITAT ================= */}
          <section id="about" className="tadoba-card tadoba-about-card">
            <div className="tadoba-card-header">
              <span className="tadoba-card-eyebrow">ABOUT TADOBA</span>
              <h2 className="tadoba-card-title">The Land of Tigers</h2>
            </div>

            <div className="tadoba-about-body">
              <p>
                Tadoba-Andhari Tiger Reserve (TATR) is one of Central India's most iconic wildlife landscapes. Located in Maharashtra's Chandrapur district, it harmoniously combines Maharashtra's oldest national park <strong>(formed in 1955)</strong> with the Andhari Wildlife Sanctuary <strong>(formed in 1986)</strong>—celebrated as the <strong>"Jewel of Vidarbha"</strong> for its high predator density, rugged hills, and deep teak canopies. Home to <strong>more than 100 tigers</strong>, Tadoba is also home to a rich variety of wildlife, including leopards, sloth bears, wild dogs, gaur, sambar, chital, and numerous bird species.
              </p>
            </div>

            {/* Metric Stats Cards */}
            <div className="tadoba-stats-grid">
              <div className="tadoba-stat-card">
                <span className="tadoba-stat-value">~1,727.59</span>
                <span className="tadoba-stat-unit">SQ KM</span>
                <span className="tadoba-stat-label">TOTAL PROTECTED AREA</span>
              </div>

              <div className="tadoba-stat-card">
                <span className="tadoba-stat-value">~625.82</span>
                <span className="tadoba-stat-unit">SQ KM</span>
                <span className="tadoba-stat-label">PRISTINE CORE ZONE</span>
              </div>

              <div className="tadoba-stat-card">
                <span className="tadoba-stat-value">~1,101.77</span>
                <span className="tadoba-stat-unit">SQ KM</span>
                <span className="tadoba-stat-label">BUFFER CORRIDOR</span>
              </div>
            </div>

            {/* Story of Tadoba */}
            <div className="tadoba-story-card">
              <div className="tadoba-story-badge">
                <TreePine size={16} />
                <span>THE LEGEND OF TARU</span>
              </div>
              <h3 className="tadoba-story-title">The Folklore Behind the Name</h3>
              <p className="tadoba-story-text">
                Tadoba is named after <strong>Taru</strong>, a legendary Gond tribal chief who, according to local folklore, died while fighting a tiger. The local tribal communities consider him a protector and built a small sacred shrine in his memory near the peaceful banks of Tadoba Lake. Even today, local villagers and forest guides visit the shrine during annual festivals to seek his blessings and pray for safety in the forest.
              </p>
            </div>
          </section>

          {/* ================= SECTION 2: HISTORICAL MILESTONES ================= */}
          <section id="history" className="tadoba-card tadoba-history-card">
            <div className="tadoba-card-header">
              <span className="tadoba-card-eyebrow">CHRONICLES OF CONSERVATION</span>
              <h2 className="tadoba-card-title">Historical Milestones</h2>
              <p className="tadoba-card-subtitle">
                From protected forests to one of Maharashtra's premier tiger reserves — explore the key eras of Tadoba's conservation journey. Hover or tap any year to view details.
              </p>
            </div>

            {/* Interactive Horizontal Year Track */}
            <div className="tadoba-milestone-track-container">
              <div className="tadoba-milestone-track-line" />
              <div className="tadoba-milestone-nodes">
                {TADOBA_HISTORICAL_MILESTONES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveMilestoneIndex(idx)}
                    onMouseEnter={() => setActiveMilestoneIndex(idx)}
                    className={`tadoba-milestone-node ${activeMilestoneIndex === idx ? 'active' : ''}`}
                    aria-label={`Milestone year ${item.year}: ${item.title}`}
                  >
                    <span className="tadoba-milestone-node-dot" />
                    <span className="tadoba-milestone-node-year">{item.year}</span>
                    <span className="tadoba-milestone-node-label">{item.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Milestone Detail Card */}
            <div className="tadoba-milestone-detail-card">
              <div className="tadoba-milestone-detail-watermark">
                {TADOBA_HISTORICAL_MILESTONES[activeMilestoneIndex].year}
              </div>

              <div className="tadoba-milestone-detail-inner">
                <div className="tadoba-milestone-detail-top-badge">
                  <span className="tadoba-milestone-badge-pill">
                    <span className="tadoba-milestone-badge-dot" />
                    {TADOBA_HISTORICAL_MILESTONES[activeMilestoneIndex].badge}
                  </span>
                </div>

                <div className="tadoba-milestone-detail-body">
                  <div className="tadoba-milestone-detail-lead">
                    <span className="tadoba-milestone-detail-year-highlight">
                      {TADOBA_HISTORICAL_MILESTONES[activeMilestoneIndex].year}
                    </span>
                    <h3 className="tadoba-milestone-detail-title">
                      {TADOBA_HISTORICAL_MILESTONES[activeMilestoneIndex].title}
                    </h3>
                  </div>
                  <p className="tadoba-milestone-detail-desc">
                    {TADOBA_HISTORICAL_MILESTONES[activeMilestoneIndex].description}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 3: SAFARI PLANNING HUB ================= */}
          <section id="safari-hub" className="tadoba-card tadoba-safari-hub-card">
            <div className="tadoba-card-header">
              <span className="tadoba-card-eyebrow">SAFARI PLANNING &amp; GATES DIRECTORY</span>
              <h2 className="tadoba-card-title">Tadoba Safari Planning Hub</h2>
              <p className="tadoba-card-subtitle">
                Interactive directory of official safari vehicles, seasonal gate timings, and core vs. buffer gate locations.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="tadoba-hub-tabs">
              <button
                type="button"
                className={`tadoba-hub-tab ${activeTab === 'vehicles' ? 'active' : ''}`}
                onClick={() => setActiveTab('vehicles')}
              >
                <Car size={16} />
                <span>Vehicles &amp; Capacities</span>
              </button>

              <button
                type="button"
                className={`tadoba-hub-tab ${activeTab === 'timings' ? 'active' : ''}`}
                onClick={() => setActiveTab('timings')}
              >
                <Clock size={16} />
                <span>Shift Timings &amp; Rules</span>
              </button>

              <button
                type="button"
                className={`tadoba-hub-tab ${activeTab === 'gates' ? 'active' : ''}`}
                onClick={() => setActiveTab('gates')}
              >
                <MapPin size={16} />
                <span>Gates Directory ({safariGates.length})</span>
              </button>
            </div>

            {/* Tab 1: Vehicles & Capacities */}
            {activeTab === 'vehicles' && (
              <div className="tadoba-tab-pane">
                <div className="tadoba-vehicles-grid">
                  <div className="tadoba-vehicle-card">
                    <div className="tadoba-vehicle-header">
                      <div className="tadoba-vehicle-icon-wrap">
                        <Car size={24} />
                      </div>
                      <div>
                        <span className="tadoba-vehicle-tag">STANDARD SAFARI</span>
                        <h3 className="tadoba-vehicle-title">4x4 Open Safari Gypsy</h3>
                      </div>
                    </div>
                    <p className="tadoba-vehicle-desc">
                      Standard registered open 4x4 Gypsy vehicle operated for official forest safari drives across core and buffer routes.
                    </p>
                    <ul className="tadoba-vehicle-features">
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Permit Scope:</strong> Valid for 6 Core Gates &amp; 16 Buffer Gates</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Occupancy:</strong> As per registered vehicle permit limits</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Shift Types:</strong> Morning &amp; Afternoon Shifts</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Route Access:</strong> Approved core and buffer forest tracks</span>
                      </li>
                    </ul>
                  </div>

                  <div className="tadoba-vehicle-card">
                    <div className="tadoba-vehicle-header">
                      <div className="tadoba-vehicle-icon-wrap">
                        <Layers size={24} />
                      </div>
                      <div>
                        <span className="tadoba-vehicle-tag">SPECIAL SERVICE</span>
                        <h3 className="tadoba-vehicle-title">9-Seater Safari Cruiser</h3>
                      </div>
                    </div>
                    <p className="tadoba-vehicle-desc">
                      9-seater safari cruiser service operating on designated core routes in Tadoba.
                    </p>
                    <ul className="tadoba-vehicle-features">
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Route Scope:</strong> Moharli Core &amp; Kolara Core</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Booking Type:</strong> Individual seat booking</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Eligibility:</strong> Available for Chandrapur district locals</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} />
                        <span><strong>Allocation:</strong> Subject to availability</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Timings & Rules */}
            {activeTab === 'timings' && (
              <div className="tadoba-tab-pane">
                <div className="tadoba-timings-filter-bar">
                  <div className="tadoba-timings-filter-buttons">
                    {(['All', 'Morning', 'Afternoon', 'Full Day'] as const).map((slot) => {
                      const count = slot === 'All'
                        ? TADOBA_SAFARI_TIMETABLE.length
                        : TADOBA_SAFARI_TIMETABLE.filter((t) => t.slot === slot).length;
                      return (
                        <button
                          key={slot}
                          type="button"
                          className={`tadoba-timing-filter-btn ${timingSlotFilter === slot ? 'active' : ''}`}
                          onClick={() => setTimingSlotFilter(slot)}
                        >
                          {slot === 'All' ? 'All Slots' : slot} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="tadoba-timings-table-wrapper compact">
                  <table className="tadoba-timings-table compact">
                    <thead>
                      <tr>
                        <th>Safari Season</th>
                        <th>Slot</th>
                        <th>Entry Time</th>
                        <th>Exit Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTimings.map((row, idx) => (
                        <tr key={idx}>
                          <td className="tadoba-timing-season"><strong>{row.season}</strong></td>
                          <td className="tadoba-timing-slot">{row.slot}</td>
                          <td className="tadoba-timing-time">{row.entryTime}</td>
                          <td className="tadoba-timing-time">{row.exitTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Closure Warnings */}
                <div className="tadoba-closure-box compact">
                  <div className="tadoba-closure-item">
                    <AlertTriangle className="tadoba-closure-icon" size={16} />
                    <div>
                      <strong>Tuesday Core Closure:</strong> All Core safari gates are closed every Tuesday.
                    </div>
                  </div>
                  <div className="tadoba-closure-item">
                    <AlertTriangle className="tadoba-closure-icon" size={16} />
                    <div>
                      <strong>Wednesday Buffer Closure:</strong> All Buffer safari gates are closed on Wednesdays.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Gates Directory */}
            {activeTab === 'gates' && (
              <div className="tadoba-tab-pane">
                <div className="tadoba-gates-filter-bar">
                  <div className="tadoba-gates-filter-buttons">
                    <button
                      type="button"
                      className={`tadoba-gate-filter-btn ${gateFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setGateFilter('all')}
                    >
                      All Safari Gates ({safariGates.length})
                    </button>
                    <button
                      type="button"
                      className={`tadoba-gate-filter-btn ${gateFilter === 'Core' ? 'active' : ''}`}
                      onClick={() => setGateFilter('Core')}
                    >
                      Core Gates ({coreGatesCount})
                    </button>
                    <button
                      type="button"
                      className={`tadoba-gate-filter-btn ${gateFilter === 'Buffer' ? 'active' : ''}`}
                      onClick={() => setGateFilter('Buffer')}
                    >
                      Buffer Gates ({bufferGatesCount})
                    </button>
                  </div>

                  <div className="tadoba-gates-search-box">
                    <Search size={15} className="tadoba-gates-search-icon" />
                    <input
                      type="text"
                      value={gateSearchQuery}
                      onChange={(e) => setGateSearchQuery(e.target.value)}
                      placeholder="Search gate name..."
                      className="tadoba-gates-search-input"
                    />
                  </div>
                </div>

                <div className="tadoba-gates-compact-grid">
                  {filteredGates.map((gate) => (
                    <div key={gate.id} className={`tadoba-gate-compact-card ${gate.type.toLowerCase()}`}>
                      <div className="tadoba-gate-compact-main">
                        <span className={`tadoba-gate-type-badge ${gate.type.toLowerCase()}`}>
                          {gate.type} Gate
                        </span>
                        <h4 className="tadoba-gate-compact-name">{gate.name}</h4>
                      </div>

                      {gate.mapLink && (
                        <a
                          href={gate.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tadoba-gate-compact-map-btn"
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
                  <div className="tadoba-gates-empty-state">
                    <p>No safari gates found matching "{gateSearchQuery}".</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ================= SECTION 4: HOW TO REACH ================= */}
          <section id="how-to-reach" className="tadoba-card tadoba-reach-card">
            <div className="tadoba-card-header">
              <span className="tadoba-card-eyebrow">TRAVEL &amp; CONNECTIVITY</span>
              <h2 className="tadoba-card-title">How to Reach Tadoba</h2>
              <p className="tadoba-card-subtitle">
                Centrally connected in Maharashtra and easily accessible via major airports, railheads, and all-weather national highway networks.
              </p>
            </div>

            <div className="tadoba-reach-grid">
              {/* By Air */}
              <div className="tadoba-reach-card-item air">
                <div className="tadoba-reach-card-top">
                  <div className="tadoba-reach-icon-badge air">
                    <Plane size={20} />
                  </div>
                  <span className="tadoba-reach-pill air">BY AIR</span>
                </div>

                <div className="tadoba-reach-card-main">
                  <h3 className="tadoba-reach-title">Nagpur Airport (NAG)</h3>
                  <p className="tadoba-reach-desc">
                    Dr. Babasaheb Ambedkar International Airport is the primary aviation hub with direct daily flights from all major Indian metros.
                  </p>
                </div>

                <div className="tadoba-reach-meta-box">
                  <div className="tadoba-reach-stat">
                    <span className="tadoba-reach-stat-label">Distance</span>
                    <span className="tadoba-reach-stat-val">~140 km</span>
                  </div>
                  <div className="tadoba-reach-stat">
                    <span className="tadoba-reach-stat-label">Drive Time</span>
                    <span className="tadoba-reach-stat-val">~2.5 – 3 hrs</span>
                  </div>
                </div>
              </div>

              {/* By Rail */}
              <div className="tadoba-reach-card-item rail">
                <div className="tadoba-reach-card-top">
                  <div className="tadoba-reach-icon-badge rail">
                    <Train size={20} />
                  </div>
                  <span className="tadoba-reach-pill rail">BY RAIL</span>
                </div>

                <div className="tadoba-reach-card-main">
                  <h3 className="tadoba-reach-title">Chandrapur &amp; Nagpur Jn</h3>
                  <p className="tadoba-reach-desc">
                    Chandrapur is the closest railhead (45 km). Nagpur Junction (140 km) connects superfast expresses nationwide.
                  </p>
                </div>

                <div className="tadoba-reach-meta-box">
                  <div className="tadoba-reach-stat">
                    <span className="tadoba-reach-stat-label">Chandrapur (CD)</span>
                    <span className="tadoba-reach-stat-val">~45 km (~1 hr)</span>
                  </div>
                  <div className="tadoba-reach-stat">
                    <span className="tadoba-reach-stat-label">Nagpur Jn (NGP)</span>
                    <span className="tadoba-reach-stat-val">~140 km (~3 hrs)</span>
                  </div>
                </div>
              </div>

              {/* By Road */}
              <div className="tadoba-reach-card-item road">
                <div className="tadoba-reach-card-top">
                  <div className="tadoba-reach-icon-badge road">
                    <Car size={20} />
                  </div>
                  <span className="tadoba-reach-pill road">BY ROAD</span>
                </div>

                <div className="tadoba-reach-card-main">
                  <h3 className="tadoba-reach-title">Highway Corridors</h3>
                  <p className="tadoba-reach-desc">
                    Well-paved state &amp; national highway corridors connecting key regional cities to Tadoba gates.
                  </p>
                </div>

                <div className="tadoba-reach-cities-grid">
                  <div className="tadoba-reach-city-chip">
                    <span className="city">Nagpur</span>
                    <span className="dist">140 km</span>
                  </div>
                  <div className="tadoba-reach-city-chip">
                    <span className="city">Chandrapur</span>
                    <span className="dist">45 km</span>
                  </div>
                  <div className="tadoba-reach-city-chip">
                    <span className="city">Hyderabad</span>
                    <span className="dist">435 km</span>
                  </div>
                  <div className="tadoba-reach-city-chip">
                    <span className="city">Pune / Mumbai</span>
                    <span className="dist">720 / 850 km</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 5: FAQS ================= */}
          <section id="faqs" className="tadoba-card tadoba-faqs-card">
            <div className="tadoba-card-header">
              <span className="tadoba-card-eyebrow">COMMON QUERIES</span>
              <h2 className="tadoba-card-title">Frequently Asked Questions</h2>
              <p className="tadoba-card-subtitle">
                Essential planning rules, permit timelines, and expert wildlife travel guidance.
              </p>
            </div>

            <div className="tadoba-faqs-list">
              {TADOBA_FAQS.map((faq, index) => (
                <div
                  key={index}
                  className={`tadoba-faq-item ${openFaqIndex === index ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    className="tadoba-faq-question-btn"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`tadoba-faq-chevron ${openFaqIndex === index ? 'rotate' : ''}`}
                      size={18}
                    />
                  </button>

                  {openFaqIndex === index && (
                    <div className="tadoba-faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ================= SECTION 6: FINAL LUXURY CTA ================= */}
          <section className="tadoba-final-cta-card">
            <div className="tadoba-final-cta-content">


              <h2 className="tadoba-final-cta-title">
                Ready for an Unforgettable Tadoba Safari?
              </h2>
              <p className="tadoba-final-cta-desc">
                Let our dedicated safari specialists curate your permits, handpicked resort stays, and naturalist-guided jeep drives across Tadoba's prime zones.
              </p>

              <div className="tadoba-final-cta-actions">
                <Link
                  to={`/trip-request/new?destination=${destination.id}`}
                  className="tadoba-final-cta-btn"
                >
                  <span>Request a Custom Proposal</span>
                  <ArrowUpRight size={18} />
                </Link>
              </div>

              <div className="tadoba-final-cta-trust">
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

export default TadobaDetails;