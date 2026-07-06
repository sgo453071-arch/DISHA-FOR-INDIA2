import React from 'react';
import { Play, ArrowRight, User, Users, Heart, BookOpen, Star } from 'lucide-react';
import './WhyDFI.css';

const videoStories = [
  {
    id: 1,
    title: 'From Our Founder',
    description: 'Indu Aggarwal shares the vision and mission behind Disha for India.',
    duration: '01:45',
    thumbnail: '/images/indu_aggarwal.png',
    categoryIcon: User,
    iconColor: '#D35400',
    iconBg: '#FEF0E8',
  },
  {
    id: 2,
    title: 'Volunteer Story',
    description: 'A volunteer shares how DFI helped him grow while making a difference.',
    duration: '01:32',
    thumbnail: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=800',
    categoryIcon: Users,
    iconColor: '#059669',
    iconBg: '#D1FAE5',
  },
  {
    id: 3,
    title: 'Community Impact',
    description: 'See how our programs are transforming communities across India.',
    duration: '01:28',
    thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
    categoryIcon: Heart,
    iconColor: '#7C3AED',
    iconBg: '#EDE9FE',
  },
  {
    id: 4,
    title: 'Program Highlights',
    description: 'A glimpse into our key initiatives and the change we\'re creating together.',
    duration: '02:10',
    thumbnail: 'https://images.unsplash.com/photo-1511949860472-b86a0b1f2371?auto=format&fit=crop&q=80&w=1200',
    categoryIcon: BookOpen,
    iconColor: '#D97706',
    iconBg: '#FEF3C7',
  },
  {
    id: 5,
    title: 'Volunteer Experience',
    description: 'Hear how volunteering with DFI has been a life-changing journey.',
    duration: '01:50',
    thumbnail: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=1200',
    categoryIcon: Star,
    iconColor: '#0284C7',
    iconBg: '#E0F2FE',
  }
];

const fallbackThumbnail = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800';

const WhyDFI = () => {
  const handleImageError = (e) => {
    if (e.target.src !== fallbackThumbnail) {
      e.target.src = fallbackThumbnail;
    }
  };

  return (
    <section className="why-section" aria-labelledby="why-heading">
      
      {/* Decorative background elements */}
      <div className="why-deco-blob" aria-hidden="true" />
      <div className="why-deco-dots" aria-hidden="true">
         {/* Simple SVG dot pattern */}
         <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
           <defs>
             <pattern id="whyDotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
               <circle cx="2" cy="2" r="2" fill="#000000" />
             </pattern>
           </defs>
           <rect width="120" height="120" fill="url(#whyDotPattern)" />
         </svg>
      </div>

      <div className="why-container">
        
        {/* Header */}
        <div className="why-header">
          <span className="why-accent">Real People, Real Impact</span>
          <h2 id="why-heading" className="why-title">
            Why Choose DFI?
          </h2>
          <p className="why-desc">
            Hear from our founder, volunteers, NGO partners, and beneficiaries about how Disha for India is creating meaningful impact across communities.
          </p>
        </div>

        {/* Video Grid Layout */}
        <div className="why-grid">
          {videoStories.map((video) => {
            const Icon = video.categoryIcon;
            return (
              <div 
                key={video.id} 
                className="why-card"
                tabIndex={0}
                aria-label={`Play video: ${video.title}`}
                role="button"
              >
                {/* Thumbnail Area */}
                <div className="why-thumb-wrap">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="why-thumb" 
                    loading="lazy" 
                    decoding="async"
                    onError={handleImageError}
                  />
                  <div className="why-overlay" />
                  <div className="why-play-btn">
                    <Play fill="currentColor" size={24} style={{ marginLeft: '4px' }} />
                  </div>
                  <span className="why-duration">{video.duration}</span>
                </div>
                
                {/* Content Area */}
                <div className="why-content">
                  <div className="why-icon-wrap" style={{ backgroundColor: video.iconBg, color: video.iconColor }}>
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div className="why-text-wrap">
                    <h3 className="why-card-title">{video.title}</h3>
                    <p className="why-card-desc">{video.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="why-cta-wrap">
          <a href="#" className="why-cta-btn" aria-label="Explore more stories from our community">
            More Stories from Our Community
            <ArrowRight size={18} className="why-cta-arrow" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default WhyDFI;
