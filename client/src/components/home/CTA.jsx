import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Users } from 'lucide-react';

const CTA = () => {
  return (
    <section style={{ position: 'relative', padding: '6rem 0', overflow: 'hidden', background: '#111827' }}>
      {/* Background */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.2,
        }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #111827 0%, rgba(17,24,39,0.8) 100%)' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ maxWidth: 640, margin: '0 auto' }}
        >
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(211,84,0,0.2)', border: '1px solid rgba(211,84,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <Heart size={32} color="var(--color-primary)" fill="var(--color-primary)" />
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Ready to Create Real Change?
          </h2>

          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: 520, margin: '0 auto 2.5rem' }}>
            Join thousands of individuals across India turning compassion into measurable impact. Start your journey today.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.875rem 2rem', borderRadius: 10, background: 'var(--color-primary)', color: 'white', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 6px 24px rgba(211,84,0,0.4)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'none'; }}
            >
              <Users size={18} /> Become a Volunteer
            </Link>
            <Link
              to="/donate"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.875rem 2rem', borderRadius: 10, background: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.2)', transition: 'all 0.2s', backdropFilter: 'blur(8px)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            >
              <Heart size={18} /> Donate Now
            </Link>
            <Link
              to="/programs"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.875rem 2rem', borderRadius: 10, background: 'transparent', color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.12)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
            >
              Browse Programs <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
