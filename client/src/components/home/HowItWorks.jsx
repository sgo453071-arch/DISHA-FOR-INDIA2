import React from 'react';
import { UserPlus, Search, HandHeart, FileCheck, ShieldCheck, Award, Trophy, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { icon: UserPlus, title: 'Register', desc: 'Create your volunteer profile.' },
  { icon: Search, title: 'Choose Program', desc: 'Find opportunities that match your skills.' },
  { icon: HandHeart, title: 'Volunteer', desc: 'Show up and make a real difference.' },
  { icon: FileCheck, title: 'Upload Proof', desc: 'Submit photos and attendance logs.' },
  { icon: ShieldCheck, title: 'Verification', desc: 'Partners verify your contribution.' },
  { icon: Award, title: 'Earn Certificate', desc: 'Get your verifiable digital credential.' },
  { icon: Trophy, title: 'Leaderboard', desc: 'Climb the ranks and earn points.' },
  { icon: Gift, title: 'Rewards', desc: 'Redeem points for exclusive perks.' }
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--color-heading)' }}>
            How It Works
          </h2>
          <p className="text-lg" style={{ color: 'var(--color-body)' }}>
            A seamless, transparent journey from your first click to your final reward.
          </p>
        </div>

        <div className="relative">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-12 left-10 right-10 h-0.5" 
               style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary), var(--color-accent))', opacity: 0.3 }}></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 lg:gap-4 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-6 relative group hover:-translate-y-2 transition-all duration-300 border" 
                     style={{ borderColor: 'var(--color-border)', zIndex: 2 }}>
                  <step.icon size={32} style={{ color: 'var(--color-primary)' }} className="group-hover:scale-110 transition-transform" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md border-2 border-white"
                       style={{ background: 'var(--gradient-primary)' }}>
                    {index + 1}
                  </div>
                </div>
                <h4 className="text-base font-bold mb-2 leading-tight" style={{ color: 'var(--color-heading)' }}>{step.title}</h4>
                <p className="text-sm px-2 opacity-80" style={{ color: 'var(--color-body)' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
