import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Trophy, Gift, Network, Zap } from 'lucide-react';

const features = [
  {
    icon: <ShieldCheck size={26} />,
    iconColor: '#059669', iconBg: '#D1FAE5',
    title: 'Verified Impact',
    desc: 'All NGOs and programs are verified and transparent. Your time goes to causes that truly matter.',
  },
  {
    icon: <ShieldCheck size={26} />,
    iconColor: '#7C3AED', iconBg: '#EDE9FE',
    title: 'Verified Certificates',
    desc: 'Blockchain-backed certificates with QR verification that employers and universities trust instantly.',
  },
  {
    icon: <Trophy size={26} />,
    iconColor: '#D97706', iconBg: '#FEF3C7',
    title: 'Leaderboard',
    desc: 'Compete, grow, and earn your place on the national leaderboard. Rise through the ranks.',
  },
  {
    icon: <Gift size={26} />,
    iconColor: '#DB2777', iconBg: '#FCE7F3',
    title: 'Exclusive Rewards',
    desc: 'Earn badges, unlock rewards & special opportunities as you level up your volunteer journey.',
  },
  {
    icon: <Network size={26} />,
    iconColor: '#0284C7', iconBg: '#E0F2FE',
    title: 'Professional Network',
    desc: 'Connect with NGO leaders, corporate CSR heads, and like-minded changemakers across India.',
  },
  {
    icon: <Zap size={26} />,
    iconColor: '#D35400', iconBg: '#FFF3ED',
    title: 'Skill Development',
    desc: 'Build real-world skills and boost your career through hands-on field experience.',
  },
];

const WhyDFI = () => {
  return (
    <section style={{ background: 'white', padding: '5rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: 'var(--color-heading)', marginBottom: '0.75rem' }}>
            Why Choose DFI?
          </h2>
          <p style={{ color: 'var(--color-body)', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
            We make volunteering meaningful, transparent, and rewarding.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{ background: '#FDFBF7', borderRadius: 16, padding: '1.5rem', border: '1px solid #F0EDE8', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem', cursor: 'default', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 14, background: f.iconBg, color: f.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-heading)', margin: 0 }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '0.83rem', color: 'var(--color-body)', lineHeight: 1.6, margin: 0 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyDFI;
