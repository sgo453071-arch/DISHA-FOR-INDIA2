import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

/**
 * TestimonialsV2
 * Dark teal background (#22383C) per design spec.
 * All text in white/white-muted so it reads clearly.
 * Arrows + pagination dots. Autoplay with pause-on-hover.
 * Keyboard navigation (←/→). Touch swipe via pointer events.
 */
const testimonials = [
  {
    id: 1,
    name: 'Neha Sharma',
    role: 'Founder, Seva Saathi Foundation',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=faces&fit=crop&w=200&h=200&auto=format&q=80',
    quote:
      'Disha for India has been a true partner in scaling our impact. Their volunteers are dedicated, professional, and deeply committed to service.',
  },
  {
    id: 2,
    name: 'Rajiv Menon',
    role: 'Director, HealthFirst India',
    image:
      'https://images.unsplash.com/photo-1547425260-2c2cb4396ddb?crop=faces&fit=crop&w=200&h=200&auto=format&q=80',
    quote:
      'The dedication and passion of Disha volunteers have transformed our community health initiatives beyond what we thought possible.',
  },
  {
    id: 3,
    name: 'Dr. Anjali Desai',
    role: 'Head of Operations, EduCare NGO',
    image:
      'https://images.unsplash.com/photo-1554151228-1a2e3cda71d5?crop=faces&fit=crop&w=200&h=200&auto=format&q=80',
    quote:
      'A phenomenal platform that connects talent with purpose. Our education programs have flourished thanks to the quality of volunteers DFI sends.',
  },
];

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: (dir) => ({
    opacity: 0,
    x: dir > 0 ? -60 : 60,
    transition: { duration: 0.35, ease: 'easeIn' },
  }),
};

const TestimonialsV2 = () => {
  const [[current, direction], setState] = useState([0, 1]);
  const total = testimonials.length;
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  // touch/swipe
  const touchStartX = useRef(null);

  const goTo = (idx, dir) => setState([idx, dir]);
  const next = () => goTo((current + 1) % total, 1);
  const prev = () => goTo((current - 1 + total) % total, -1);

  const startAutoplay = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 6000);
  };
  const stopAutoplay = () => clearInterval(intervalRef.current);

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { stopAutoplay(); prev(); startAutoplay(); }
    if (e.key === 'ArrowRight') { stopAutoplay(); next(); startAutoplay(); }
  };

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); }
    touchStartX.current = null;
  };

  const t = testimonials[current];

  return (
    <section
      className="py-20 md:py-28"
      style={{ backgroundColor: '#22383C' }}
      aria-label="Testimonials"
    >
      <div
        className="max-w-7xl mx-auto px-6 lg:px-8"
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Section label */}
        <div className="text-center mb-12">
          <span className="inline-block font-dfi-body text-sm font-semibold tracking-widest uppercase text-dfi-coral mb-4">
            What People Say
          </span>
          <h2 className="font-dfi-heading font-extrabold text-3xl md:text-4xl text-white">
            Voices of Impact
          </h2>
        </div>

        {/* Slide */}
        <div className="relative min-h-[280px] md:min-h-[220px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={t.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col md:flex-row items-center gap-8 bg-white/5 border border-white/10 backdrop-blur-sm rounded-[24px] p-8 md:p-12"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={t.image}
                  alt={t.name}
                  loading="lazy"
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-dfi-coral/60 shadow-lg"
                />
              </div>

              {/* Quote content */}
              <div className="flex-1 text-center md:text-left">
                <Quote className="w-8 h-8 text-dfi-coral mb-4 mx-auto md:mx-0" aria-hidden="true" />
                <p className="font-dfi-body text-lg md:text-xl text-white/90 leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>
                <p className="font-dfi-heading font-bold text-xl text-white">{t.name}</p>
                <p className="font-dfi-body text-sm text-white/60 mt-1">{t.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrow buttons – overlaid on sides */}
          <button
            onClick={() => { stopAutoplay(); prev(); startAutoplay(); }}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-10 h-10 rounded-full bg-white/10 hover:bg-dfi-coral/80 flex items-center justify-center transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-dfi-coral"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => { stopAutoplay(); next(); startAutoplay(); }}
            aria-label="Next testimonial"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-10 h-10 rounded-full bg-white/10 hover:bg-dfi-coral/80 flex items-center justify-center transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-dfi-coral"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center items-center gap-2 mt-8" role="tablist" aria-label="Testimonial navigation">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={idx === current}
              aria-label={`Go to testimonial ${idx + 1}`}
              onClick={() => { stopAutoplay(); goTo(idx, idx > current ? 1 : -1); startAutoplay(); }}
              className={`rounded-full transition-all duration-300 ${
                idx === current
                  ? 'bg-dfi-coral w-8 h-3'
                  : 'bg-white/30 hover:bg-white/60 w-3 h-3'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsV2;
