import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  History,
  ArrowDown,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Compass,
  AlertTriangle
} from 'lucide-react';

import { Destination } from '../../services/destination.service';
import { Resort } from '../../services/resort.service';


import matkasur from "../../assets/Tiger&Logo Image/Matkasur.JPG";
import matkasur2 from "../../assets/Tiger&Logo Image/Matkasur2.JPG";
import maya from "../../assets/Tiger&Logo Image/Maya.jpg";
import tadoba from "../../assets/Tiger&Logo Image/Tadoba.jpg";
import kuwani from "../../assets/Tiger&Logo Image/Kuwani.JPG";
import leopard from "../../assets/Tiger&Logo Image/Leopard.JPG";

const CAROUSEL_IMAGES = [
  matkasur,
  matkasur2,
  maya,
  tadoba,
  kuwani,
  leopard,
];

interface SafariGate {
  id: string;
  name: string;
  type: 'Core' | 'Buffer';
  description: string;
  mapLink?: string;
}

interface TadobaDetailsProps {
  destination: Destination;
  resorts: Resort[];
  safariGates?: SafariGate[];
}

const TADOBA_MASTER_GATES: SafariGate[] = [
  {
    id: 'core-moharli',
    name: 'Moharli Gate',
    type: 'Core',
    description: 'Moharli, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Moharli+Gate+Tadoba'
  },
  {
    id: 'core-kolara',
    name: 'Kolara Gate',
    type: 'Core',
    description: 'Kolara, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Kolara+Gate+Tadoba'
  },
  {
    id: 'core-khutwanda',
    name: 'Khutwanda Gate',
    type: 'Core',
    description: 'Khutwanda, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Khutwanda+Gate+Tadoba'
  },
  {
    id: 'core-navegaon',
    name: 'Navegaon Gate',
    type: 'Core',
    description: 'Navegaon, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Navegaon+Gate+Tadoba'
  },
  {
    id: 'core-zari',
    name: 'Zari Gate',
    type: 'Core',
    description: 'Zari, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Zari+Gate+Tadoba'
  },
  {
    id: 'core-pangdi',
    name: 'Pangadi Gate',
    type: 'Core',
    description: 'Pangadi, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Pangadi+Gate+Tadoba'
  },
  {
    id: 'buf-agarzari',
    name: 'Agarzari Gate',
    type: 'Buffer',
    description: 'Agarzari, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Agarzari+Gate+Tadoba'
  },
  {
    id: 'buf-devada',
    name: 'Devada-Adegaon Gate',
    type: 'Buffer',
    description: 'Devada-Adegaon, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Devada+Adegaon+Gate+Tadoba'
  },
  {
    id: 'buf-adegaon',
    name: 'Adegaon Gate',
    type: 'Buffer',
    description: 'Adegaon, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Adegaon+Gate+Tadoba'
  },
  {
    id: 'buf-junona',
    name: 'Junona Gate',
    type: 'Buffer',
    description: 'Junona, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Junona+Gate+Tadoba'
  },
  {
    id: 'buf-alizanza',
    name: 'Alizanza Gate',
    type: 'Buffer',
    description: 'Alizanza, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Alizanza+Gate+Tadoba'
  },
  {
    id: 'buf-madnapur',
    name: 'Madnapur Gate',
    type: 'Buffer',
    description: 'Madnapur, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Madnapur+Gate+Tadoba'
  },
  {
    id: 'buf-shirkheda',
    name: 'Shirkheda Gate',
    type: 'Buffer',
    description: 'Shirkheda, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Shirkheda+Gate+Tadoba'
  },
  {
    id: 'buf-kolara-chauradeo',
    name: 'Kolara Chauradeo Gate',
    type: 'Buffer',
    description: 'Kolara Chauradeo, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Kolara+Chauradeo+Gate+Tadoba'
  },
  {
    id: 'buf-palasgaon',
    name: 'Palasgaon Gate',
    type: 'Buffer',
    description: 'Palasgaon, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Palasgaon+Gate+Tadoba'
  },
  {
    id: 'buf-belara',
    name: 'Belara Gate',
    type: 'Buffer',
    description: 'Belara, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Belara+Gate+Tadoba'
  },
  {
    id: 'buf-mamla',
    name: 'Mamla Gate',
    type: 'Buffer',
    description: 'Mamla, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Mamla+Gate+Tadoba'
  },
  {
    id: 'buf-navegaon-ramdegi',
    name: 'Navegaon-Ramdegi Gate',
    type: 'Buffer',
    description: 'Navegaon-Ramdegi, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Navegaon+Ramdegi+Gate+Tadoba'
  },
  {
    id: 'buf-nimdhela',
    name: 'Nimdhela Gate',
    type: 'Buffer',
    description: 'Nimdhela, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Nimdhela+Gate+Tadoba'
  },
  {
    id: 'buf-aswal-chuha',
    name: 'Pangadi Aswal Chuha Gate',
    type: 'Buffer',
    description: 'Pangadi, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Pangadi+Aswal+Chuha+Gate+Tadoba'
  },
  {
    id: 'buf-keslaghat',
    name: 'Keslaghat Gate',
    type: 'Buffer',
    description: 'Keslaghat, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Keslaghat+Gate+Tadoba'
  },
  {
    id: 'buf-zari-peth',
    name: 'Zari Peth Gate',
    type: 'Buffer',
    description: 'Zari Peth, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Zari+Peth+Gate+Tadoba'
  },
  {
    id: 'buf-somnath',
    name: 'Somnath Gate',
    type: 'Buffer',
    description: 'Somnath, Chandrapur, Maharashtra.',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Somnath+Gate+Tadoba'
  }
];

const FAQS = [
  {
    question: "How many tigers are there in Tadoba Tiger Reserve?",
    answer: "Tadoba-Andhari Tiger Reserve is home to an estimated 100+ tigers across its core and buffer areas, making it one of the highest-density tiger reserves in Central India."
  },
  {
    question: "Which safari gate is best for tiger sightings in Tadoba?",
    answer: "Moharli and Kolara are historically the most renowned core gates with extensive track networks. However, buffer gates like Agarzari, Devada, and Junona also offer phenomenal tiger and leopard sighting records."
  },
  {
    question: "How far in advance should I book Tadoba safari permits?",
    answer: "Core zone permits open up to 60 to 120 days in advance on the official forest portal. Because quotas are strictly limited, early booking is highly recommended, especially for peak weekends and holiday seasons."
  },
  {
    question: "Are core zones closed during the monsoon season?",
    answer: "Yes, Tadoba's core zones remain closed from July 1 to September 30 each year for wildlife breeding and terrain maintenance. Select buffer safari gates remain open year-round for eco-tourism."
  },
  {
    question: "What is the key difference between Core and Buffer zones?",
    answer: "Core zones form the protected national park and sanctuary interior where human activity is strictly prohibited. Buffer zones surround the core, offering regulated safaris, night drives, and nature walks while serving as essential wildlife corridors."
  }
];

const TadobaDetails = ({
  destination,
  resorts: _resorts,
  safariGates = TADOBA_MASTER_GATES
}: TadobaDetailsProps) => {

  const [activeIndex, setActiveIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_IMAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (!destination) return null;

  const coreGates = safariGates.filter(gate => gate.type === 'Core');
  const bufferGates = safariGates.filter(gate => gate.type === 'Buffer');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="dest-details-page">

      {/* ================= 1. HERO ================= */}
      <section className="dest-details-hero">

        {CAROUSEL_IMAGES.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Tadoba background ${index + 1}`}
            className={`dest-details-hero-img ${index === activeIndex ? "active" : ""}`}
          />
        ))}

        <div className="dest-details-hero-overlay" />

        <div className="dest-details-hero-content">
          <div className="dest-details-hero-wrapper">
            <h1 className="dest-details-hero-title">
              {destination.name}
            </h1>

            <p className="dest-details-hero-subtitle">
              Experience the Wild of Tadoba — meet majestic tigers, explore ancient teak forests, and create lasting memories.
            </p>

            <div className="dest-details-hero-meta">
              <div className="dest-details-hero-meta-item">
                <MapPin className="dest-details-hero-meta-icon" />
                <span>{destination.state}, India</span>
              </div>
            </div>

            <div className="dest-details-hero-actions">
              <Link
                to={`/trip-request/new?destination=${destination.id}`}
                className="dest-details-hero-cta"
              >
                Plan Your Safari
                <ArrowUpRight size={18} />
              </Link>

              <a
                href="#destination-overview"
                onClick={(e) => {
                  e.preventDefault();
                  const elem = document.getElementById("destination-overview");
                  if (elem) {
                    elem.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="dest-details-hero-secondary"
              >
                Explore destination
                <ArrowDown size={17} />
              </a>
            </div>
          </div>
        </div>

        <div className="dest-details-hero-counter">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span>/</span>
          <span>{String(CAROUSEL_IMAGES.length).padStart(2, "0")}</span>
        </div>

      </section>


      {/* ================= MAIN CONTAINER ================= */}
      <div
        className="dest-details-container"
      >

        <div className="dest-details-layout">
          {/* ================= MAIN CONTENT ================= */}
          <main className="dest-details-main">

            {/* ================= 1. ABOUT TADOBA → Overview ================= */}
            <section id="destination-overview" className="dest-details-card dest-details-about-card">
              <div className="dest-details-about-header">
                <div className="dest-details-about-header-text">
                  <div className="dest-details-about-eyebrow">
                    ABOUT TADOBA
                  </div>
                  <h2 className="dest-details-about-title">
                    The Land of Tigers
                  </h2>
                </div>
              </div>

              <div className="dest-details-about-intro">
                <p>
                  Tadoba-Andhari Tiger Reserve (TATR) is one of Central India's most
                  iconic wildlife landscapes. Located in Maharashtra's Chandrapur
                  district, it harmoniously combines Maharashtra's oldest national park
                  <strong> (formed in 1955)</strong> with the Andhari Wildlife Sanctuary
                  <strong> (formed in 1986)</strong>—celebrated as the
                  <strong> "Jewel of Vidarbha"</strong> for its high predator density,
                  rugged hills, and deep teak canopies. Home to
                  <strong> more than 100 tigers</strong>, Tadoba is also home to a rich
                  variety of wildlife, including leopards, sloth bears, wild dogs,
                  gaur, sambar, chital, and numerous bird species.
                </p>
              </div>

              {/* 3 Metric Stats Grid */}
              <div className="dest-details-about-stats-grid">
                <div className="dest-details-about-stat-card">
                  <div className="dest-details-about-stat-value">~1,727.59</div>
                  <div className="dest-details-about-stat-label">SQ KM</div>
                  <div className="dest-details-about-stat-sub">TOTAL AREA</div>
                </div>

                <div className="dest-details-about-stat-card">
                  <div className="dest-details-about-stat-value">~625.82</div>
                  <div className="dest-details-about-stat-label">SQ KM</div>
                  <div className="dest-details-about-stat-sub">CORE ZONE</div>
                </div>

                <div className="dest-details-about-stat-card">
                  <div className="dest-details-about-stat-value">~1,101.77</div>
                  <div className="dest-details-about-stat-label">SQ KM</div>
                  <div className="dest-details-about-stat-sub">BUFFER ZONE</div>
                </div>
              </div>

              {/* Divider */}
              <div className="dest-details-about-divider" />

              {/* THE STORY OF TADOBA */}
              <div className="dest-details-about-subsection">
                <h3 className="dest-details-about-subtitle">
                  THE STORY OF TADOBA
                </h3>
                <div className="dest-details-about-story-content">
                  <p>
                    Tadoba is named after <strong>Taru</strong>, a legendary Gond tribal chief
                    who, according to local stories, died while fighting a tiger. The local
                    tribal communities consider him a protector and built a small sacred shrine
                    in his memory near the peaceful banks of Tadoba Lake. Even today, local
                    villagers and forest guides visit the shrine during annual festivals to seek
                    his blessings and pray for safety in the forest.
                  </p>
                </div>
              </div>
            </section>


            {/* ================= 2. HISTORY & LEGACY → History ================= */}
            <section id="history-legacy" className="dest-details-card dest-details-history-card">
              <div className="dest-details-history-header">
                <div className="dest-details-about-eyebrow" style={{ marginBottom: '0.4rem' }}>
                </div>
                <div className="dest-details-history-title-wrap">
                  <History className="dest-details-card-icon" size={24} />
                  <h2 className="dest-details-history-title">HISTORY &amp; LEGACY</h2>
                </div>
                <p className="dest-details-history-subtitle">
                  From protected forests to one of Maharashtra's most important tiger reserves — Tadoba's conservation journey spans nearly a century.
                </p>
              </div>

              <div className="dest-details-history-timeline-container">
                <div className="dest-details-history-timeline-track" />

                <div className="dest-details-history-timeline-grid">
                  {/* 1935 */}
                  <div className="dest-details-history-timeline-item">
                    <div className="dest-details-history-year">1935</div>
                    <div className="dest-details-history-dot" />
                    <div className="dest-details-history-content">
                      <h4 className="dest-details-history-event-title">PROTECTED SANCTUARY</h4>
                      <p className="dest-details-history-event-desc">
                        Tadoba Lake area protected as a sanctuary.
                      </p>
                    </div>
                  </div>

                  {/* 1955 */}
                  <div className="dest-details-history-timeline-item">
                    <div className="dest-details-history-year">1955</div>
                    <div className="dest-details-history-dot" />
                    <div className="dest-details-history-content">
                      <h4 className="dest-details-history-event-title">NATIONAL PARK</h4>
                      <p className="dest-details-history-event-desc">
                        Tadoba National Park declared.
                      </p>
                    </div>
                  </div>

                  {/* 1986 */}
                  <div className="dest-details-history-timeline-item">
                    <div className="dest-details-history-year">1986</div>
                    <div className="dest-details-history-dot" />
                    <div className="dest-details-history-content">
                      <h4 className="dest-details-history-event-title">ANDHARI SANCTUARY</h4>
                      <p className="dest-details-history-event-desc">
                        Andhari Wildlife Sanctuary declared.
                      </p>
                    </div>
                  </div>

                  {/* 1995 */}
                  <div className="dest-details-history-timeline-item">
                    <div className="dest-details-history-year">1995</div>
                    <div className="dest-details-history-dot" />
                    <div className="dest-details-history-content">
                      <h4 className="dest-details-history-event-title">TATR NOTIFIED</h4>
                      <p className="dest-details-history-event-desc">
                        Tadoba &amp; Andhari brought together.
                      </p>
                    </div>
                  </div>

                  {/* 2009 */}
                  <div className="dest-details-history-timeline-item">
                    <div className="dest-details-history-year">2009</div>
                    <div className="dest-details-history-dot" />
                    <div className="dest-details-history-content">
                      <h4 className="dest-details-history-event-title">TATRCF FORMED</h4>
                      <p className="dest-details-history-event-desc">
                        Dedicated conservation foundation established.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>


            {/* ================= 3. SAFARI EXPERIENCES & BOOKINGS → Safari Experience ================= */}
            <section id="safari-experience" className="dest-details-card dest-details-safari-exp-card">
              <div className="dest-details-safari-header">

                <h2 className="dest-details-card-title">
                  Safari Experiences &amp; Bookings
                </h2>
                <p className="dest-details-safari-subtitle">
                  Guided safaris across Tadoba's Core &amp; Buffer zones
                </p>
                <div className="dest-details-disclaimer-note">
                  <AlertTriangle className="dest-details-disclaimer-icon" size={16} />
                  <span>Note: We are not the official Tadoba website. Official Gypsy permits are subject to availability.</span>
                </div>
              </div>

              {/* Vehicle Options Grid (Gypsy vs Canter) */}
              <div className="dest-details-safari-vehicles-grid">
                {/* Gypsy Card */}
                <div className="dest-details-safari-vehicle-card">
                  <div className="dest-details-vehicle-header">
                    <div className="dest-details-vehicle-title-wrap">
                      <h3 className="dest-details-vehicle-title">GYPSY SAFARI</h3>
                    </div>
                  </div>
                  <ul className="dest-details-vehicle-list">
                    <li><CheckCircle2 className="dest-details-vehicle-check" /> Core & Buffer</li>
                    <li><CheckCircle2 className="dest-details-vehicle-check" /> Morning / Afternoon/Full Day</li>
                    <li><CheckCircle2 className="dest-details-vehicle-check" /> Capacity : 6 tourists</li>
                  </ul>
                </div>

                {/* Canter Card */}
                <div className="dest-details-safari-vehicle-card">
                  <div className="dest-details-vehicle-header">
                    <div className="dest-details-vehicle-title-wrap">
                      <h3 className="dest-details-vehicle-title">CANTER SAFARI</h3>
                    </div>
                  </div>
                  <ul className="dest-details-vehicle-list">
                    <li><CheckCircle2 className="dest-details-vehicle-check" /> Budget-friendly</li>
                    <li><CheckCircle2 className="dest-details-vehicle-check" /> Selected routes</li>
                    <li><CheckCircle2 className="dest-details-vehicle-check" /> Capacity: 15+ tourists</li>
                  </ul>
                </div>
              </div>

              {/* Safari Timings Block */}
              <div className="dest-details-timings-box">
                <h4 className="dest-details-timings-title">
                  <Clock size={20} />
                  Tadoba Wildlife Safari Timings
                </h4>
                <p className="dest-details-timings-desc">
                  Safari timings in Tadoba National Park depend on the season. The park remains closed in the monsoon.
                </p>

                <div className="dest-details-timings-table-container">
                  <table className="dest-details-timings-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Morning Shift</th>
                        <th>Afternoon Shift</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>October 1st – 31st</td>
                        <td>6 AM – 10 AM</td>
                        <td>2:30 PM – 6:30 PM</td>
                      </tr>
                      <tr>
                        <td>November – February</td>
                        <td>6:30 AM – 10:30 AM</td>
                        <td>2 PM – 6 PM</td>
                      </tr>
                      <tr>
                        <td>March – April</td>
                        <td>6 AM – 10 AM</td>
                        <td>2:30 PM – 6:30 PM</td>
                      </tr>
                      <tr>
                        <td>May – June</td>
                        <td>5:30 AM – 9:30 AM</td>
                        <td>3 PM – 7 PM</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Proposal Banner */}
              <div className="dest-details-proposal-banner">
                <div className="dest-details-proposal-banner-content">
                  <div className="dest-details-proposal-banner-icon-wrap">
                    <Compass className="dest-details-proposal-banner-icon" />
                  </div>
                  <p className="dest-details-proposal-banner-text">
                    Planning a safari? Share your preferred date &amp; requirements and receive a personalized safari proposal.
                  </p>
                </div>
                <div className="dest-details-proposal-banner-action">
                  <Link
                    to={`/trip-request/new?destination=${destination.id}`}
                    className="dest-details-proposal-banner-btn"
                  >
                    REQUEST SAFARI PROPOSAL
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </section>


            {/* ================= 4. BEST TIME TO VISIT → Best Time ================= */}
            <section id="best-time" className="dest-details-card dest-details-seasons-section">

              <h2 className="dest-details-card-title">
                Best Time to Visit Tadoba
              </h2>

              <div className="dest-details-seasons-header-note">
                <h3 className="dest-details-seasons-headline">
                  NO SINGLE BEST SEASON — JUST A DIFFERENT TADOBA.
                </h3>
                <p className="dest-details-seasons-subline">
                  Visit anytime and experience the forest your way.
                </p>
              </div>
            </section>


            {/* ================= 5. SAFARI GATES → Safari Gates ================= */}
            <section id="safari-gates" className="dest-details-card">

              <h2 className="dest-details-card-title">
                Core Safari Gates
              </h2>

              <p className="dest-details-section-info">
                Core zones are the <strong>protected heart of Tadoba</strong>. Core gates are <strong>closed every Tuesday</strong>.
              </p>

              <div className="dest-details-gates-grid dest-details-core-gates-grid">
                {coreGates.map((gate) => (
                  <div
                    key={gate.id}
                    className="dest-details-gate-card core-compact"
                  >
                    <span className="dest-details-gate-name">
                      {gate.name}
                    </span>

                    {gate.mapLink && (
                      <a
                        href={gate.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dest-details-gate-map-btn"
                        title={`View ${gate.name} location`}
                      >
                        <MapPin size={14} />
                        <span>Locate</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                <h3 className="dest-details-card-title" style={{ fontSize: '1.5rem' }}>
                  Buffer Safari Gates
                </h3>
                <p className="dest-details-section-info" style={{ marginBottom: '1.25rem' }}>
                  Buffer zones surround core areas and offer rich wildlife tracking. <strong>Buffer gates are closed on Wednesdays.</strong>
                </p>

                <div className="dest-details-gates-grid dest-details-buffer-gates-grid">
                  {bufferGates.map((gate) => (
                    <div
                      key={gate.id}
                      className="dest-details-gate-card buffer-compact"
                    >
                      <span className="dest-details-gate-name">
                        {gate.name}
                      </span>

                      {gate.mapLink && (
                        <a
                          href={gate.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dest-details-gate-map-btn"
                          title={`View ${gate.name} location`}
                        >
                          <MapPin size={14} />
                          <span>Locate</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>


            {/* ================= 6. HOW TO REACH TADOBA → How to Reach ================= */}
            <section id="how-to-reach" className="dest-details-card dest-details-reach-section">

              <h2 className="dest-details-card-title">
                How to Reach Tadoba ?
              </h2>

              <p className="dest-details-section-info">
                Tadoba can be reached by air, rail and road.
              </p>

              <div className="dest-details-reach-grid">
                {/* NEAREST AIRPORT */}
                <div className="dest-details-reach-card">
                  <div className="dest-details-reach-header">
                    <span className="dest-details-reach-tag">NEAREST AIRPORT</span>
                  </div>

                  <div className="dest-details-reach-body">
                    <h3 className="dest-details-reach-main-title">
                      Nagpur Airport
                    </h3>
                    <p className="dest-details-reach-sub-info">
                      Dr. Babasaheb Ambedkar International Airport
                    </p>
                  </div>

                  <div className="dest-details-reach-footer">
                    <span className="dest-details-reach-note">
                      Major airport for Tadoba (~140 km)
                    </span>
                  </div>
                </div>

                {/* NEAREST RAILWAY STATION */}
                <div className="dest-details-reach-card">
                  <div className="dest-details-reach-header">
                    <span className="dest-details-reach-tag">NEAREST RAILWAY STATION</span>
                  </div>

                  <div className="dest-details-reach-body">
                    <h3 className="dest-details-reach-main-title">
                      Chandrapur Railway Station
                    </h3>
                    <p className="dest-details-reach-sub-info">
                      Closest major rail connection
                    </p>
                  </div>

                  <div className="dest-details-reach-footer">
                    <span className="dest-details-reach-note">
                      ~45 km from Moharli Gate
                    </span>
                  </div>
                </div>

                {/* BY ROAD */}
                <div className="dest-details-reach-card">
                  <div className="dest-details-reach-header">
                    <span className="dest-details-reach-tag">BY ROAD</span>
                  </div>

                  <div className="dest-details-reach-body dest-details-reach-road-body">
                    <div className="dest-details-reach-road-row">
                      <span className="dest-details-reach-city">Nagpur</span>
                      <span className="dest-details-reach-dist">~140 km</span>
                    </div>
                    <div className="dest-details-reach-road-row">
                      <span className="dest-details-reach-city">Hyderabad</span>
                      <span className="dest-details-reach-dist">~450 km</span>
                    </div>
                    <div className="dest-details-reach-road-row">
                      <span className="dest-details-reach-city">Mumbai</span>
                      <span className="dest-details-reach-dist">~850 km</span>
                    </div>
                  </div>

                  <div className="dest-details-reach-footer">
                    <span className="dest-details-reach-note">
                      Approx. distance by road to primary gates
                    </span>
                  </div>
                </div>
              </div>
            </section>


            {/* ================= 7. FAQS ================= */}
            <section id="faqs" className="dest-details-card dest-details-faq-section">
              <h2 className="dest-details-card-title">
                Frequently Asked Questions
              </h2>
              <p className="dest-details-section-info">
                Common questions answered about planning a safari in Tadoba.
              </p>

              <div className="dest-details-faq-list">
                {FAQS.map((faq, index) => (
                  <div
                    key={index}
                    className={`dest-details-faq-item ${openFaqIndex === index ? 'active' : ''}`}
                  >
                    <button
                      type="button"
                      className="dest-details-faq-question"
                      onClick={() => toggleFaq(index)}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown className="dest-details-faq-chevron" size={18} />
                    </button>

                    {openFaqIndex === index && (
                      <div className="dest-details-faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>


            {/* ================= 8. FINAL CTA ================= */}
            <section className="dest-details-final-cta-card">
              <div className="dest-details-final-cta-content">

                <h2 className="dest-details-final-cta-title">
                  Ready for an Unforgettable Tadoba Safari?
                </h2>
                <p className="dest-details-final-cta-desc">
                  Let our dedicated safari specialists curate your permits, handpicked resort stays, and naturalist-guided jeep drives.
                </p>

                <div className="dest-details-final-cta-actions">
                  <Link
                    to={`/trip-request/new?destination=${destination.id}`}
                    className="dest-details-final-cta-btn"
                  >
                    Request a Custom Proposal
                    <ArrowUpRight size={18} />
                  </Link>
                </div>

                <div className="dest-details-final-cta-trust">
                  <span><CheckCircle2 size={15} /> Guaranteed Forest Permits</span>
                  <span><CheckCircle2 size={15} /> Handpicked Jungle Lodges</span>
                  <span><CheckCircle2 size={15} /> Certified Naturalists</span>
                </div>
              </div>
            </section>
          </main>


          {/* ================= STICKY SIDEBAR NAVIGATION ================= */}
          <aside className="dest-details-sidebar">
            <div className="dest-sidebar-nav-card">
              <span className="dest-sidebar-nav-eyebrow">
                EXPLORE TADOBA
              </span>

              <nav className="dest-sidebar-nav-list">
                <a
                  href="#destination-overview"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('destination-overview')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="dest-sidebar-nav-link"
                >
                  Overview
                </a>
                <a
                  href="#history-legacy"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('history-legacy')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="dest-sidebar-nav-link"
                >
                  History &amp; Legacy
                </a>
                <a
                  href="#safari-experience"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('safari-experience')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="dest-sidebar-nav-link"
                >
                  Safari Experience
                </a>
                <a
                  href="#best-time"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('best-time')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="dest-sidebar-nav-link"
                >
                  Best Time
                </a>
                <a
                  href="#safari-gates"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('safari-gates')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="dest-sidebar-nav-link"
                >
                  Safari Gates
                </a>
                <a
                  href="#how-to-reach"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('how-to-reach')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="dest-sidebar-nav-link"
                >
                  How to Reach
                </a>
                <a
                  href="#faqs"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="dest-sidebar-nav-link"
                >
                  FAQs
                </a>
              </nav>

              <div className="dest-sidebar-divider" />

              <Link
                to={`/trip-request/new?destination=${destination.id}`}
                className="dest-sidebar-cta-btn"
              >
                Plan Your Safari
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </aside>

        </div>
      </div>

    </div>
  );
};

export default TadobaDetails;