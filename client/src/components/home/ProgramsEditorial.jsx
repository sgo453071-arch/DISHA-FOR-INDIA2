import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { ArrowRight } from 'lucide-react';

const programs = [
  {
    id: 'education',
    title: 'Education',
    description: 'Providing quality education and learning materials to children in underserved communities across rural India.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    description: 'Organizing medical camps, providing essential medicines, and ensuring basic healthcare access for all.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'disaster',
    title: 'Disaster Relief',
    description: 'Rapid response teams providing food, shelter, and medical aid during natural calamities and emergencies.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'women',
    title: 'Women Empowerment',
    description: 'Skill development, financial literacy, and support systems to help women become financially independent.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'community',
    title: 'Community Development',
    description: 'Building sustainable infrastructure and fostering local leadership for long-term community growth.',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop',
  }
];

const ProgramCard = ({ program }) => {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-dfi-border hover:-translate-y-2 group flex flex-col h-full">
      <div className="w-full h-56 md:h-64 overflow-hidden relative">
        <img 
          src={program.image} 
          alt={program.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-1">
        <h3 className="font-dfi-heading font-bold text-2xl text-dfi-dark mb-3">
          {program.title}
        </h3>
        
        <p className="font-dfi-body text-dfi-gray leading-relaxed mb-6 flex-1">
          {program.description}
        </p>

        <div className="mt-auto">
          <Button variant="ghost" to={`/programs`} className="!px-0 hover:!bg-transparent hover:!translate-y-0 group/btn">
            <span className="flex items-center gap-2">
              Learn More 
              <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProgramsEditorial = () => {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-dfi-heading font-bold text-4xl md:text-5xl text-dfi-dark mb-4"
            >
              What We Do
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-dfi-body text-dfi-gray text-lg md:text-xl"
            >
              Our comprehensive approach addresses the most critical needs across India, focusing on sustainable and long-term impact.
            </motion.p>
          </div>
          
          <Button variant="secondary" to="/programs" className="hidden md:flex shrink-0">
            View All Programs
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProgramCard program={program} />
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <Button variant="secondary" to="/programs" className="w-full">
            View All Programs
          </Button>
        </div>

      </div>
    </section>
  );
};

export default ProgramsEditorial;
