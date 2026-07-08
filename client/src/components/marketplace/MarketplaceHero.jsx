import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const MarketplaceHero = ({ coins, level, onBrowse }) => {
  const motivationalMessages = [
    'Every coin you earn is a step towards making a difference. Keep volunteering!',
    'Your dedication is paying off. Redeem amazing rewards with your hard-earned coins!',
    'You\'re doing incredible work. Treat yourself to a well-deserved reward!',
    'Impact lives, earn coins, claim rewards. That\'s the Disha way!',
    'Your volunteer journey is extraordinary. Explore what your coins can unlock!',
  ];

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d1b69 50%, #1a1a2e 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: '-40px', right: '-20px', opacity: 0.06 }}>
        <Sparkles size={200} />
      </div>
      <div style={{ position: 'absolute', bottom: '-30px', left: '-10px', opacity: 0.04 }}>
        <Sparkles size={160} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.875rem', borderRadius: '999px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '1rem' }}>
          <Sparkles size={14} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Disha Marketplace</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, margin: '0 0 0.75rem 0', lineHeight: 1.2 }}>
          Redeem Your Impact
        </h1>

        <p style={{ fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem', opacity: 0.85, maxWidth: '500px' }}>
          {randomMessage}
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Your Coins</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{coins.toLocaleString()}</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', margin: '0 0.5rem' }} />
            <div>
              <div style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Level</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{level || 'Beginner'}</div>
            </div>
          </div>
          <button
            onClick={onBrowse}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'white',
              color: '#1e3a5f',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            }}
          >
            Browse Rewards
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHero;
