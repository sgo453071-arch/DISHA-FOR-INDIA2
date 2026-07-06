import React from 'react';
import { ArrowRight, Calendar, Clock, Tag, Star } from 'lucide-react';
import './Blogs.css';

const articles = [
  {
    id: 1,
    title: 'How Digital Literacy is Changing Rural India',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
    date: 'July 12, 2026',
    readTime: '5 min read',
    summary: 'Discover the impact of our recent tech camps across 15 villages and the stories of amazing volunteers who made it happen.',
    featured: false
  },
  {
    id: 2,
    title: 'The Future of Verifiable Credentials in NGOs',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800',
    date: 'June 28, 2026',
    readTime: '4 min read',
    summary: 'Why we integrated blockchain-backed certificates and how it benefits our volunteers in their professional careers.',
    featured: false
  },
  {
    id: 3,
    title: 'Volunteer Spotlight: 1000 Hours of Service',
    category: 'Community',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=800',
    date: 'June 15, 2026',
    readTime: '6 min read',
    summary: 'Meet the incredible individuals who have dedicated over 1000 hours to community service this year.',
    featured: false
  },
  {
    id: 4,
    title: 'Building Brighter Futures Through Education',
    category: 'Impact',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
    date: 'July 2, 2026',
    readTime: '7 min read',
    summary: 'How our education programs are empowering children in underserved communities to dream bigger and achieve more.',
    featured: true
  }
];

const fallbackImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800';

const Blogs = () => {
  const handleImageError = (e) => {
    if (e.target.src !== fallbackImage) {
      e.target.src = fallbackImage;
      e.target.alt = 'Article placeholder image';
    }
  };

  return (
    <section className="blogs-section" aria-labelledby="blogs-heading">
      {/* Decorative background elements */}
      <div className="blogs-deco-blob" aria-hidden="true" />
      <div className="blogs-deco-pattern" aria-hidden="true">
         {/* Simple SVG leaf pattern */}
         <svg width="150" height="150" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 100 Q 20 50 50 0 Q 80 50 50 100" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M50 100 L 50 0" fill="none" stroke="currentColor" strokeWidth="0.5" />
         </svg>
      </div>

      <div className="blogs-container">
        
        {/* Header Row */}
        <div className="blogs-header">
          <div className="blogs-header-left">
            <span className="blogs-accent">Our Blog</span>
            <h2 id="blogs-heading" className="blogs-title">
              Latest Insights
            </h2>
            <p className="blogs-desc">
              Stories, ideas, updates, and experiences from the Disha for India community.
            </p>
          </div>
          
          <a href="#" className="blogs-view-btn" aria-label="View all blog articles">
            View All Articles
            <ArrowRight size={18} className="blogs-btn-arrow" />
          </a>
        </div>

        {/* Grid Layout */}
        <div className="blogs-grid">
          {articles.map((article) => (
            <a 
              key={article.id}
              href="#" 
              className={`blog-card ${article.featured ? 'featured' : ''}`}
              aria-label={`Read article: ${article.title}`}
            >
              
              {/* Image & Badges */}
              <div className="blog-img-wrap">
                <img
                  src={article.image}
                  alt={article.title}
                  className="blog-img"
                  loading="lazy"
                  decoding="async"
                  onError={handleImageError}
                />
                
                {article.featured ? (
                  <>
                    <span className="blog-badge">
                      <Tag size={12} /> {article.category}
                    </span>
                    <span className="blog-badge featured-badge">
                      <Star size={12} fill="currentColor" /> Featured Story
                    </span>
                  </>
                ) : (
                  <span className="blog-badge">
                    <Tag size={12} /> {article.category}
                  </span>
                )}
              </div>

              {/* Card Content */}
              <div className="blog-content">
                
                {/* Meta */}
                <div className="blog-meta">
                  <span className="blog-meta-item">
                    <Calendar size={14} />
                    {article.date}
                  </span>
                  <span className="blog-meta-item">
                    <Clock size={14} />
                    {article.readTime}
                  </span>
                </div>

                {/* Title & Summary */}
                <h3 className="blog-card-title">{article.title}</h3>
                <p className="blog-card-summary">{article.summary}</p>

                {/* Read More */}
                <span className="blog-read-more">
                  Read More
                  <ArrowRight size={16} className="blog-read-arrow" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
