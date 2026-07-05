import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart, Building2, ArrowRight } from 'lucide-react';
import './HowYouCanHelp.css';

const helpOptions = [
  {
    id: 1,
    title: 'Become a Volunteer',
    description:
      'Join thousands of changemakers and contribute your time and skills to transform lives across communities in India.',
    icon: Users,
    link: '/programs',
    ariaLabel: 'Learn more about becoming a volunteer',
  },
  {
    id: 2,
    title: 'Donate to a Cause',
    description:
      'Your donation helps us reach more communities and create a lasting, meaningful impact for those who need it most.',
    icon: Heart,
    link: '/programs',
    ariaLabel: 'Learn more about donating to a cause',
  },
  {
    id: 3,
    title: 'Partner as an NGO',
    description:
      'Collaborate with us to expand our reach and bring positive change together across India's most underserved regions.',
    icon: Building2,
    link: '/programs',
    ariaLabel: 'Learn more about partnering as an NGO',
  },
];

const HowYouCanHelp = () => {
  return (
    <section className="hych-section" aria-labelledby="hych-heading">

      {/* Decorative background blobs */}
      <div className="hych-blob hych-blob-1" aria-hidden="true" />
      <div className="hych-blob hych-blob-2" aria-hidden="true" />

      {/* Decorative faint outline icons */}
      <div className="hych-deco-icon hych-deco-icon-tl" aria-hidden="true">
        <Heart size={120} strokeWidth={1} />
      </div>
      <div className="hych-deco-icon hych-deco-icon-tr" aria-hidden="true">
        <Users size={100} strokeWidth={1} />
      </div>

      <div className="hych-container">

        {/* Section Header */}
        <div className="hych-header">
          <span className="hych-accent">Together, We Can</span>
          <h2 id="hych-heading" className="hych-title">
            How Can You Help Us?
          </h2>
          <div className="hych-divider" />
          <p className="hych-desc">
            Choose how you would like to contribute and help create meaningful impact across India.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="hych-grid">
          {helpOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Link
                key={option.id}
                to={option.link}
                className="hych-card"
                aria-label={option.ariaLabel}
              >
                {/* Icon */}
                <div className="hych-icon-wrap">
                  <Icon size={32} className="hych-icon" strokeWidth={1.75} />
                </div>

                {/* Title */}
                <h3 className="hych-card-title">{option.title}</h3>

                {/* Description */}
                <p className="hych-card-desc">{option.description}</p>

                {/* Learn More link — animates to pill on card hover */}
                <span className="hych-link">
                  Learn More
                  <ArrowRight size={15} className="hych-link-arrow" />
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowYouCanHelp;
