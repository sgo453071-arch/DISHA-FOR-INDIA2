import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Compass } from 'lucide-react';
import Button from '../common/Button';

/**
 * CTA Section
 * Full-width photography background with dark gradient overlay.
 * Background: authentic NGO/volunteer photography from Unsplash.
 * Overlay: rgba(34,56,60,0.75) dark teal gradient → transparent.
 */
const backgroundImage =
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=85&w=1920';

const CTAV2 = () => {
  return (
    <section
      className="relative py-28 md:py-40 overflow-hidden bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      aria-label="Call to action"
    >
      {/* Dark teal gradient overlay – keeps text readable without washing out the photo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(34,56,60,0.85) 0%, rgba(34,56,60,0.60) 60%, rgba(34,56,60,0.30) 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          {/* Eyebrow label */}
          <span className="inline-block font-dfi-body text-sm font-semibold tracking-widest uppercase text-dfi-coral mb-6">
            Join the Movement
          </span>

          <h2 className="font-dfi-heading font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight text-white mb-6">
            Ready to Make a{' '}
            <span className="font-dfi-script text-dfi-coral">
              Real Impact?
            </span>
          </h2>

          <p className="font-dfi-body text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-lg">
            Join thousands of individuals across India turning compassion into
            measurable change. Your time, skills, and generosity can build a
            better tomorrow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="primary" to="/register" icon={Users}>
              Become a Volunteer
            </Button>
            <Button
              variant="secondary"
              to="/programs"
              icon={Compass}
              className="!bg-white/10 !text-white !border-white/40 hover:!bg-white/20"
            >
              Browse Programs
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTAV2;
