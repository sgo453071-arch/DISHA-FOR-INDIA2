import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, Users, Target, MapPin, Handshake, Check } from 'lucide-react';
import './ImpactNumbers.css';

/* ── Stats data (swap values from API later) ── */
const stats = [
  {
    icon: Heart,
    displayValue: '100K+',
    endValue: 100,
    suffix: 'K+',
    label: 'Lives Impacted',
    sub: 'Changing lives through education and service.',
  },
  {
    icon: Users,
    displayValue: '10K+',
    endValue: 10,
    suffix: 'K+',
    label: 'Active Volunteers',
    sub: 'Dedicated changemakers nationwide.',
  },
  {
    icon: Target,
    displayValue: '500+',
    endValue: 500,
    suffix: '+',
    label: 'Programs Conducted',
    sub: 'Impactful initiatives across communities.',
  },
  {
    icon: MapPin,
    displayValue: '18',
    endValue: 18,
    suffix: '',
    label: 'States Reached',
    sub: 'Expanding across India.',
  },
  {
    icon: Handshake,
    displayValue: '200+',
    endValue: 200,
    suffix: '+',
    label: 'NGO Partners',
    sub: 'Trusted partnerships creating lasting change.',
  },
];

const highlights = [
  'Trusted by NGOs Across India',
  'Transparent & Verified Programs',
  'Building Sustainable Community Impact',
];

/* ── Animated Counter Hook ── */
function useCounter(end, duration = 2200, started = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo easing
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, started]);

  return count;
}

/* ── Single Counter Card ── */
const StatCard = ({ stat, index, started }) => {
  const Icon = stat.icon;
  const count = useCounter(stat.endValue, 2200, started);

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut', delay: index * 0.1 },
    },
  };

  return (
    <motion.div className="impact-card" variants={cardVariants}>
      <div className="impact-icon-wrap" aria-hidden="true">
        <Icon size={28} strokeWidth={1.75} />
      </div>
      <div
        className="impact-counter"
        aria-label={`${stat.endValue}${stat.suffix} ${stat.label}`}
      >
        {count}{stat.suffix}
      </div>
      <div className="impact-label">{stat.label}</div>
      <div className="impact-subdesc">{stat.sub}</div>
    </motion.div>
  );
};

/* ── Main Component ── */
const ImpactNumbers = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const stripVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut', delay: 0.6 } },
  };

  return (
    <section className="impact-section" ref={ref} aria-labelledby="impact-heading">

      {/* Ghost background numbers */}
      <div className="impact-ghost-nums" aria-hidden="true">
        <span className="impact-ghost-num impact-ghost-num-1">100K</span>
        <span className="impact-ghost-num impact-ghost-num-2">500+</span>
        <span className="impact-ghost-num impact-ghost-num-3">18</span>
      </div>

      {/* Decorative dot grid */}
      <div className="impact-deco-dots" aria-hidden="true">
        <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="impactDot" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="#ffffff" />
            </pattern>
          </defs>
          <rect width="120" height="120" fill="url(#impactDot)" />
        </svg>
      </div>

      <div className="impact-container">

        {/* Header */}
        <motion.div
          className="impact-header"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={headerVariants}
        >
          <span className="impact-accent">Making a Difference Together</span>
          <h2 id="impact-heading" className="impact-title">Our Impact in Numbers</h2>
          <p className="impact-desc">
            Every volunteer, every program, and every partnership contributes to creating lasting impact across communities in India.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="impact-grid"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ visible: {} }}
        >
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} started={isInView} />
          ))}
        </motion.div>

        {/* Bottom Highlight Strip */}
        <motion.div
          className="impact-strip"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={stripVariants}
        >
          {highlights.map((text) => (
            <div key={text} className="impact-strip-item">
              <span className="impact-strip-check" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
              {text}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default ImpactNumbers;
