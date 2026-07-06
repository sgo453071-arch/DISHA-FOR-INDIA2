import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Handshake, MapPin, Rocket } from 'lucide-react';
import './OurJourneyTimeline.css';

const timelineData = [
  {
    id: 1,
    title: 'The Beginning',
    icon: Lightbulb,
    description: 'Disha For India was founded with a simple yet powerful vision—to bridge the gap between passionate individuals and meaningful opportunities to create social impact. The mission was to empower every citizen to contribute toward building a stronger, more compassionate India.',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=vision&backgroundColor=ffffff&shape1Color=E86A1D&shape2Color=0F172A'
  },
  {
    id: 2,
    title: 'First Community Initiative',
    icon: Handshake,
    description: 'Our first volunteer-driven initiatives focused on education and community outreach. These early programs demonstrated the incredible impact of collective action and laid the foundation for future growth.',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=community&backgroundColor=ffffff&shape1Color=059669&shape2Color=E86A1D'
  },
  {
    id: 3,
    title: 'Growing Across India',
    icon: MapPin,
    description: 'As partnerships expanded, Disha For India reached multiple states, collaborating with NGOs, educational institutions, and volunteers to address diverse social challenges across the country.',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=india&backgroundColor=ffffff&shape1Color=7C3AED&shape2Color=E86A1D'
  },
  {
    id: 4,
    title: 'Today',
    icon: Rocket,
    description: 'Today, Disha For India continues to build a nationwide volunteer ecosystem that empowers thousands of changemakers, creating measurable impact through education, healthcare, skill development, environmental initiatives, and community empowerment.',
    image: 'https://api.dicebear.com/7.x/shapes/svg?seed=today&backgroundColor=ffffff&shape1Color=0284C7&shape2Color=E86A1D'
  }
];

const OurJourneyTimeline = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const lineVariants = {
    hidden: { height: 0 },
    visible: { height: '100%', transition: { duration: 1.5, ease: "easeInOut" } }
  };

  const itemVariants = (index) => ({
    hidden: { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  });

  const markerVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5, type: "spring", bounce: 0.4 } }
  };

  return (
    <section className="journey-section" aria-labelledby="journey-heading">
      
      {/* Decorative Elements */}
      <div className="journey-deco-blob" aria-hidden="true" />
      <div className="journey-deco-blob-2" aria-hidden="true" />

      <div className="journey-container">
        
        {/* Header */}
        <motion.div 
          className="journey-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="journey-accent">Our Story</span>
          <h2 id="journey-heading" className="journey-title">
            Our Journey
          </h2>
          <p className="journey-desc">
            Every meaningful movement begins with a single step. Here's how Disha For India has grown from a vision into a nationwide platform connecting thousands of volunteers with opportunities to create lasting social impact.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="timeline-wrapper">
          
          {/* Central Line */}
          <motion.div 
            className="timeline-line"
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {timelineData.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="timeline-item">
                  
                  {/* Central Marker */}
                  <motion.div className="timeline-marker" variants={markerVariants}>
                    <Icon size={24} />
                  </motion.div>
                  
                  {/* Content Card */}
                  <motion.div className="timeline-content" variants={itemVariants(index)}>
                    <div className="timeline-img-wrap">
                      <img src={item.image} alt="Milestone illustration" className="timeline-img" />
                    </div>
                    <div className="timeline-text">
                      <h3 className="timeline-card-title">{item.title}</h3>
                      <p className="timeline-card-desc">{item.description}</p>
                    </div>
                  </motion.div>

                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurJourneyTimeline;
