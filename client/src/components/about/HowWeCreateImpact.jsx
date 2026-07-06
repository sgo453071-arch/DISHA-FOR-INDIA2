import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { UserPlus, ShieldCheck, MapPinned, HeartHandshake, Sparkles } from 'lucide-react';
import './HowWeCreateImpact.css';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Join',
    desc: 'Create your DFI profile and become part of a growing community committed to making a difference.',
  },
  {
    number: '02',
    icon: ShieldCheck,
    title: 'Get Verified',
    desc: 'Complete your profile verification to ensure a trusted, transparent, and secure volunteering experience.',
  },
  {
    number: '03',
    icon: MapPinned,
    title: 'Choose Program',
    desc: 'Browse verified programs across education, healthcare, environment, women empowerment, and more.',
  },
  {
    number: '04',
    icon: HeartHandshake,
    title: 'Volunteer',
    desc: 'Work alongside NGOs and communities to create meaningful social impact through hands-on volunteering.',
  },
  {
    number: '05',
    icon: Sparkles,
    title: 'Create Impact',
    desc: 'See the positive change you\'ve helped create while inspiring others to contribute to a stronger India.',
  },
];

const HowWeCreateImpact = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  // Framer motion variants
  const headerVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const cardVariants = (i) => ({
    hidden: { opacity: 0, y: 45 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: 'easeOut',
        delay: i * 0.15 + 0.3
      } 
    },
  });

  return (
    <section className="process-section" aria-labelledby="process-heading" ref={containerRef}>
      
      {/* Decorative ambient elements */}
      <div className="process-deco-blob process-deco-blob-1" aria-hidden="true" />
      <div className="process-deco-blob process-deco-blob-2" aria-hidden="true" />
      
      <div className="process-container">
        
        {/* Section Header */}
        <motion.div 
          className="process-header"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={headerVariants}
        >
          <span className="process-accent">Our Process</span>
          <h2 id="process-heading" className="process-title">How We Create Impact</h2>
          <p className="process-desc">
            Every meaningful change begins with one simple action. Here's how Disha for India transforms passionate individuals into changemakers through a seamless volunteering journey.
          </p>
        </motion.div>

        {/* Storytelling Process Flow */}
        <div className={`process-journey ${isInView ? 'in-view' : ''}`}>
          
          {/* Curved Connector Line (Visible only on Desktop) */}
          <div className="process-svg-container" aria-hidden="true">
            <svg width="100%" height="100%" viewBox="0 0 1000 100" fill="none" preserveAspectRatio="none">
              {/* Background dashed curve path */}
              <path 
                d="M 20,50 Q 250,110 500,50 T 980,50" 
                className="process-svg-line" 
              />
              {/* Active animated solid path */}
              <path 
                d="M 20,50 Q 250,110 500,50 T 980,50" 
                className="process-svg-line-active" 
              />
              {/* Slow-moving dot along path */}
              <circle r="5" className="process-moving-dot">
                <animateMotion 
                  dur="10s" 
                  repeatCount="indefinite" 
                  path="M 20,50 Q 250,110 500,50 T 980,50" 
                />
              </circle>
            </svg>
          </div>

          {/* Grid of Steps */}
          <div className="process-grid">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div 
                  key={step.number}
                  className="process-card-wrap"
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  variants={cardVariants(index)}
                >
                  {/* Step Card */}
                  <article className="process-card" aria-label={`Step ${step.number}: ${step.title}`}>
                    {/* Icon Container */}
                    <div className="process-icon-wrap" aria-hidden="true">
                      <Icon size={28} strokeWidth={1.8} />
                    </div>
                    
                    {/* Step Title & Description */}
                    <h3 className="process-card-title">{step.title}</h3>
                    <p className="process-card-desc">{step.desc}</p>
                  </article>

                  {/* Step Number Badge */}
                  <span className="process-number-badge">{step.number}</span>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Bottom CTA Block */}
        <motion.div 
          className="process-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="process-cta-title">Ready to Begin Your Journey?</h3>
          <p className="process-cta-desc">Join thousands of volunteers creating meaningful impact across India.</p>
          <div className="process-cta-actions">
            <a href="#" className="btn-primary-orange" role="button">
              Become a Volunteer
            </a>
            <a href="#" className="btn-secondary-outline" role="button">
              Explore Programs
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HowWeCreateImpact;
