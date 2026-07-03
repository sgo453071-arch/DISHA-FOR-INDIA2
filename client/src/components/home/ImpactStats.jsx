import React from 'react';
import { motion } from 'framer-motion';

const counterData = [
  { value: 100000, display: '100K+', label: 'Lives Impacted', suffix: '', color: '#D35400' },
  { value: 10000, display: '10K+', label: 'Active Volunteers', suffix: '', color: '#059669' },
  { value: 500, display: '500+', label: 'Programs Completed', suffix: '', color: '#7C3AED' },
  { value: 50, display: '50+', label: 'Partner NGOs', suffix: '', color: '#0284C7' },
  { value: 18, display: '18', label: 'States Reached', suffix: '', color: '#D97706' },
];

const ImpactStats = () => {
  return (
    <section style={{ background: 'var(--color-heading)', padding: '4rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem' }}>
          {counterData.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.5rem 1rem', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontFamily: 'var(--font-heading)', fontWeight: 800, color: item.color, lineHeight: 1, marginBottom: '0.4rem' }}>
                {item.display}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', fontWeight: 600, letterSpacing: '0.03em' }}>
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
