import React from 'react';
import { motion } from 'framer-motion';
import {
  Heart, Trophy, GraduationCap, Users,
  Briefcase, BookOpen, Rocket, Leaf,
  Quote, ArrowRight, Mail
} from 'lucide-react';
import './FounderSpotlight.css';

/* ---------- DATA (easy to swap with real content) ---------- */
const badges = [
  { label: 'Heart-led Leadership', icon: Heart,         colorClass: 'badge-icon-orange' },
  { label: 'Career Mentor',        icon: GraduationCap, colorClass: 'badge-icon-teal'   },
  { label: 'Social Impact Advocate', icon: Users,       colorClass: 'badge-icon-gold'   },
];

const achievements = [
  {
    icon: Briefcase,
    colorClass: 'ach-orange',
    title: 'Corporate Leadership',
    desc: 'Wealth Relationship Manager at HSBC (2005–2013)',
  },
  {
    icon: BookOpen,
    colorClass: 'ach-teal',
    title: 'Education',
    desc: 'Panjab University MA + IIM Bangalore Women Entrepreneur Program',
  },
  {
    icon: Rocket,
    colorClass: 'ach-purple',
    title: 'Entrepreneurial Journey',
    desc: 'Built organisations focused on education & empowerment',
  },
  {
    icon: Leaf,
    colorClass: 'ach-green',
    title: 'Social Impact',
    desc: 'Trustee, Disha for India Foundation — guiding thousands of students',
  },
];

/* ---------- ANIMATION VARIANTS ---------- */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

const slideRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

/* ---------- COMPONENT ---------- */
const FounderSpotlight = () => (
  <section className="founder-section" aria-labelledby="founder-heading">

    {/* Decorative backgrounds */}
    <div className="founder-deco-blob-tl" aria-hidden="true" />
    <div className="founder-deco-blob-br" aria-hidden="true" />
    <div className="founder-deco-dots" aria-hidden="true">
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="fsDot" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2" fill="#E86A1F" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#fsDot)" />
      </svg>
    </div>

    <div className="founder-container">

      {/* ── Section Header ── */}
      <motion.div
        className="founder-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
      >
        <span className="founder-header-accent">Leadership &amp; Purpose</span>
        <h2 id="founder-heading" className="founder-header-title">Meet Our Founder</h2>
        <p className="founder-header-desc">
          The vision behind Disha for India and the journey of meaningful impact.
        </p>
      </motion.div>

      {/* ── Two-column Layout ── */}
      <div className="founder-layout">

        {/* ============ LEFT COLUMN ============ */}
        <motion.div
          className="founder-left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={scaleIn}
        >
          {/* Portrait */}
          <div className="founder-portrait-wrap">
            <div className="founder-portrait-glow" aria-hidden="true" />
            <div className="founder-portrait-ring" aria-hidden="true" />
            <img
              src="/images/indu_aggarwal.png"
              alt="Indu Aggarwal — Founder and Trustee of Disha for India Foundation."
              className="founder-portrait-img"
            />
            {/* Handwritten signature badge */}
            <span className="founder-signature" aria-hidden="true">Indu Aggarwal</span>
          </div>

          {/* Name & Role */}
          <div className="founder-name-block">
            <h3 className="founder-name">Indu Aggarwal</h3>
            <p className="founder-role">
              Founder &amp; Trustee<br />Disha for India Foundation
            </p>
          </div>

          {/* Achievement Badges */}
          <motion.div
            className="founder-badges"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {badges.map((b) => {
              const Icon = b.icon;
              return (
                <motion.div key={b.label} className="founder-badge" variants={fadeUp}>
                  <span className={`founder-badge-icon ${b.colorClass}`}>
                    <Icon size={16} strokeWidth={2} />
                  </span>
                  {b.label}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* ============ RIGHT COLUMN ============ */}
        <motion.div
          className="founder-right"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={slideRight}
        >
          {/* Biography */}
          <div className="founder-bio">
            <h3 className="founder-bio-heading">About Indu</h3>

            <p>
              Indu Aggarwal is a Mohali-based entrepreneur and heart-based career coach who has dedicated
              her life to empowering students and communities through education, meaningful volunteering,
              and purposeful leadership. As the Founder and Trustee of the Disha for India Foundation,
              she channels her experience from the corporate world into building a stronger, more
              compassionate India.
            </p>
            <p>
              Before stepping into entrepreneurship, Indu spent nearly a decade as a Wealth Relationship
              Manager at HSBC (2005–2013), where she developed a deep understanding of people, purpose,
              and organisational integrity. She holds a Master's degree in Business and Managerial
              Economics from Panjab University and has completed the prestigious Women Entrepreneur
              GS10K Programme at IIM Bangalore — equipping her with tools to scale social impact
              initiatives meaningfully.
            </p>
            <p>
              She believes that real change begins when individuals lead with empathy, collaborate openly,
              and act with unwavering integrity. Through Disha for India, she has created a platform
              where thousands of volunteers connect with verified NGOs to deliver lasting impact across
              education, healthcare, skill development, and community empowerment.
            </p>
          </div>

          {/* Quote Box */}
          <div className="founder-quote-box" role="blockquote">
            <Quote size={36} className="founder-quote-icon" />
            <p className="founder-quote-text">
              "Real change begins when people lead with purpose, compassion, and the courage to uplift others."
            </p>
          </div>

          {/* Achievements Grid */}
          <motion.div
            className="founder-achievements-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {achievements.map((a) => {
              const Icon = a.icon;
              return (
                <motion.div key={a.title} className="founder-ach-card" variants={fadeUp}>
                  <div className={`founder-ach-icon-wrap ${a.colorClass}`}>
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="founder-ach-title">{a.title}</p>
                    <p className="founder-ach-desc">{a.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Action Buttons */}
          <div className="founder-actions">
            <a href="#" className="founder-btn-primary" aria-label="Read Indu Aggarwal's full story">
              Read Full Story <ArrowRight size={18} />
            </a>
            <a href="#" className="founder-btn-secondary" aria-label="Connect with Disha for India">
              Connect With Us <Mail size={18} />
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  </section>
);

export default FounderSpotlight;
