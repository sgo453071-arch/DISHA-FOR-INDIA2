import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock, Users, CheckCircle } from 'lucide-react';
import { getAllPrograms } from '../../services/programsService';
import { safeSlice } from '../../utils/safeSlice';

const categoryColors = {
  'Education': { bg: '#DBEAFE', color: '#1D4ED8', label: 'Education' },
  'Environment': { bg: '#D1FAE5', color: '#065F46', label: 'Environment' },
  'Health': { bg: '#FCE7F3', color: '#9D174D', label: 'Health' },
  'Community': { bg: '#EDE9FE', color: '#5B21B6', label: 'Community' },
  'Technology': { bg: '#FEF3C7', color: '#92400E', label: 'Technology' },
  'Default': { bg: '#F3F4F6', color: '#374151', label: 'General' },
};

const getCategoryStyle = (category) => categoryColors[category] || categoryColors['Default'];

const SkeletonCard = () => (
  <div style={{ borderRadius: 16, background: 'white', border: '1px solid #F0EDE8', overflow: 'hidden' }}>
    <div style={{ height: 180, background: 'linear-gradient(90deg, #F5F3EF 25%, #EDE9E0 50%, #F5F3EF 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ height: 12, background: '#F5F3EF', borderRadius: 6, width: '40%', animation: 'shimmer 1.5s infinite' }} />
      <div style={{ height: 16, background: '#F5F3EF', borderRadius: 6, width: '80%', animation: 'shimmer 1.5s infinite' }} />
      <div style={{ height: 12, background: '#F5F3EF', borderRadius: 6, width: '60%', animation: 'shimmer 1.5s infinite' }} />
    </div>
  </div>
);

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllPrograms({ limit: 4, status: 'active' });
      if (response.success) {
        setPrograms(response.data?.programs || response.data || []);
      } else {
        setError('Could not load programs.');
      }
    } catch {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <section style={{ background: '#FDFBF7', padding: '5rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              Featured Programs
            </h2>
            <p style={{ color: 'var(--color-body)', fontSize: '0.95rem' }}>
              Curated opportunities to create real impact across India.
            </p>
          </div>
          <Link
            to="/programs"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none', padding: '0.5rem 1rem', border: '1.5px solid rgba(211,84,0,0.25)', borderRadius: 8, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(211,84,0,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            View All Programs <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: 16, border: '1px solid #F0EDE8' }}>
            <p style={{ color: 'var(--color-body)', marginBottom: '1rem' }}>{error}</p>
            <button
              onClick={fetchPrograms}
              style={{ padding: '0.6rem 1.25rem', background: 'var(--color-primary)', color: 'white', borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              Retry
            </button>
          </div>
        ) : programs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: 16, border: '1px solid #F0EDE8' }}>
            <p style={{ color: 'var(--color-body)' }}>No programs available right now. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {programs.map((program, index) => {
              const cat = getCategoryStyle(program.category);
              const seatsLeft = program.seatsRemaining ?? program.seats ?? '—';
              const skills = program.skills || [];
              return (
                <motion.div
                  key={program._id || program.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  style={{ background: 'white', borderRadius: 16, border: '1px solid #F0EDE8', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                    <img
                      src={program.image || `https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800`}
                      alt={program.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      loading="lazy"
                    />
                    {/* Category badge */}
                    <span style={{ position: 'absolute', top: 12, right: 12, padding: '0.25rem 0.65rem', borderRadius: 999, background: cat.bg, color: cat.color, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                      {program.category || 'General'}
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '1.125rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-heading)', lineHeight: 1.3, margin: 0 }}>
                      {program.title}
                    </h3>

                    {/* NGO */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-body)', fontWeight: 500 }}>{program.ngoName || program.ngo || 'Partner NGO'}</span>
                      <CheckCircle size={13} color="#059669" fill="#059669" />
                    </div>

                    {/* Meta */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {program.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--color-body)' }}>
                          <MapPin size={12} /> {program.location}
                        </span>
                      )}
                      {program.duration && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--color-body)' }}>
                          <Clock size={12} /> {program.duration}
                        </span>
                      )}
                    </div>

                    {/* Skills */}
                    {skills.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-body)', fontWeight: 600 }}>Skills:</span>
                        {skills.slice(0, 3).map((s, i) => (
                          <span key={i} style={{ fontSize: '0.7rem', color: 'var(--color-body)' }}>{s}{i < Math.min(skills.length, 3) - 1 ? ',' : ''}</span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #F0EDE8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>
                        <Users size={13} /> {seatsLeft} Seats Left
                      </span>
                      <Link
                        to={`/programs/${program._id || program.id}`}
                        style={{ padding: '0.45rem 1rem', borderRadius: 8, background: 'var(--color-primary)', color: 'white', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Programs;
