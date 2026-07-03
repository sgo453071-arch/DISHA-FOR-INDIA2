import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, MapPin, Quote } from 'lucide-react';
import { successStories } from '../../constants/homeData';

const SuccessStories = () => {
  const [current, setCurrent] = useState(0);
  const total = successStories.length;

  const prev = () => setCurrent((c) => (c === 0 ? total - 1 : c - 1));
  const next = () => setCurrent((c) => (c + 1) % total);

  const story = successStories[current];

  return (
    <section style={{ background: 'white', padding: '5rem 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              Voices of Impact
            </h2>
            <p style={{ color: 'var(--color-body)', fontSize: '0.95rem', maxWidth: 480 }}>
              Real stories from the changemakers who are transforming communities through DFI.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={prev}
              aria-label="Previous"
              style={{ width: 44, height: 44, borderRadius: 10, border: '1.5px solid #E8E3D9', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-body)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E3D9'; e.currentTarget.style.color = 'var(--color-body)'; }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              style={{ width: 44, height: 44, borderRadius: 10, border: '1.5px solid #E8E3D9', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-body)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E3D9'; e.currentTarget.style.color = 'var(--color-body)'; }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 0, background: '#FDFBF7', borderRadius: 20, border: '1px solid #F0EDE8', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}
          >
            {/* Image */}
            <div style={{ flex: '0 0 340px', minHeight: 340, position: 'relative', overflow: 'hidden' }}>
              <img
                src={story.image}
                alt={story.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 340 }}
                loading="lazy"
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem' }}>
                <span style={{ display: 'inline-block', padding: '0.2rem 0.65rem', background: 'var(--color-primary)', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, color: 'white', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                  {story.program}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.9)', fontSize: '0.78rem' }}>
                  <MapPin size={12} /> {story.location}
                </div>
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: '1 1 320px', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem', position: 'relative' }}>
              <Quote size={64} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#F0EDE8', transform: 'rotate(180deg)' }} />

              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', color: 'var(--color-heading)', lineHeight: 1.6, fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
                "{story.quote}"
              </p>

              {/* Stars */}
              <div style={{ display: 'flex', gap: 3 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />)}
              </div>

              <div>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-heading)', marginBottom: '0.2rem' }}>{story.name}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>{story.role}</p>
              </div>

              <button style={{ alignSelf: 'flex-start', padding: '0.5rem 1.125rem', borderRadius: 8, border: '1.5px solid #E8E3D9', background: 'white', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-heading)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E3D9'; e.currentTarget.style.color = 'var(--color-heading)'; }}
              >
                Read Story →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          {successStories.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 999, border: 'none', background: i === current ? 'var(--color-primary)' : '#E8E3D9', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }}
              aria-label={`Go to story ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
