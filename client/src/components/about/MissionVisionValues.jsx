import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Gem, Shield, Scale, Users, UserCheck, Lightbulb } from 'lucide-react';
import './MissionVisionValues.css';

const values = [
  { label: 'Transparency', icon: Shield },
  { label: 'Integrity',     icon: Scale },
  { label: 'Collaboration', icon: Users },
  { label: 'Empowerment',   icon: UserCheck },
  { label: 'Innovation',    icon: Lightbulb },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const badgeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' }
  })
};

const MissionVisionValues = () => {
  return (
    <section className="mvv-section" aria-labelledby="mvv-heading">

      {/* Decorative elements */}
      <div className="mvv-deco-blob-tl" aria-hidden="true" />
      <div className="mvv-deco-blob-br" aria-hidden="true" />
      <div className="mvv-deco-circle mvv-deco-circle-1" aria-hidden="true" />
      <div className="mvv-deco-circle mvv-deco-circle-2" aria-hidden="true" />
      <div className="mvv-deco-dots" aria-hidden="true">
        <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mvvDot" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="#E86A1D" />
            </pattern>
          </defs>
          <rect width="120" height="120" fill="url(#mvvDot)" />
        </svg>
      </div>

      <div className="mvv-container">

        {/* Header */}
        <motion.div
          className="mvv-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="mvv-accent">Our Purpose</span>
          <h2 id="mvv-heading" className="mvv-title">Mission • Vision • Values</h2>
          <p className="mvv-desc">
            Everything we do is guided by a clear purpose and a strong set of values that shape how we create meaningful impact across communities.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="mvv-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >

          {/* Mission Card */}
          <motion.div className="mvv-card" variants={cardVariants}>
            <div className="mvv-icon-wrap orange" aria-hidden="true">
              <Target size={32} strokeWidth={1.75} />
            </div>
            <h3 className="mvv-card-title">Mission</h3>
            <div className="mvv-card-rule" />
            <p className="mvv-card-desc">
              Helping communities through meaningful volunteer engagement by connecting passionate individuals with trusted NGOs and impactful social initiatives across India.
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div className="mvv-card" variants={cardVariants}>
            <div className="mvv-icon-wrap green" aria-hidden="true">
              <Eye size={32} strokeWidth={1.75} />
            </div>
            <h3 className="mvv-card-title">Vision</h3>
            <div className="mvv-card-rule" />
            <p className="mvv-card-desc">
              Creating an India where every individual has the opportunity to contribute toward positive social change through collaboration, compassion, and community service.
            </p>
          </motion.div>

          {/* Values Card */}
          <motion.div className="mvv-card" variants={cardVariants}>
            <div className="mvv-icon-wrap purple" aria-hidden="true">
              <Gem size={32} strokeWidth={1.75} />
            </div>
            <h3 className="mvv-card-title">Values</h3>
            <div className="mvv-card-rule" />
            <div className="mvv-badges-wrap">
              {values.map((val, i) => {
                const Icon = val.icon;
                return (
                  <motion.span
                    key={val.label}
                    className="mvv-badge"
                    custom={i}
                    variants={badgeVariants}
                    aria-label={val.label}
                  >
                    <Icon size={15} strokeWidth={2} />
                    {val.label}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default MissionVisionValues;
