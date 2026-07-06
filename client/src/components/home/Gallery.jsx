import React, { useState } from 'react';
import { BookOpen, HeartPulse, Leaf, Users, Lightbulb, ShieldAlert, Camera } from 'lucide-react';
import './Gallery.css';

const galleryData = [
  {
    id: 1,
    title: 'Learning Beyond Books',
    description: 'Education that empowers young minds.',
    icon: BookOpen,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
    alt: 'Volunteer teaching children in a rural classroom',
  },
  {
    id: 2,
    title: 'Community Healthcare Camp',
    description: 'Care that reaches every village.',
    icon: HeartPulse,
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
    alt: 'Doctor examining a patient at a community health camp',
  },
  {
    id: 3,
    title: 'Planting a Better Tomorrow',
    description: 'Small actions create lasting impact.',
    icon: Leaf,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    alt: 'Volunteers planting saplings in a field',
  },
  {
    id: 4,
    title: 'Women Empowerment',
    description: 'Supporting financial independence.',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800',
    alt: 'Women participating in a skills training workshop',
  },
  {
    id: 5,
    title: 'Skill Development',
    description: 'Teaching digital skills to youth.',
    icon: Lightbulb,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    alt: 'Students learning computer skills in a lab',
  },
  {
    id: 6,
    title: 'Disaster Relief',
    description: 'Providing crucial aid when it matters most.',
    icon: ShieldAlert,
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800',
    alt: 'Volunteers distributing relief supplies',
  },
];

const fallbackImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800';

const Gallery = () => {
  const handleImageError = (e) => {
    if (e.target.src !== fallbackImage) {
      e.target.src = fallbackImage;
      e.target.alt = 'Gallery placeholder image';
    }
  };

  return (
    <section className="gallery-section" aria-labelledby="gallery-heading">
      {/* Decorative background elements */}
      <div className="gallery-deco-blob" aria-hidden="true" />
      <div className="gallery-deco-pattern" aria-hidden="true">
        <Camera size={200} color="#ffffff" opacity={0.03} />
      </div>

      <div className="gallery-container">
        {/* Section Header */}
        <div className="gallery-header">
          <span className="gallery-accent">Photo Gallery</span>
          <h2 id="gallery-heading" className="gallery-title">
            A Glimpse of Change
          </h2>
          <div className="gallery-divider" />
          <p className="gallery-desc">
            Moments captured across India where volunteers, communities, and NGOs came together to create meaningful impact.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {galleryData.map((item) => {
            const Icon = item.icon;
            return (
              <article 
                key={item.id} 
                className="gallery-card"
                tabIndex={0}
                aria-label={`View photo of ${item.title}`}
              >
                {/* Image with fallback */}
                <img
                  src={item.image}
                  alt={item.alt}
                  className="gallery-img"
                  loading="lazy"
                  decoding="async"
                  onError={handleImageError}
                />
                
                {/* Dark gradient overlay */}
                <div className="gallery-overlay" />

                {/* Card Content */}
                <div className="gallery-content">
                  <div className="gallery-icon-wrap">
                    <Icon size={18} strokeWidth={2.5} />
                  </div>
                  <h3 className="gallery-card-title">{item.title}</h3>
                  <p className="gallery-card-desc">{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
