import React, { useEffect, useRef, useState } from 'react';
;
import './TestimonialSpotlight.css';

// Placeholder testimonial – replace with approved content before production.
// TODO: Replace placeholder testimonial, volunteer name, role, and profile image with real approved data.
const testimonial = {
  quote: "Placeholder testimonial – replace before production.",
  name: "Volunteer Name",
  role: "Education Volunteer",
  // Unsplash placeholder image – replace with approved volunteer portrait.
  image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=200",
};

const TestimonialSpotlight = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`ts-section ${visible ? 'ts-visible' : ''}`}
      ref={sectionRef}
      aria-labelledby="ts-heading"
    >
      {/* Decorative large handwritten phrase */}
      <div className="ts-deco-phrase" aria-hidden="true">
        Together We Grow
      </div>

      {/* Decorative quote mark */}
      <div className="ts-deco-quote" aria-hidden="true">
        “
      </div>

      <div className="ts-container">
        {/* Quote */}
        <div className="ts-quote-wrap">
          <blockquote className="ts-blockquote">
            <p className="ts-quote-text">{testimonial.quote}</p>
          </blockquote>
        </div>

        {/* Volunteer Info */}
        <div className="ts-profile-wrap">
          <div className="ts-avatar">
            <img src={testimonial.image} alt={`Portrait of ${testimonial.name}`} loading="lazy" decoding="async" />
          </div>
          <p className="ts-name" aria-label={`Volunteer: ${testimonial.name}`}>{testimonial.name}</p>
          <p className="ts-role">{testimonial.role}</p>
        </div>

        {/* Dot indicators – future carousel */}
        <div className="ts-dots">
          <span className="ts-dot ts-dot-active" aria-hidden="true" />
          <span className="ts-dot ts-dot-inactive" aria-hidden="true" />
          <span className="ts-dot ts-dot-inactive" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialSpotlight;
