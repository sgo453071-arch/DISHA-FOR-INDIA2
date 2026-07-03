import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryImages } from '../../constants/homeData';
import { X, ZoomIn } from 'lucide-react';

const Gallery = () => {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section style={{ background: '#FDFBF7', padding: '5rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
            A Glimpse of Change
          </h2>
          <p style={{ color: 'var(--color-body)', fontSize: '0.95rem' }}>
            Moments captured across India where volunteers came together to create impact.
          </p>
        </div>

        {/* Masonry-style grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', gridAutoRows: '200px' }}>
          {galleryImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              onClick={() => setLightbox(img)}
              style={{
                borderRadius: 14,
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                gridRow: i === 2 || i === 5 ? 'span 2' : 'span 1',
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.35)'; e.currentTarget.querySelector('.zoom-icon').style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0)'; e.currentTarget.querySelector('.zoom-icon').style.opacity = '0'; }}
              >
                <div className="zoom-icon" style={{ opacity: 0, transition: 'opacity 0.3s', color: 'white' }}>
                  <ZoomIn size={32} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          >
            <button
              onClick={() => setLightbox(null)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={22} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={lightbox.src}
              alt={lightbox.alt}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 16, objectFit: 'contain', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}
            />
            <p style={{ position: 'absolute', bottom: '2rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{lightbox.alt}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
