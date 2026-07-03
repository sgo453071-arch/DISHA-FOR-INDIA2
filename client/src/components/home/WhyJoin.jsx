import React from 'react';
import { Shield, Award, TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Shield,
    title: 'Verified Opportunities',
    description: 'All programs are validated and coordinated by registered partners ensuring secure, legitimate, and high-impact environments for our volunteers.',
    benefits: ['Background checked organizations', 'Safe volunteering environments', 'Genuine impact tracking'],
    color: 'var(--color-primary)'
  },
  {
    icon: Award,
    title: 'Verifiable Certificates',
    description: 'Earn cryptographically secured certificates featuring unique QR codes that can be easily shared on your LinkedIn profile or attached to your resume.',
    benefits: ['One-click LinkedIn integration', 'QR code verification', 'Permanent digital record'],
    color: 'var(--color-secondary)',
    reverse: true
  },
  {
    icon: TrendingUp,
    title: 'Gamified Progress',
    description: 'Collect points, move up the leaderboard rankings, unlock new volunteer tiers, and gain access to premium benefits and leadership roles.',
    benefits: ['Dynamic leaderboards', 'Achievement badges', 'Exclusive reward shop'],
    color: 'var(--color-accent)'
  }
];

const FeatureBlock = ({ feature, index }) => (
  <div className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 mb-24 last:mb-0 ${feature.reverse ? 'md:flex-row-reverse' : ''}`}>
    <motion.div 
      initial={{ opacity: 0, x: feature.reverse ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="flex-1 w-full relative"
    >
      <div className="aspect-square max-h-[450px] w-full rounded-[2.5rem] p-8 flex items-center justify-center relative overflow-hidden shadow-sm" 
           style={{ background: `linear-gradient(135deg, ${feature.color}15, ${feature.color}05)`, border: '1px solid var(--color-border)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <feature.icon size={140} color={feature.color} strokeWidth={1.5} className="relative z-10 drop-shadow-md" />
      </div>
    </motion.div>
    
    <motion.div 
      initial={{ opacity: 0, x: feature.reverse ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="flex-1 space-y-6"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-2 shadow-sm" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
        <feature.icon size={28} />
      </div>
      <h3 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: 'var(--color-heading)' }}>
        {feature.title}
      </h3>
      <p className="text-lg leading-relaxed opacity-90" style={{ color: 'var(--color-body)' }}>
        {feature.description}
      </p>
      <ul className="space-y-4 pt-4">
        {feature.benefits.map((benefit, idx) => (
          <li key={idx} className="flex items-center text-base font-medium" style={{ color: 'var(--color-heading)' }}>
            <CheckCircle2 size={20} color={feature.color} className="mr-4 shadow-sm rounded-full bg-white" />
            {benefit}
          </li>
        ))}
      </ul>
    </motion.div>
  </div>
);

const WhyJoin = () => {
  return (
    <section className="py-24 px-6 my-12" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container mx-auto max-w-6xl bg-[var(--color-card)] rounded-[3rem] p-8 md:p-16 shadow-xl border border-[var(--color-border)]">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6" style={{ color: 'var(--color-heading)' }}>
            Why Volunteer with DFI?
          </h2>
          <p className="text-xl" style={{ color: 'var(--color-body)' }}>
            We've created a digital ecosystem that recognizes, rewards, and authenticates your social contributions like never before.
          </p>
        </div>

        <div>
          {features.map((feature, index) => (
            <FeatureBlock key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJoin;
