import React from 'react';
import { motion } from 'framer-motion';

// Text fallback list for when logos don't load
const partnerNames = ['unicef', 'TATA', 'Infosys', 'Reliance Industries', 'Microsoft', 'Google', 'NITI Aayog', 'AND MORE +'];

const TrustBar = () => {
  return (
    <section style={{ background: 'white', borderTop: '1px solid #F0EDE8', borderBottom: '1px solid #F0EDE8', padding: '2.5rem 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <p style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '1.75rem' }}>
          Trusted by Leading Organizations
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          {partnerNames.map((name, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              style={{ position: 'relative' }}
            >
              <span
                style={{
                  fontSize: name === 'AND MORE +' ? '0.8rem' : '1.2rem',
                  fontWeight: 700,
                  color: '#9CA3AF',
                  fontFamily: 'var(--font-heading)',
                  cursor: 'default',
                  transition: 'color 0.3s',
                  letterSpacing: name === 'unicef' ? '0.12em' : 'normal',
                  textTransform: name === 'unicef' ? 'uppercase' : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-heading)'}
                onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
              >
                {name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
