import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Mission = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Subtle Illustration Background (Blob) */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] rounded-full bg-orange-50/50 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] rounded-full bg-green-50/50 blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Column - Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-h-[600px]">
              <img 
                src="https://images.unsplash.com/photo-1593113565694-c6aa89f4facd?auto=format&fit=crop&q=80&w=1000" 
                alt="Volunteer helping community" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            
            {/* Floating Element */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl hidden md:block border border-gray-100"
            >
              <p className="font-heading font-bold text-2xl text-primary mb-1">10+ Years</p>
              <p className="text-gray-600 font-medium">Of building trust</p>
            </motion.div>
          </motion.div>

          {/* Right Column - Text */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <h3 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Our Mission</h3>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-heading mb-8 leading-tight">
              Bridging the gap between intent and impact.
            </h2>
            
            <div className="space-y-6 text-lg text-body mb-10 leading-relaxed font-light">
              <p>
                Disha for India (DFI) was founded on a simple yet powerful belief: every individual has the capacity to create meaningful change in their community. We provide the platform, the transparency, and the verifiable trust to make it happen.
              </p>
              <p>
                By digitizing the volunteering experience, we ensure that every hour contributed is authenticated. This empowers our volunteers with professional credentials while providing NGOs with reliable, passionate individuals ready to serve.
              </p>
            </div>

            <Link to="/about" className="inline-flex items-center gap-2 pb-1 border-b-2 border-primary text-primary font-semibold hover:text-primary-hover hover:border-primary-hover transition-colors group">
              Read Our Full Story
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default Mission;
