/* ==========================================================
   Pench Tiger Reserve Comprehensive Information Page
   ========================================================== */

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
  AlertTriangle,
  Info
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
    highlights: 'Highest tiger sighting frequency, Baghin Nala, Mahadev Ghat',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Turia+Gate+Pench+National+Park'
  },
  {
    id: 'core-karmajhiri',
    name: 'Karmajhiri Gate',
    type: 'Core',
    district: 'Seoni District, MP',
    description: 'Karmajhiri, Seoni district. Serene, pristine core zone known for towering teak canopies, Bodhanala waterbody, and wild dog packs. (Wednesday afternoon closed)',
    highlights: 'Bodhanala lake, wild dog (dhole) packs, gaur herds',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Karmajhiri+Gate+Pench'
  },
  {
    id: 'core-jamtara',
    name: 'Jamtara Gate',
    type: 'Core',
    district: 'Chhindwara District, MP',
    description: 'Jamtara village, Chhindwara district. Quiet western entrance with rolling hills and tranquil tracks; entry is currently approached via Karmajhiri. (Wednesday afternoon closed)',
    highlights: 'Undulating riverine terrain, sloth bear habitat, birdwatching',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Jamtara+Gate+Pench'
  },
  // Buffer Gates (Madhya Pradesh side)
  {
    id: 'buf-rukhad',
    name: 'Rukhad Gate',
    type: 'Buffer',
    district: 'Seoni District, MP',
    description: 'Rukhad, Seoni district. Vital tiger corridor linking Pench with Kanha. Famous for night safaris, cycling trails, and walking safaris. (Wednesday afternoon closed)',
    highlights: 'Night safaris, canopy cycling, Pench-Kanha corridor',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Rukhad+Sanctuary+Pench'
  },
  {
    id: 'buf-khawasa',
    name: 'Khawasa Buffer Gate',
    type: 'Buffer',
    district: 'Seoni District, MP',
    description: 'Khawasa, near Turia border. Locally known as the "Wolf Sanctuary" zone, offering rich nocturnal wildlife drives. (Wednesday afternoon closed)',
    highlights: 'Indian wolf sightings, jackal, hyena, dusk drives',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Khawasa+Gate+Pench'
  },
  {
    id: 'buf-teliya',
    name: 'Teliya / Telia Buffer Gate',
    type: 'Buffer',
    district: 'Seoni District, MP',
    description: 'Near Turia gate, Seoni district. Highly active buffer zone offering afternoon and night safaris with regular tiger sightings. (Wednesday afternoon closed)',
    highlights: 'Night safaris, grassland predator tracking, flexible quotas',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Telia+Gate+Pench'
  }
];

const PENCH_FAQS = [
  {
    question: 'What is the best time to visit Pench Tiger Reserve?',
    answer:
      'The park is open from October to June. November to February offers cool, pleasant weather ideal for families and birdwatching, while March to June (summer) offers excellent tiger-sighting odds as animals gather predictably around shrinking waterholes. The park is fully closed during the monsoon, roughly 1 July to 30 September.'
  },
  {
    question: 'How do I book a Pench safari?',
    answer:
      'Safaris on the Madhya Pradesh side are booked online through the official MP Forest Department portal (forest.mponline.gov.in). Bookings typically open up to 120 days in advance, with a next-day "Single Seat" quota released daily at 2:00 PM and a "Premium Tatkal" quota released 7 days ahead at 11:00 AM. Vehicle and guide charges are paid separately at the gate.'
  },
  {
    question: 'How long does a safari last, and how many can I take in a day?',
    answer:
      'Two safari shifts run daily — one morning shift and one afternoon/evening shift — each lasting roughly 3.5 to 5 hours depending on the season and sunrise/sunset times. Only one safari per shift/gate is permitted per permit.'
  },
  {
    question: 'Which entry gate should I choose for Pench?',
    answer:
      'Turia is the most popular core gate with the highest historical tiger-sighting frequency and maximum luxury lodges nearby. Karmajhiri and Jamtara offer quieter, less-crowded core experiences. Rukhad, Khawasa, and Teliya are buffer zones offering flexible permits and exciting night safaris, which are not permitted in the core.'
  },
  {
    question: 'What documents and essentials should I carry?',
    answer:
      'Carry the original valid government-issued photo ID used during booking (mandatory for gate verification), your printed/digital safari voucher, and arrive at least 30 minutes before gate opening. Wear earthy/neutral tones (khaki, olive green, brown), carry sun protection, and bring binoculars.'
  },
  {
    question: 'What is the weekly closure policy in Pench Tiger Reserve?',
    answer:
      'Core zones (Turia, Karmajhiri, Jamtara) and buffer gates on the MP side are closed for the afternoon safari every Wednesday ("half-day off on Wednesday"). The morning safari on Wednesdays operates normally. Safaris are also closed on the afternoons of Holi and Diwali.'
  }
];

const PenchInformation = ({
  destination,
  resorts: _resorts,
  safariGates = PENCH_MASTER_GATES
}: PenchDetailsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % PENCH_HERO_IMAGES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  if (!destination) return null;

  const coreGates = safariGates.filter((gate) => gate.type === 'Core');
  const bufferGates = safariGates.filter((gate) => gate.type === 'Buffer');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="dest-details-page">
      {/* ================= 1. HERO ================= */}
      <section className="dest-details-hero">
        {PENCH_HERO_IMAGES.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Pench Tiger Reserve banner ${index + 1}`}
            className={`dest-details-hero-img ${index === activeIndex ? 'active' : ''}`}
          />
        ))}

        <div className="dest-details-hero-overlay" />

        <div className="dest-details-hero-content">
          <div className="dest-details-hero-wrapper">
            <h1 className="dest-details-hero-title">
              {destination.name || 'Pench Tiger Reserve'}
            </h1>

            <p className="dest-details-hero-subtitle">
              Mowgli's Land — The Original Home of the Jungle Book. Explore pristine teak forests, meandering rivers, and thrilling tiger tracking.
            </p>

            <div className="dest-details-hero-meta">
              <div className="dest-details-hero-meta-item">
                <MapPin className="dest-details-hero-meta-icon" />
                <span>Seoni & Chhindwara, Madhya Pradesh, India</span>
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
                  const elem = document.getElementById('destination-overview');
                  if (elem) {
                    elem.scrollIntoView({ behavior: 'smooth' });
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
          <span>{String(activeIndex + 1).padStart(2, '0')}</span>
          <span>/</span>
          <span>{String(PENCH_HERO_IMAGES.length).padStart(2, '0')}</span>
        </div>
      </section>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="dest-details-container">
        <div className="dest-details-layout">
          {/* ================= MAIN CONTENT ================= */}
          <main className="dest-details-main">
            {/* ================= 1. ABOUT PENCH → Overview ================= */}
            <section id="destination-overview" className="dest-details-card dest-details-about-card">
              <div className="dest-details-about-header">
                <div className="dest-details-about-header-text">
                  <div className="dest-details-about-eyebrow">ABOUT PENCH</div>
                  <h2 className="dest-details-about-title">
                    The Original Home of The Jungle Book
                  </h2>
                </div>
              </div>

              <div className="dest-details-about-intro">
                <p>
                  Nestled in the southern reaches of the Satpura hill ranges, <strong>Pench Tiger Reserve</strong> straddles the Seoni and Chhindwara districts of southern Madhya Pradesh. The <strong>Pench River</strong> flows north to south through the reserve, splitting it into two nearly equal blocks and feeding numerous seasonal streams and waterholes.
                </p>
                <p>
                  The forest is predominantly southern tropical dry and moist deciduous, dominated by teak (<em>Tectona grandis</em>), interspersed with bamboo thickets and open grassy meadows. Pench supports a thriving population of <strong>Bengal tigers, leopards, sloth bears, Indian gaur, wild dogs (dhole), and wolves</strong>, alongside large herds of chital, sambar, nilgai, and wild boar. The reserve forms a critical genetic corridor linking Kanha and Satpura Tiger Reserves within the Central Indian tiger landscape.
                </p>
              </div>

              {/* 4 Metric Stats Grid */}
              <div className="dest-details-about-stats-grid pench-stats-grid">
                <div className="dest-details-about-stat-card">
                  <div className="dest-details-about-stat-value">1,179.63</div>
                  <div className="dest-details-about-stat-label">SQ KM</div>
                  <div className="dest-details-about-stat-sub">TOTAL AREA (MP)</div>
                </div>

                <div className="dest-details-about-stat-card">
                  <div className="dest-details-about-stat-value">411.33</div>
                  <div className="dest-details-about-stat-label">SQ KM</div>
                  <div className="dest-details-about-stat-sub">CORE HABITAT</div>
                </div>

                <div className="dest-details-about-stat-card">
                  <div className="dest-details-about-stat-value">768.30</div>
                  <div className="dest-details-about-stat-label">SQ KM</div>
                  <div className="dest-details-about-stat-sub">BUFFER ZONE</div>
                </div>

                <div className="dest-details-about-stat-card">
                  <div className="dest-details-about-stat-value">77</div>
                  <div className="dest-details-about-stat-label">TIGERS</div>
                  <div className="dest-details-about-stat-sub">2022 CENSUS (MP)</div>
                </div>
              </div>

              {/* Divider */}
              <div className="dest-details-about-divider" />

              {/* THE STORY OF PENCH */}
              <div className="dest-details-about-subsection">
                <h3 className="dest-details-about-subtitle">
                  THE STORY &amp; ORIGIN OF THE NAME
                </h3>
                <div className="dest-details-about-story-content">
                  <p>
                    <strong>Documented History:</strong> The reserve is named after the Pench River, a tributary of the Kanhan River, which flows roughly 74 km through the forest from north to south, bisecting the core area into western and eastern blocks. The natural richness of this forest tract has been documented since the 16th century in Abul Fazl's <em>Ain-i-Akbari</em>, and later in colonial-era natural history accounts such as Captain James Forsyth's <em>The Highlands of Central India</em> and A. A. Dunbar Brander's <em>Wild Animals of Central India</em>.
                  </p>
                  <p style={{ marginTop: '0.85rem' }}>
                    <strong>Local Legend &amp; Literary Connection:</strong> Pench and the neighbouring Seoni forests are widely celebrated as the real-life setting that inspired Rudyard Kipling's <em>The Jungle Book</em> and its legendary character Mowgli. This association is linked to an 1831 report (referenced via Sir William Henry Sleeman's writings) of a child said to have been raised by wolves near Seoni.
                  </p>
                </div>
              </div>
            </section>

            {/* ================= 2. HISTORY & LEGACY → History ================= */}
            <section id="history-legacy" className="dest-details-card dest-details-history-card">
              <div className="dest-details-history-header">
                <div className="dest-details-history-title-wrap">
                  <History className="dest-details-card-icon" size={24} />
                  <h2 className="dest-details-history-title">HISTORY &amp; LEGACY</h2>
                </div>
                <p className="dest-details-history-subtitle">
                  From wildlife sanctuary to India's 19th Project Tiger reserve — Pench's 5 key conservation milestones.
                </p>
              </div>

              <div className="dest-details-history-timeline-container">
                <div className="dest-details-history-timeline-track" />

                <div className="dest-details-history-timeline-grid">
                  {/* 1977 */}
                  <div className="dest-details-history-timeline-item">
                    <div className="dest-details-history-year">1977</div>
                    <div className="dest-details-history-dot" />
                    <div className="dest-details-history-content">
                      <h4 className="dest-details-history-event-title">WILDLIFE SANCTUARY</h4>
                      <p className="dest-details-history-event-desc">
                        Pench (Mowgli) Sanctuary constituted with ~449.39 sq km.
                      </p>
                    </div>
                  </div>

                  {/* 1983 */}
                  <div className="dest-details-history-timeline-item">
                    <div className="dest-details-history-year">1983</div>
                    <div className="dest-details-history-dot" />
                    <div className="dest-details-history-content">
                      <h4 className="dest-details-history-event-title">NATIONAL PARK</h4>
                      <p className="dest-details-history-event-desc">
                        Pench National Park created (292.85 sq km) in Seoni & Chhindwara.
                      </p>
                    </div>
                  </div>

                  {/* 1992 */}
                  <div className="dest-details-history-timeline-item">
                    <div className="dest-details-history-year">1992</div>
                    <div className="dest-details-history-dot" />
                    <div className="dest-details-history-content">
                      <h4 className="dest-details-history-event-title">PROJECT TIGER</h4>
                      <p className="dest-details-history-event-desc">
                        Notified as India's 19th Tiger Reserve (unified core 411.33 sq km).
                      </p>
                    </div>
                  </div>

                  {/* 2002 */}
                  <div className="dest-details-history-timeline-item">
                    <div className="dest-details-history-year">2002</div>
                    <div className="dest-details-history-dot" />
                    <div className="dest-details-history-content">
                      <h4 className="dest-details-history-event-title">INDIRA PRIYADARSHINI</h4>
                      <p className="dest-details-history-event-desc">
                        Park renamed Indira Priyadarshini Pench National Park.
                      </p>
                    </div>
                  </div>

                  {/* 2010 */}
                  <div className="dest-details-history-timeline-item">
                    <div className="dest-details-history-year">2010</div>
                    <div className="dest-details-history-dot" />
                    <div className="dest-details-history-content">
                      <h4 className="dest-details-history-event-title">BUFFER NOTIFIED</h4>
                      <p className="dest-details-history-event-desc">
                        768.30 sq km buffer formally notified (Total: 1,179.63 sq km).
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
                  Guided open Gypsy and Canter safaris across Pench Madhya Pradesh
                </p>
                <div className="dest-details-disclaimer-note">
                  <AlertTriangle className="dest-details-disclaimer-icon" size={16} />
                  <span>Safaris on the MP side are booked via MPOnline (forest.mponline.gov.in). Vehicle & guide fees are payable at gate.</span>
                </div>
              </div>

              {/* Vehicle Options Grid (Gypsy vs Canter) */}
              <div className="dest-details-safari-vehicles-grid">
                {/* Gypsy Card */}
                <div className="dest-details-safari-vehicle-card">
                  <div className="dest-details-vehicle-header">
                    <div className="dest-details-vehicle-title-wrap">
                      <h3 className="dest-details-vehicle-title">OPEN 4x4 GYPSY</h3>
                    </div>
                  </div>
                  <ul className="dest-details-vehicle-list">
                    <li><CheckCircle2 className="dest-details-vehicle-check" /> Core & Buffer Circuits</li>
                    <li><CheckCircle2 className="dest-details-vehicle-check" /> Morning & Afternoon Shifts</li>
                    <li><CheckCircle2 className="dest-details-vehicle-check" /> Capacity: Capped at 6 tourists (+ guide & driver)</li>
                    <li><CheckCircle2 className="dest-details-vehicle-check" /> Bookable as Full Vehicle or Single Seat Permit</li>
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
                    <li><CheckCircle2 className="dest-details-vehicle-check" /> Budget-friendly shared safari bus</li>
                    <li><CheckCircle2 className="dest-details-vehicle-check" /> Available at select gates during peak season</li>
                    <li><CheckCircle2 className="dest-details-vehicle-check" /> Capacity: 12 to 18 tourists</li>
                    <li><CheckCircle2 className="dest-details-vehicle-check" /> Accompanied by mandatory Forest Guide</li>
                  </ul>
                </div>
              </div>

              {/* Vehicle Ceiling Note */}
              <div className="pench-vehicle-ceiling-box">
                <div className="pench-ceiling-badge">
                  <Info size={16} />
                  <span>Daily Vehicle Ceilings (MP Forest Department)</span>
                </div>
                <div className="pench-ceiling-grid">
                  <div className="pench-ceiling-item">
                    <strong>Turia Gate:</strong> Up to 68 vehicles/day (34 morning + 34 evening)
                  </div>
                  <div className="pench-ceiling-item">
                    <strong>Karmajhiri Gate:</strong> Up to 12 vehicles/day
                  </div>
                  <div className="pench-ceiling-item">
                    <strong>Jamtara Gate:</strong> Up to 8 vehicles/day
                  </div>
                  <div className="pench-ceiling-item">
                    <strong>Buffer Zones:</strong> Up to 30 vehicles/day (Rukhad & Teliya)
                  </div>
                </div>
              </div>

              {/* Safari Timings Block */}
              <div className="dest-details-timings-box">
                <h4 className="dest-details-timings-title">
                  <Clock size={20} />
                  Official Month-wise Safari Shifts &amp; Timings
                </h4>
                <p className="dest-details-timings-desc">
                  Entry and exit times shift gradually with sunrise and sunset. Core zones are closed for afternoon safaris every Wednesday.
                </p>

                <div className="dest-details-timings-table-container">
                  <table className="dest-details-timings-table">
                    <thead>
                      <tr>
                        <th>Period / Month</th>
                        <th>Morning Entry</th>
                        <th>Morning Exit</th>
                        <th>Afternoon Entry</th>
                        <th>Afternoon Exit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>October</strong></td>
                        <td>6:00 AM</td>
                        <td>11:00 AM</td>
                        <td>3:00 PM</td>
                        <td>6:00 PM</td>
                      </tr>
                      <tr>
                        <td><strong>November</strong></td>
                        <td>6:15 AM</td>
                        <td>11:00 AM</td>
                        <td>3:00 PM</td>
                        <td>5:45 PM</td>
                      </tr>
                      <tr>
                        <td><strong>December</strong></td>
                        <td>6:30 AM</td>
                        <td>11:00 AM</td>
                        <td>3:00 PM</td>
                        <td>5:30 PM</td>
                      </tr>
                      <tr>
                        <td><strong>January</strong></td>
                        <td>6:45 AM</td>
                        <td>11:00 AM</td>
                        <td>3:00 PM</td>
                        <td>5:45 PM</td>
                      </tr>
                      <tr>
                        <td><strong>February</strong></td>
                        <td>6:30 AM</td>
                        <td>11:00 AM</td>
                        <td>3:00 PM</td>
                        <td>6:15 PM</td>
                      </tr>
                      <tr>
                        <td><strong>March</strong></td>
                        <td>6:15 AM</td>
                        <td>11:00 AM</td>
                        <td>3:00 PM</td>
                        <td>6:30 PM</td>
                      </tr>
                      <tr>
                        <td><strong>April</strong></td>
                        <td>5:45 AM</td>
                        <td>11:00 AM</td>
                        <td>4:00 PM</td>
                        <td>6:45 PM</td>
                      </tr>
                      <tr>
                        <td><strong>May</strong></td>
                        <td>5:30 AM</td>
                        <td>11:00 AM</td>
                        <td>4:00 PM</td>
                        <td>7:00 PM</td>
                      </tr>
                      <tr>
                        <td><strong>June</strong></td>
                        <td>5:30 AM</td>
                        <td>11:00 AM</td>
                        <td>4:00 PM</td>
                        <td>7:00 PM</td>
                      </tr>
                      <tr className="pench-table-closed-row">
                        <td><strong>Jul – Sep</strong></td>
                        <td colSpan={4}><strong>CLOSED FOR MONSOON / BREEDING SEASON</strong> (Reopens ~15 October)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="pench-timing-notes">
                  <p><strong>• Weekly Closure:</strong> Core zones (Turia, Karmajhiri, Jamtara) are closed on <strong>Wednesday afternoons</strong> only (morning safari runs normally). Also closed afternoon on Holi & Diwali.</p>
                  <p><strong>• Monsoon Closure:</strong> Core zones close 1 July to 30 September annually. Buffer zones generally follow core closure.</p>
                </div>
              </div>

              {/* Proposal Banner */}
              <div className="dest-details-proposal-banner">
                <div className="dest-details-proposal-banner-content">
                  <div className="dest-details-proposal-banner-icon-wrap">
                    <Compass className="dest-details-proposal-banner-icon" />
                  </div>
                  <p className="dest-details-proposal-banner-text">
                    Planning a Pench safari? Share your preferred dates and requirements to receive a personalized safari proposal.
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
                Best Time to Visit Pench
              </h2>

              <div className="dest-details-seasons-header-note">
                <h3 className="dest-details-seasons-headline">
                  EACH SEASON OFFERS A UNIQUE GLIMPSE OF MOWGLI'S JUNGLE.
                </h3>
                <p className="dest-details-seasons-subline">
                  Choose winter for pleasant weather and verdant scenery, or summer for peak big-cat sightings.
                </p>
              </div>

              <div className="pench-seasons-grid">
                <div className="pench-season-card">
                  <span className="pench-season-badge">WINTER (NOV – FEB)</span>
                  <h4 className="pench-season-title">Crisp Mornings & Birdwatching</h4>
                  <p className="pench-season-desc">
                    Misty morning drives with temperatures between 10°C and 25°C. Lush green canopies, active bird migrations, and comfortable weather make it ideal for family holidays.
                  </p>
                  <div className="pench-season-timings">
                    <span>Morning: 6:15–6:45 AM to 11:00 AM</span>
                    <span>Afternoon: 3:00 PM to 5:30–6:15 PM</span>
                  </div>
                </div>

                <div className="pench-season-card">
                  <span className="pench-season-badge">SUMMER (MAR – JUN)</span>
                  <h4 className="pench-season-title">Prime Tiger Tracking</h4>
                  <p className="pench-season-desc">
                    Deciduous leaves drop and water sources shrink, drawing tigers, leopards, wild dogs, and gaurs to the Pench riverbed and prominent forest waterholes.
                  </p>
                  <div className="pench-season-timings">
                    <span>Morning: 5:30–6:15 AM to 11:00 AM</span>
                    <span>Afternoon: 3:00–4:00 PM to 6:45–7:00 PM</span>
                  </div>
                </div>

                <div className="pench-season-card">
                  <span className="pench-season-badge closed">MONSOON (JUL – SEP)</span>
                  <h4 className="pench-season-title">Park Breeding & Rejuvenation</h4>
                  <p className="pench-season-desc">
                    Core zones are fully closed to tourists from 1 July to 30 September as forest rivers swell and wildlife enters its breeding season. Safaris resume around 15 October.
                  </p>
                  <div className="pench-season-timings">
                    <span>Core Status: CLOSED</span>
                    <span>Reopening: Mid-October</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= 5. SAFARI GATES → Safari Gates ================= */}
            <section id="safari-gates" className="dest-details-card">
              <h2 className="dest-details-card-title">
                Core Safari Gates (Madhya Pradesh)
              </h2>

              <p className="dest-details-section-info">
                Core zones represent the <strong>protected 411.33 sq km critical tiger habitat</strong>. All core gates observe a <strong>half-day closure on Wednesday afternoons</strong>.
              </p>

              <div className="dest-details-gates-grid dest-details-core-gates-grid">
                {coreGates.map((gate) => (
                  <div key={gate.id} className="dest-details-gate-card core-compact pench-gate-detailed">
                    <div className="dest-details-gate-top">
                      <span className="dest-details-gate-name">{gate.name}</span>
                      <span className="pench-gate-district">{gate.district}</span>
                    </div>

                    <p className="pench-gate-desc">{gate.description}</p>
                    {gate.highlights && (
                      <p className="pench-gate-highlights">
                        <strong>Highlights:</strong> {gate.highlights}
                      </p>
                    )}

                    {gate.mapLink && (
                      <a
                        href={gate.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dest-details-gate-map-btn"
                        title={`Locate ${gate.name} on Google Maps`}
                      >
                        <MapPin size={14} />
                        <span>Locate Gate</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                <h3 className="dest-details-card-title" style={{ fontSize: '1.5rem' }}>
                  Buffer Safari Gates (Madhya Pradesh)
                </h3>
                <p className="dest-details-section-info" style={{ marginBottom: '1.25rem' }}>
                  Buffer zones cover <strong>768.30 sq km</strong> of reserve forest, offering exciting daytime tracking as well as <strong>regulated night safaris and cycling trails</strong>.
                </p>

                <div className="dest-details-gates-grid dest-details-buffer-gates-grid">
                  {bufferGates.map((gate) => (
                    <div key={gate.id} className="dest-details-gate-card buffer-compact pench-gate-detailed">
                      <div className="dest-details-gate-top">
                        <span className="dest-details-gate-name">{gate.name}</span>
                        <span className="pench-gate-district">{gate.district}</span>
                      </div>

                      <p className="pench-gate-desc">{gate.description}</p>
                      {gate.highlights && (
                        <p className="pench-gate-highlights">
                          <strong>Highlights:</strong> {gate.highlights}
                        </p>
                      )}

                      {gate.mapLink && (
                        <a
                          href={gate.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dest-details-gate-map-btn"
                          title={`Locate ${gate.name} on Google Maps`}
                        >
                          <MapPin size={14} />
                          <span>Locate Gate</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Scope Note on Maharashtra Side */}
              <div className="pench-scope-note">
                <Info size={16} />
                <span>
                  <strong>Administrative Scope Note:</strong> The gates above belong to Pench Tiger Reserve, Madhya Pradesh. The Maharashtra side of Pench (core 257.3 sq km + buffer 483.96 sq km) operates separate entry gates (Sillari, Khursapar, Kolitmara, Chorbahuli, Surewani) booked via the Maharashtra Forest Department portal.
                </span>
              </div>
            </section>

            {/* ================= 6. HOW TO REACH PENCH → How to Reach ================= */}
            <section id="how-to-reach" className="dest-details-card dest-details-reach-section">
              <h2 className="dest-details-card-title">
                How to Reach Pench Tiger Reserve?
              </h2>

              <p className="dest-details-section-info">
                Pench MP is exceptionally well-connected by road via NH-44 from Nagpur and Jabalpur.
              </p>

              <div className="dest-details-reach-grid">
                {/* NEAREST AIRPORT */}
                <div className="dest-details-reach-card">
                  <div className="dest-details-reach-header">
                    <span className="dest-details-reach-tag">NEAREST AIRPORT</span>
                  </div>

                  <div className="dest-details-reach-body">
                    <h3 className="dest-details-reach-main-title">Nagpur Airport</h3>
                    <p className="dest-details-reach-sub-info">
                      Dr. Babasaheb Ambedkar International Airport (NAG)
                    </p>
                  </div>

                  <div className="dest-details-reach-footer">
                    <span className="dest-details-reach-note">
                      ~92–145 km (2–2.5 hrs via NH-44). Jabalpur Airport: ~205–215 km.
                    </span>
                  </div>
                </div>

                {/* NEAREST RAILWAY STATION */}
                <div className="dest-details-reach-card">
                  <div className="dest-details-reach-header">
                    <span className="dest-details-reach-tag">NEAREST RAILWAY</span>
                  </div>

                  <div className="dest-details-reach-body">
                    <h3 className="dest-details-reach-main-title">Nagpur / Seoni Railway</h3>
                    <p className="dest-details-reach-sub-info">
                      Nagpur Junction (NGP) &amp; Seoni Railway Station
                    </p>
                  </div>

                  <div className="dest-details-reach-footer">
                    <span className="dest-details-reach-note">
                      Nagpur Junction: ~130–145 km. Seoni Station: ~65–72 km.
                    </span>
                  </div>
                </div>

                {/* BY ROAD */}
                <div className="dest-details-reach-card">
                  <div className="dest-details-reach-header">
                    <span className="dest-details-reach-tag">BY ROAD (NH-44)</span>
                  </div>

                  <div className="dest-details-reach-body dest-details-reach-road-body">
                    <div className="dest-details-reach-road-row">
                      <span className="dest-details-reach-city">Nagpur</span>
                      <span className="dest-details-reach-dist">~130–145 km</span>
                    </div>
                    <div className="dest-details-reach-road-row">
                      <span className="dest-details-reach-city">Jabalpur</span>
                      <span className="dest-details-reach-dist">~185–215 km</span>
                    </div>
                    <div className="dest-details-reach-road-row">
                      <span className="dest-details-reach-city">Seoni Town</span>
                      <span className="dest-details-reach-dist">~65–72 km</span>
                    </div>
                  </div>

                  <div className="dest-details-reach-footer">
                    <span className="dest-details-reach-note">
                      Smooth 4-lane highway with dedicated wildlife underpasses.
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
                Official guidelines and essential answers for planning your Pench safari.
              </p>

              <div className="dest-details-faq-list">
                {PENCH_FAQS.map((faq, index) => (
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
                  Ready for an Unforgettable Pench Safari?
                </h2>
                <p className="dest-details-final-cta-desc">
                  Let our dedicated safari specialists curate your MPOnline permits, handpicked jungle resort stays, and naturalist-guided open 4x4 Gypsy drives.
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
              <span className="dest-sidebar-nav-eyebrow">EXPLORE PENCH</span>

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

export default PenchInformation;
