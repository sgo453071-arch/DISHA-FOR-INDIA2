import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import { recentBlogs } from '../../constants/homeData';

const Blogs = () => {
  return (
    <section style={{ background: 'white', padding: '5rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              Latest Insights
            </h2>
            <p style={{ color: 'var(--color-body)', fontSize: '0.95rem' }}>
              Stories, thoughts, and updates from the DFI community.
            </p>
          </div>
          <button
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem 0' }}
          >
            View All Articles <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {recentBlogs.map((blog, i) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{ background: '#FDFBF7', borderRadius: 16, border: '1px solid #F0EDE8', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
            >
              {/* Image */}
              <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                <img
                  src={blog.image}
                  alt={blog.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                {/* Category badge */}
                <span style={{ position: 'absolute', top: 12, left: 12, padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-heading)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Tag size={10} color="var(--color-primary)" /> {blog.category}
                </span>
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {/* Meta */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600 }}>
                    <Calendar size={12} /> {blog.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600 }}>
                    <Clock size={12} /> {blog.readTime}
                  </span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-heading)', lineHeight: 1.35, margin: 0 }}>
                  {blog.title}
                </h3>
                <p style={{ fontSize: '0.83rem', color: 'var(--color-body)', lineHeight: 1.65, margin: 0, flex: 1 }}>
                  {blog.excerpt}
                </p>

                <button
                  style={{ alignSelf: 'flex-start', marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  Read More <ArrowRight size={14} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
