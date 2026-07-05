import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, UserPlus, Gift, MapPin, Handshake } from 'lucide-react';

const statsData = [
  {
    icon: Users,
    value: 100000,
    display: '100K+',
    label: 'Lives Impacted',
    color: 'text-dfi-coral',
    bgColor: 'bg-dfi-coral/10',
  },
  {
    icon: UserPlus,
    value: 10000,
    display: '10K+',
    label: 'Active Volunteers',
    color: 'text-dfi-teal',
    bgColor: 'bg-dfi-teal/10',
  },
  {
    icon: Gift,
    value: 500,
    display: '500+',
    label: 'Programs',
    color: 'text-dfi-sage',
    bgColor: 'bg-dfi-sage/15',
  },
  {
    icon: MapPin,
    value: 18,
    display: '18',
    label: 'States Reached',
    color: 'text-dfi-blue',
    bgColor: 'bg-dfi-blue/10',
  },
  {
    icon: Handshake,
    value: 50,
    display: '50+',
    label: 'Partner NGOs',
    color: 'text-dfi-coral',
    bgColor: 'bg-dfi-coral/10',
  },
];

/** Animated counter triggered when element enters viewport */
const Counter = ({ value, display }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    let startTime = null;
    const duration = 2000;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * value));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  const formatted =
    count === value
      ? display
      : count >= 1000
      ? Math.floor(count / 1000) + 'K+'
      : count + (display.includes('+') ? '+' : '');

  return <span ref={ref}>{formatted}</span>;
};

const ImpactStatsV2 = () => {
  return (
    <section className="bg-dfi-soft py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-dfi-body text-sm font-semibold tracking-widest uppercase text-dfi-coral mb-3"
          >
            Our Impact
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-dfi-heading font-extrabold text-3xl md:text-4xl text-dfi-dark"
          >
            Creating Change at Scale
          </motion.h2>
        </div>

        {/* Stats grid – always 5 columns on lg, 2–3 on tablet, stacked on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-white rounded-[20px] p-6 lg:p-8 flex flex-col items-center text-center shadow-soft hover:shadow-soft-lg transition-all duration-300 group hover:-translate-y-2 border border-dfi-border"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={24} strokeWidth={2} aria-hidden="true" />
                </div>

                <div className="font-dfi-heading font-extrabold text-3xl lg:text-4xl text-dfi-dark leading-none mb-2">
                  <Counter value={stat.value} display={stat.display} />
                </div>

                <div className="font-dfi-body text-sm text-dfi-gray mt-1 leading-tight">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactStatsV2;
