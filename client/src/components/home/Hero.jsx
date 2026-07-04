import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Play, ShieldCheck, Award, TrendingUp, Star, Users, MapPin, Briefcase } from 'lucide-react';

const statPills = [
  { icon: <Users size={16} />, value: '100K+', label: 'Lives Impacted', color: '#D35400', bg: '#FFF3ED' },
  { icon: <Heart size={16} />, value: '10K+', label: 'Active Volunteers', color: '#059669', bg: '#ECFDF5' },
  { icon: <Briefcase size={16} />, value: '500+', label: 'Programs', color: '#7C3AED', bg: '#F5F3FF' },
  { icon: <MapPin size={16} />, value: '18', label: 'States Reached', color: '#0284C7', bg: '#F0F9FF' },
  { icon: <Award size={16} />, value: '50+', label: 'Partner NGOs', color: '#D97706', bg: '#FFFBEB' },
];

const floatingBadges = [
  {
    icon: <ShieldCheck size={20} color="#059669" />,
    title: 'Verified NGOs',
    sub: '100% Verified',
    bg: 'white',
    top: '12%', right: '-20px',
  },
  {
    icon: <Award size={20} color="#7C3AED" />,
    title: 'Verified Certificates',
    sub: 'Blockchain Secured',
    bg: 'white',
    top: '42%', right: '-30px',
  },
  {
    icon: <TrendingUp size={20} color="#0284C7" />,
    title: 'Career Growth',
    sub: 'Skills · Leadership · Portfolio',
    bg: 'white',
    top: '68%', right: '-10px',
  },
];

const Hero = () => {
  return (
    <section style={{ background: '#FDFBF7', paddingTop: '0', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem', width: '100%' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>

          {/* ── LEFT CONTENT ── */}
          <div style={{ flex: '1 1 480px', maxWidth: 580 }}>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.375rem 0.875rem', background: 'rgba(211,84,0,0.08)', borderRadius: 999, marginBottom: '1.5rem' }}>
                <Heart size={14} color="var(--color-primary)" fill="var(--color-primary)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.02em' }}>Join the Movement for Change</span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.4rem, 5vw, 3.5rem)', fontWeight: 800, color: 'var(--color-heading)', lineHeight: 1.15, marginBottom: '0.5rem' }}>
                Transforming Lives,
              </h1>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.4rem, 5vw, 3.5rem)', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1.15, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                Building Futures.
                <Heart size={36} color="var(--color-primary)" fill="var(--color-primary)" style={{ display: 'inline', verticalAlign: 'middle' }} />
              </h1>

              <p style={{ fontSize: '1.05rem', color: 'var(--color-body)', lineHeight: 1.75, marginBottom: '2rem', maxWidth: 480 }}>
                Disha for India connects passionate volunteers with verified NGOs
                to <strong style={{ color: 'var(--color-heading)', fontWeight: 700 }}>create meaningful impact</strong> and{' '}
                <strong style={{ color: 'var(--color-heading)', fontWeight: 700 }}>build a better tomorrow.</strong>
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}
            >
              <Link
                to="/register"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.75rem 1.5rem', borderRadius: 10, background: 'var(--color-primary)', color: 'white', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 4px 16px rgba(211,84,0,0.3)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'none'; }}
              >
                <Users size={16} /> Become a Volunteer
              </Link>
              <Link
                to="/programs"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.75rem 1.25rem', borderRadius: 10, background: 'white', color: 'var(--color-heading)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', border: '1.5px solid #E8E3D9', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E3D9'; e.currentTarget.style.color = 'var(--color-heading)'; }}
              >
                <ArrowRight size={16} /> Explore Programs
              </Link>
              <Link
                to="/donate"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.75rem 1.25rem', borderRadius: 10, background: 'white', color: 'var(--color-heading)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', border: '1.5px solid #E8E3D9', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#E8E3D9'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E3D9'; }}
              >
                <Heart size={16} /> Donate Now
              </Link>
              <button
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.75rem 1.25rem', borderRadius: 10, background: 'white', color: 'var(--color-heading)', fontWeight: 700, fontSize: '0.9rem', border: '1.5px solid #E8E3D9', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <Play size={16} fill="currentColor" /> Watch Story
              </button>
            </motion.div>

            {/* Stat Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
            >
              {statPills.map((pill, i) => (
                <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.875rem', borderRadius: 999, background: pill.bg, color: pill.color, border: `1px solid ${pill.color}22` }}>
                  {pill.icon}
                  <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{pill.value}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 500, opacity: 0.85 }}>{pill.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT IMAGE ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ flex: '1 1 400px', position: 'relative', maxWidth: 560, minHeight: 480 }}
          >
            <div style={{ borderRadius: '2rem', overflow: 'hidden', aspectRatio: '4/3' }}>
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200"
                alt="DFI volunteers creating community impact"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="eager"
              />
            </div>

            {/* Floating badges */}
            {floatingBadges.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
                style={{
                  position: 'absolute', top: badge.top, right: badge.right,
                  background: badge.bg, borderRadius: 12, padding: '0.625rem 0.875rem',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: 10,
                  backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.8)',
                  minWidth: 180, zIndex: 10,
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {badge.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#111827', lineHeight: 1.2 }}>{badge.title}</div>
                  <div style={{ fontSize: '0.7rem', color: '#6B7280', lineHeight: 1.2, marginTop: 2 }}>{badge.sub}</div>
                </div>
              </motion.div>
            ))}

            {/* Bottom right banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              style={{
                position: 'absolute', bottom: '-16px', left: '10%',
                background: '#1F2937', borderRadius: 14, padding: '0.75rem 1.25rem',
                display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={18} color="white" fill="white" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'white' }}>Your Impact Matters</div>
                <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Track · Learn · Grow</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
