import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { recentBlogs } from '../../constants/homeData';
import Button from '../common/Button';

const BlogsV2 = () => {
  const featured = recentBlogs[0];
  const others = recentBlogs.slice(1, 4);

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="inline-block font-dfi-body text-sm font-semibold tracking-widest uppercase text-dfi-coral mb-4">
              Stories
            </span>
            <h2 className="font-dfi-heading font-extrabold text-4xl md:text-5xl text-dfi-dark mb-4">
              From the Ground
            </h2>
            <p className="font-dfi-body text-dfi-gray text-lg">
              Impact stories, updates, and perspectives from the DFI community across India.
            </p>
          </div>
          <Button variant="secondary" to="/blogs" className="shrink-0">
            View All Stories <ArrowRight size={16} className="ml-1 inline" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Featured Blog */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 group cursor-pointer flex flex-col bg-dfi-soft rounded-[24px] overflow-hidden border border-dfi-border hover:shadow-soft-lg transition-all duration-300"
          >
            {/* Image */}
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={featured.image}
                alt={featured.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Category badge */}
              <span className="absolute top-4 left-4 inline-flex items-center gap-1 bg-dfi-coral text-white text-xs font-dfi-body font-semibold px-3 py-1.5 rounded-full">
                <Tag size={12} aria-hidden="true" /> {featured.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col flex-1">
              <div className="flex items-center gap-3 text-xs text-dfi-gray font-dfi-body mb-3">
                <span className="flex items-center gap-1">
                  <Calendar size={12} aria-hidden="true" /> {featured.date}
                </span>
                <span className="w-1 h-1 rounded-full bg-dfi-border" />
                <span>{featured.readTime}</span>
              </div>
              <h3 className="font-dfi-heading font-bold text-2xl md:text-3xl text-dfi-dark mb-3 group-hover:text-dfi-coral transition-colors duration-200 leading-snug">
                {featured.title}
              </h3>
              <p className="font-dfi-body text-dfi-gray leading-relaxed mb-6 line-clamp-3">
                {featured.excerpt}
              </p>
              <div className="inline-flex items-center gap-2 font-dfi-body font-semibold text-dfi-coral mt-auto">
                Read Story
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
              </div>
            </div>
          </motion.div>

          {/* Supporting Blogs */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {others.map((blog, idx) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group flex gap-5 bg-dfi-soft rounded-[20px] overflow-hidden border border-dfi-border hover:shadow-soft-lg transition-all duration-300 cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="w-32 sm:w-40 shrink-0 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ minHeight: '120px' }}
                  />
                </div>
                {/* Content */}
                <div className="flex flex-col justify-between py-4 pr-4 flex-1">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-dfi-body mb-2">
                      <span className="font-semibold text-dfi-coral uppercase tracking-wide">{blog.category}</span>
                      <span className="w-1 h-1 rounded-full bg-dfi-border" />
                      <span className="text-dfi-gray">{blog.date}</span>
                    </div>
                    <h4 className="font-dfi-heading font-bold text-base md:text-lg text-dfi-dark leading-snug group-hover:text-dfi-coral transition-colors duration-200 line-clamp-2">
                      {blog.title}
                    </h4>
                    <p className="font-dfi-body text-dfi-gray text-sm mt-2 line-clamp-2 hidden sm:block">
                      {blog.excerpt}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-sm font-dfi-body font-semibold text-dfi-coral mt-3">
                    Read <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogsV2;
