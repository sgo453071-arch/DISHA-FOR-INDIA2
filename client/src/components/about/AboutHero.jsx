import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Heart, Users, FolderOpen, UserPlus } from 'lucide-react';
import './AboutHero.css';

const AboutHero = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="about-hero-section" aria-labelledby="about-hero-heading">
      
      {/* Subtle decorative dot pattern */}
      <div className="ah-deco-dots" aria-hidden="true">
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ahDot" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="#E86A1D" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#ahDot)" />
        </svg>
      </div>

      <motion.div 
        className="about-hero-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* Left Side Content */}
        <div className="about-hero-content">
          <motion.div className="about-hero-accent-wrap" variants={itemVariants}>
            {/* Small leaf SVG accent */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E86A1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
            <span className="about-hero-accent">About Disha For India</span>
          </motion.div>
          
          <motion.h1 id="about-hero-heading" className="about-hero-title" variants={itemVariants}>
            Empowering Communities.<br/>Transforming Lives.
          </motion.h1>
          
          <motion.p className="about-hero-desc" variants={itemVariants}>
            Disha For India is a trusted volunteering platform connecting passionate individuals with verified NGOs to create meaningful social impact. Through education, healthcare, skill development, women empowerment, disaster relief, and community initiatives, we empower people to become changemakers and build a stronger, more inclusive India.
          </motion.p>
          
          <motion.div className="about-hero-buttons" variants={itemVariants}>
            <a href="/programs" className="ah-btn ah-btn-primary">
              <Compass size={20} /> Explore Programs
            </a>
            <a href="/register" className="ah-btn ah-btn-secondary">
              <Heart size={20} /> Join Our Mission
            </a>
          </motion.div>
        </div>

        {/* Right Side Image Area */}
        <motion.div className="about-hero-image-wrap" variants={imageVariants}>
          <img 
            src="https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=1200" 
            alt="Volunteers planting trees and smiling together - Placeholder for official DFI photo" 
            className="about-hero-img"
          />
          
          {/* Overlay Statistics Cards */}
          <div className="ah-stats-container">
            {/* Stat Card 1 */}
            <motion.div className="ah-stat-card" variants={statsVariants}>
              <div className="ah-stat-icon orange">
                <Users size={24} strokeWidth={2.5} />
              </div>
              <div className="ah-stat-text">
                <div className="ah-stat-num">100K+</div>
                <div className="ah-stat-label">Lives Impacted</div>
              </div>
            </motion.div>
            
            {/* Stat Card 2 */}
            <motion.div className="ah-stat-card" variants={statsVariants}>
              <div className="ah-stat-icon green">
                <FolderOpen size={24} strokeWidth={2.5} />
              </div>
              <div className="ah-stat-text">
                <div className="ah-stat-num">500+</div>
                <div className="ah-stat-label">Programs</div>
              </div>
            </motion.div>

            {/* Stat Card 3 */}
            <motion.div className="ah-stat-card" variants={statsVariants}>
              <div className="ah-stat-icon purple">
                <UserPlus size={24} strokeWidth={2.5} />
              </div>
              <div className="ah-stat-text">
                <div className="ah-stat-num">10K+</div>
                <div className="ah-stat-label">Volunteers</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default AboutHero;
