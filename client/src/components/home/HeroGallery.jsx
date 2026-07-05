import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { heroGalleryData } from '../../data/heroGalleryData';

const SLIDE_INTERVAL = 4500;
const TRANSITION_DURATION = 0.8;

const slideVariants = {
  enter: {
    opacity: 0,
  },
  center: {
    opacity: 1,
    transition: { duration: 1, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 1, ease: "easeInOut" },
  },
};

const HeroGallery = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isHovered, setIsHovered] = useState(false);
  const slideCount = heroGalleryData.length;

  const current = ((page % slideCount) + slideCount) % slideCount;
  const nextSlide = (((page + 1) % slideCount) + slideCount) % slideCount;

  // Preload next image
  useEffect(() => {
    const img = new Image();
    img.src = heroGalleryData[nextSlide].image;
  }, [nextSlide]);

  const paginate = useCallback((newDirection) => {
    setPage((prev) => [prev[0] + newDirection, newDirection]);
  }, []);

  const goToSlide = useCallback((index) => {
    const dir = index > current ? 1 : -1;
    setPage([index, dir]);
  }, [current]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => paginate(1), SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [paginate, isHovered]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); paginate(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); paginate(-1); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paginate]);

  const currentSlide = heroGalleryData[current];

  return (
    <section
      className="hero-gallery-container relative bg-black overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Hero photo gallery"
      aria-roledescription="carousel"
      aria-live="polite"
    >
      <style>{`
        .hero-gallery-container {
          width: 100%;
          max-width: none;
          margin-top: 76px;
          height: 400px;
        }
        .hero-slide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        @media (min-width: 768px) {
          .hero-gallery-container {
            height: 550px;
          }
        }
        @media (min-width: 1024px) {
          .hero-gallery-container {
            height: calc(100vh - 76px);
            min-height: 650px;
            max-height: 750px;
          }
        }
      `}</style>

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {/* Image */}
          <img
            src={currentSlide.image}
            alt={currentSlide.alt}
            loading={page === 0 ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={page === 0 ? 'high' : 'auto'}
            className="hero-slide-image"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.30)' }} />

          {/* Text Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.3 } }}
              className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 max-w-4xl tracking-tight leading-tight drop-shadow-lg"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Empowering India Through Volunteerism
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.4 } }}
              className="text-sm md:text-lg lg:text-xl text-gray-100 mb-8 max-w-2xl drop-shadow-md"
            >
              Connect with verified NGOs and create lasting impact.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.6, ease: "easeOut", delay: 0.5 } }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link 
                to="/register"
                className="bg-[#D35400] hover:bg-[#E67E22] text-white px-8 py-3 rounded-full font-bold transition-all transform hover:-translate-y-1 shadow-lg w-full sm:w-auto text-center"
              >
                Become Volunteer
              </Link>
              <Link 
                to="/programs"
                className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:-translate-y-1 shadow-lg w-full sm:w-auto text-center"
              >
                Explore Programs
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={() => paginate(-1)}
        aria-label="Previous slide"
        className="absolute z-20 flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-[#D35400] backdrop-blur-md border border-white/30 text-white transition-all shadow-lg hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        style={{ left: '30px', top: '50%', transform: 'translateY(-50%)' }}
      >
        <ChevronLeft size={24} strokeWidth={2.5} />
      </button>
      <button
        onClick={() => paginate(1)}
        aria-label="Next slide"
        className="absolute z-20 flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-[#D35400] backdrop-blur-md border border-white/30 text-white transition-all shadow-lg hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        style={{ right: '30px', top: '50%', transform: 'translateY(-50%)' }}
      >
        <ChevronRight size={24} strokeWidth={2.5} />
      </button>

      {/* Pagination Dots */}
      <div 
        className="absolute left-0 right-0 flex justify-center gap-3 z-20"
        style={{ bottom: '30px' }}
      >
        {heroGalleryData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === current ? 'true' : 'false'}
            className={`rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              idx === current ? 'w-8 h-2.5 bg-[#D35400]' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroGallery;
