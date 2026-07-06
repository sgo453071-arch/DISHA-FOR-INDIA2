import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';
import './AreasWeWork.css';

/* ── Inline SVG Illustrations (flat, warm-toned) ── */
const IllustrationEducation = () => (
  <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="area-illus-svg" aria-hidden="true">
    <rect x="20" y="90" width="200" height="8" rx="4" fill="#FEF0E8"/>
    {/* Books */}
    <rect x="60" y="50" width="18" height="44" rx="3" fill="#E86A1F" opacity="0.85"/>
    <rect x="81" y="58" width="18" height="36" rx="3" fill="#173B3F" opacity="0.75"/>
    <rect x="102" y="54" width="18" height="40" rx="3" fill="#E86A1F" opacity="0.5"/>
    <rect x="123" y="62" width="18" height="32" rx="3" fill="#FEF0E8" stroke="#E86A1F" strokeWidth="1.5"/>
    {/* Graduation cap */}
    <ellipse cx="165" cy="72" rx="22" ry="5" fill="#173B3F"/>
    <rect x="155" y="60" width="20" height="14" rx="2" fill="#173B3F" opacity="0.7"/>
    <polygon points="165,52 175,60 155,60" fill="#173B3F"/>
    <line x1="177" y1="67" x2="177" y2="77" stroke="#E86A1F" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="177" cy="79" r="3" fill="#E86A1F"/>
    {/* Stars */}
    <circle cx="45" cy="55" r="3" fill="#E86A1F" opacity="0.4"/>
    <circle cx="210" cy="60" r="2" fill="#E86A1F" opacity="0.35"/>
    <circle cx="35" cy="75" r="2" fill="#173B3F" opacity="0.2"/>
  </svg>
);

const IllustrationHealthcare = () => (
  <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="area-illus-svg" aria-hidden="true">
    {/* Cross / medical */}
    <circle cx="120" cy="78" r="48" fill="#E6F4F4" opacity="0.7"/>
    <rect x="108" y="54" width="24" height="48" rx="5" fill="#173B3F" opacity="0.75"/>
    <rect x="96" y="66" width="48" height="24" rx="5" fill="#173B3F" opacity="0.75"/>
    {/* Heart */}
    <path d="M108 100 C104 95 96 90 96 82 C96 76 102 72 108 78 C114 72 120 76 120 82 C120 90 112 95 108 100Z" fill="#E86A1F" opacity="0.85" transform="translate(12 10) scale(0.8)"/>
    {/* Small circles */}
    <circle cx="50" cy="55" r="6" fill="#E86A1F" opacity="0.15"/>
    <circle cx="195" cy="100" r="8" fill="#173B3F" opacity="0.08"/>
    <circle cx="175" cy="50" r="4" fill="#E86A1F" opacity="0.2"/>
  </svg>
);

const IllustrationSkills = () => (
  <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="area-illus-svg" aria-hidden="true">
    {/* Laptop */}
    <rect x="60" y="55" width="120" height="76" rx="8" fill="#0F172A" opacity="0.85"/>
    <rect x="68" y="63" width="104" height="58" rx="4" fill="#1E293B"/>
    {/* Screen content - code lines */}
    <rect x="76" y="72" width="50" height="4" rx="2" fill="#E86A1F" opacity="0.7"/>
    <rect x="76" y="80" width="36" height="4" rx="2" fill="#ffffff" opacity="0.4"/>
    <rect x="76" y="88" width="60" height="4" rx="2" fill="#ffffff" opacity="0.25"/>
    <rect x="76" y="96" width="44" height="4" rx="2" fill="#E86A1F" opacity="0.5"/>
    <rect x="76" y="104" width="28" height="4" rx="2" fill="#ffffff" opacity="0.3"/>
    {/* Keyboard base */}
    <rect x="45" y="131" width="150" height="8" rx="4" fill="#0F172A" opacity="0.5"/>
    {/* Gear icon */}
    <circle cx="190" cy="65" r="14" fill="#FEF0E8"/>
    <circle cx="190" cy="65" r="6" fill="#E86A1F" opacity="0.7"/>
    <circle cx="190" cy="65" r="3" fill="#ffffff"/>
  </svg>
);

const IllustrationWomen = () => (
  <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="area-illus-svg" aria-hidden="true">
    {/* Two figures */}
    {/* Figure 1 */}
    <circle cx="95" cy="52" r="20" fill="#FEF0E8"/>
    <circle cx="95" cy="50" r="13" fill="#E86A1F" opacity="0.7"/>
    <path d="M65 120 Q80 95 95 110 Q110 95 125 120" fill="#E86A1F" opacity="0.6"/>
    {/* Figure 2 */}
    <circle cx="150" cy="52" r="20" fill="#E6F4F4"/>
    <circle cx="150" cy="50" r="13" fill="#173B3F" opacity="0.7"/>
    <path d="M120 120 Q135 95 150 110 Q165 95 180 120" fill="#173B3F" opacity="0.5"/>
    {/* Star / spark accent */}
    <path d="M120 40 L122 35 L124 40 L129 42 L124 44 L122 49 L120 44 L115 42Z" fill="#E86A1F" opacity="0.6"/>
    {/* Hand clasp */}
    <ellipse cx="122" cy="95" rx="8" ry="5" fill="#E86A1F" opacity="0.4"/>
    {/* Circles */}
    <circle cx="50" cy="80" r="5" fill="#E86A1F" opacity="0.12"/>
    <circle cx="195" cy="60" r="6" fill="#173B3F" opacity="0.1"/>
  </svg>
);

const IllustrationDisaster = () => (
  <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="area-illus-svg" aria-hidden="true">
    {/* House outline */}
    <polygon points="120,30 170,75 70,75" fill="#FEF0E8" stroke="#E86A1F" strokeWidth="2"/>
    <rect x="82" y="75" width="76" height="55" rx="3" fill="#FEF0E8" stroke="#E86A1F" strokeWidth="1.5"/>
    <rect x="107" y="100" width="26" height="30" rx="3" fill="#173B3F" opacity="0.25"/>
    {/* Helping hand reaching in */}
    <path d="M170 90 Q185 85 190 95 Q185 105 170 100Z" fill="#E86A1F" opacity="0.7"/>
    <line x1="158" y1="95" x2="170" y2="95" stroke="#E86A1F" strokeWidth="3" strokeLinecap="round"/>
    {/* Alert circle */}
    <circle cx="60" cy="65" r="14" fill="#E86A1F" opacity="0.15"/>
    <text x="60" y="70" textAnchor="middle" fill="#E86A1F" fontSize="16" fontWeight="bold" opacity="0.6">!</text>
    {/* Small dots */}
    <circle cx="195" cy="130" r="4" fill="#173B3F" opacity="0.1"/>
    <circle cx="40" cy="110" r="3" fill="#E86A1F" opacity="0.15"/>
  </svg>
);

const IllustrationEnvironment = () => (
  <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="area-illus-svg" aria-hidden="true">
    {/* Ground */}
    <ellipse cx="120" cy="135" rx="80" ry="10" fill="#E6F4EA" opacity="0.7"/>
    {/* Tree trunk */}
    <rect x="113" y="90" width="14" height="48" rx="4" fill="#8B5E3C" opacity="0.6"/>
    {/* Tree canopy layers */}
    <ellipse cx="120" cy="85" rx="38" ry="30" fill="#173B3F" opacity="0.7"/>
    <ellipse cx="120" cy="70" rx="28" ry="22" fill="#1E5249" opacity="0.8"/>
    <ellipse cx="120" cy="58" rx="18" ry="15" fill="#059669" opacity="0.75"/>
    {/* Small sapling left */}
    <rect x="65" y="115" width="6" height="20" rx="2" fill="#8B5E3C" opacity="0.5"/>
    <ellipse cx="68" cy="110" rx="10" ry="8" fill="#059669" opacity="0.5"/>
    {/* Small sapling right */}
    <rect x="168" y="118" width="6" height="17" rx="2" fill="#8B5E3C" opacity="0.5"/>
    <ellipse cx="171" cy="113" rx="9" ry="7" fill="#173B3F" opacity="0.5"/>
    {/* Sun */}
    <circle cx="190" cy="45" r="16" fill="#FEF0E8"/>
    <circle cx="190" cy="45" r="10" fill="#E86A1F" opacity="0.6"/>
    {/* Sparkle dots around sun */}
    <circle cx="176" cy="35" r="2" fill="#E86A1F" opacity="0.4"/>
    <circle cx="204" cy="35" r="2" fill="#E86A1F" opacity="0.4"/>
    <circle cx="190" cy="30" r="2" fill="#E86A1F" opacity="0.4"/>
  </svg>
);

/* ── Card data ── */
const areas = [
  {
    id: 1,
    title: 'Education',
    desc: 'Empowering children and youth through quality education, digital literacy, and career guidance to build a brighter future.',
    Illustration: IllustrationEducation,
    bg: '#FEF6F0',
  },
  {
    id: 2,
    title: 'Healthcare',
    desc: 'Supporting community health through awareness campaigns, medical camps, and accessible healthcare initiatives across India.',
    Illustration: IllustrationHealthcare,
    bg: '#EDF8F8',
  },
  {
    id: 3,
    title: 'Skill Development',
    desc: 'Equipping individuals with practical skills to improve employability and unlock long-term career opportunities nationwide.',
    Illustration: IllustrationSkills,
    bg: '#F0F4FF',
  },
  {
    id: 4,
    title: 'Women Empowerment',
    desc: 'Creating opportunities for women through education, leadership, entrepreneurship, and meaningful community engagement.',
    Illustration: IllustrationWomen,
    bg: '#FEF6F0',
  },
  {
    id: 5,
    title: 'Disaster Relief',
    desc: 'Mobilising volunteers and resources to provide timely, compassionate support during emergencies and natural disasters.',
    Illustration: IllustrationDisaster,
    bg: '#FFF8EC',
  },
  {
    id: 6,
    title: 'Environment',
    desc: 'Promoting sustainability through plantation drives, awareness campaigns, and environmental conservation initiatives.',
    Illustration: IllustrationEnvironment,
    bg: '#EDFAF2',
  },
];

/* ── Animation variants ── */
const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardVariants = (i) => ({
  hidden: { opacity: 0, y: 45 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut', delay: i * 0.1 } },
});

/* ── Component ── */
const AreasWeWork = () => (
  <section className="areas-section" aria-labelledby="areas-heading">

    {/* Decorative */}
    <div className="areas-deco-blob-tl" aria-hidden="true" />
    <div className="areas-deco-blob-br" aria-hidden="true" />
    <div className="areas-deco-dots-tr" aria-hidden="true">
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="awDot" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2" fill="#E86A1F" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#awDot)" />
      </svg>
    </div>

    <div className="areas-container">

      {/* Header */}
      <motion.div
        className="areas-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={headerVariants}
      >
        <span className="areas-accent">Our Focus Areas</span>
        <h2 id="areas-heading" className="areas-title">Areas We Work In</h2>
        <p className="areas-desc">
          Through dedicated volunteers, trusted NGO partnerships, and community-driven initiatives, Disha for India creates meaningful impact across multiple sectors of society.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="areas-grid">
        {areas.map((area, i) => {
          const { Illustration } = area;
          return (
            <motion.article
              key={area.id}
              className="area-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={cardVariants(i)}
              aria-label={area.title}
            >
              {/* Illustration */}
              <div
                className="area-illus-wrap"
                style={{ background: area.bg }}
              >
                <Illustration />
              </div>

              {/* Card Body */}
              <div className="area-card-body">
                <h3 className="area-card-title">{area.title}</h3>
                <p className="area-card-desc">{area.desc}</p>
                <a href="#" className="area-learn-more" aria-label={`Learn more about ${area.title}`}>
                  Learn More
                  <ArrowRight size={16} className="area-learn-arrow" />
                </a>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Decorative divider */}
      <div className="areas-divider" aria-hidden="true">
        <div className="areas-divider-line" />
        <Leaf size={20} className="areas-divider-icon" />
        <div className="areas-divider-line" />
      </div>

    </div>
  </section>
);

export default AreasWeWork;
