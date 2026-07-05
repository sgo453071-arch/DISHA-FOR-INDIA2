import React from 'react';
import { motion } from 'framer-motion';
import { Users, Compass, Heart } from 'lucide-react';
import Button from '../common/Button';

/**
 * HeroV2 – Two-column editorial hero
 * Left: headline with Caveat accent word, description, 3 CTA buttons
 * Right: cinematic rounded hero image with subtle overlay
 */
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=85&w=1200';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const HeroV2 = () => {
  return (
    <section className="relative w-full min-h-[92vh] flex items-center bg-white overflow-hidden pt-24 pb-16 lg:pt-0 lg:pb-0">
      {/* Subtle warm background blobs */}
      <div className="absolute top-0 left-0 w-[45vw] h-[45vw] rounded-full bg-dfi-coral/5 blur-3xl -translate-x-1/4 -translate-y-1/4 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[30vw] h-[30vw] rounded-full bg-dfi-sage/5 blur-3xl translate-x-1/4 translate-y-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        {/* ── Left: Text Content ─────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex-1 w-full flex flex-col text-center lg:text-left"
        >
          {/* Eyebrow */}
          <motion.span
            variants={item}
            className="inline-block font-dfi-body text-sm font-semibold tracking-widest uppercase text-dfi-coral mb-6 mx-auto lg:mx-0"
          >
            India's Volunteer Platform
          </motion.span>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="font-dfi-heading font-extrabold text-5xl md:text-6xl text-dfi-dark leading-[1.1] mb-6"
          >
            Build Better{' '}
            <span className="font-dfi-script text-dfi-coral">
              Futures
            </span>{' '}
            Through Volunteering
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={item}
            className="font-dfi-body text-lg md:text-xl text-dfi-gray leading-relaxed mb-10 max-w-[520px] mx-auto lg:mx-0"
          >
            Join thousands of passionate volunteers helping NGOs across India
            create lasting, measurable impact in education, healthcare, and beyond.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4"
          >
            <Button variant="primary" to="/register" icon={Users} className="w-full sm:w-auto">
              Become a Volunteer
            </Button>
            <Button variant="secondary" to="/programs" icon={Compass} className="w-full sm:w-auto">
              Explore Programs
            </Button>
            <Button variant="ghost" to="/donate" icon={Heart} className="w-full sm:w-auto">
              Donate Now
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={item}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-10"
          >
            {[
              { label: '100K+ Lives Impacted' },
              { label: '10K+ Volunteers' },
              { label: '500+ Programs' },
            ].map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-2 bg-dfi-soft border border-dfi-border rounded-full px-4 py-2 text-sm font-dfi-body font-semibold text-dfi-dark shadow-soft"
              >
                <span className="w-2 h-2 rounded-full bg-dfi-coral inline-block" />
                {badge.label}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right: Hero Image ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
          className="flex-1 w-full relative h-[420px] sm:h-[520px] lg:h-[75vh]"
        >
          {/* Floating decoration */}
          <motion.div
            animate={{ y: [0, -16, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-6 -right-6 w-28 h-28 rounded-[24px] bg-dfi-coral/15 -z-10"
          />
          <motion.div
            animate={{ y: [0, 16, 0], rotate: [0, -4, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-6 -left-6 w-36 h-36 rounded-full bg-dfi-sage/15 -z-10"
          />

          <div className="relative w-full h-full rounded-[28px] overflow-hidden shadow-soft-lg">
            <img
              src={HERO_IMAGE}
              alt="Volunteers working with children in rural India"
              className="w-full h-full object-cover"
              loading="eager"
              fetchpriority="high"
            />
            {/* Very subtle warm overlay – doesn't compete with the photo */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dfi-dark/10" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroV2;
