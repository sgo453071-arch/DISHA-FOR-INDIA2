import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const FounderMessage = () => {
  return (
    <section className="py-24 bg-brandBg overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="bg-white rounded-[3rem] shadow-xl relative overflow-hidden">
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="flex flex-col md:flex-row">
            
            {/* Image Section */}
            <div className="w-full md:w-2/5 relative">
              <div className="h-full min-h-[400px]">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
                  alt="Founder of Disha for India" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Message Section */}
            <div className="w-full md:w-3/5 p-10 md:p-16 flex flex-col justify-center relative">
              <Quote size={60} className="text-gray-100 absolute top-10 left-10 rotate-180 -z-0" />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                <h3 className="text-primary font-bold tracking-widest uppercase text-sm mb-8">Message from the Founder</h3>
                
                <p className="font-heading text-2xl md:text-3xl text-heading leading-relaxed mb-8">
                  "We envisioned a platform where empathy meets technology. Disha for India is not just a portal; it is a movement to institutionalize compassion and build a generation of verified changemakers."
                </p>
                
                <div className="mt-8">
                  {/* Signature styled font */}
                  <div className="font-heading italic text-4xl text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
                    Sarah Ahmed
                  </div>
                  <p className="text-body font-medium uppercase tracking-wider text-xs">Founder & Director, DFI</p>
                </div>
              </motion.div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderMessage;
