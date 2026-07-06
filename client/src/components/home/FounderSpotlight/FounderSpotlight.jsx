import React from 'react';
import { ArrowRight } from 'lucide-react';
import './FounderSpotlight.css';

const founderData = {
  name: "Indu Aggarwal",
  image: "/images/indu_aggarwal.png",
  alt: "Indu Aggarwal, Founder and Trustee of Disha for India Foundation",
};

const FounderSpotlight = () => {
  return (
    <section className="fs-section" aria-labelledby="fs-heading">
      {/* Subtle decorative background elements */}
      <div className="fs-deco-circle" aria-hidden="true" />
      <div className="fs-deco-pattern" aria-hidden="true">
         {/* Simple SVG pattern for a light decorative touch */}
         <svg width="150" height="150" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100 Q 50 50 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M0 80 Q 50 30 100 80" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M0 60 Q 50 10 100 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
         </svg>
      </div>

      <div className="fs-container">
        <div className="fs-layout">
          
          {/* Left Column: Portrait */}
          <div className="fs-left-col">
            <div className="fs-portrait-wrap">
              <img 
                src={founderData.image} 
                alt={founderData.alt} 
                className="fs-portrait" 
                loading="lazy" 
                decoding="async" 
              />
              <span className="fs-name-overlay">{founderData.name}</span>
            </div>
          </div>

          {/* Right Column: Information */}
          <div className="fs-right-col">
            <span className="fs-accent">Founder Spotlight</span>
            <h2 id="fs-heading" className="fs-title">Meet Our Founder</h2>
            <div className="fs-divider" />
            
            <div className="fs-bio">
              <p>
                Indu Aggarwal is a Mohali-based entrepreneur and heart-based career coach with a deep commitment to empowering individuals and communities through education and guidance.
              </p>
              <p>
                Before starting her own ventures, she worked as a Wealth Relationship Manager at HSBC from 2005 to 2013. Her corporate experience shaped her strong understanding of people, relationships, and purpose-driven leadership. 
              </p>
              <p>
                Indu holds a Master’s degree in Business/Managerial Economics from Panjab University and has completed the Women Entrepreneur GS10K program at the Indian Institute of Management (IIM) Bangalore.
              </p>
              <p>
                She believes in conscious, heart-based leadership and the power of collaboration. As a Trustee of the Disha for India Foundation, Indu works closely with students to help them make informed career choices and supports initiatives that create lasting social impact across communities.
              </p>
            </div>

            <a href="#" className="fs-story-link" aria-label="Read more about our founder's story">
              More About Our Story
              <ArrowRight size={20} className="fs-link-arrow" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FounderSpotlight;
