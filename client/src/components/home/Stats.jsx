import React, { useRef } from 'react';
import { Users, Calendar, Award, TrendingUp } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const StatCard = ({ icon: Icon, value, label, color, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="card flex flex-col items-center text-center p-8 glow-card glass hover:-translate-y-2 transition-all duration-300"
      style={{
        background: 'var(--color-card)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="mb-4 p-4 rounded-2xl" style={{ backgroundColor: `${color}15`, color }}>
        <Icon size={32} strokeWidth={2.5} />
      </div>
      <h3 className="text-4xl font-extrabold mb-2" style={{ color: 'var(--color-heading)' }}>
        {value}
      </h3>
      <p className="font-medium" style={{ color: 'var(--color-body)' }}>{label}</p>
    </motion.div>
  );
};

const Stats = () => {
  const stats = [
    { icon: Users, value: '10K+', label: 'Active Volunteers', color: 'var(--color-primary)' },
    { icon: Calendar, value: '500+', label: 'Programs Conducted', color: 'var(--color-secondary)' },
    { icon: Award, value: '8K+', label: 'Certificates Issued', color: 'var(--color-purple)' },
    { icon: TrendingUp, value: '100K+', label: 'Hours of Service', color: 'var(--color-accent)' },
  ];

  return (
    <section className="py-20 px-6 relative z-10 -mt-10">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
