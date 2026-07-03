import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, Heart, Upload, ShieldCheck, Award } from 'lucide-react';

const steps = [
  { n: '01', icon: <UserPlus size={24} />, title: 'Register', desc: 'Create your free volunteer profile in minutes.' },
  { n: '02', icon: <Search size={24} />, title: 'Choose Program', desc: 'Browse and find opportunities matching your skills.' },
  { n: '03', icon: <Heart size={24} />, title: 'Volunteer', desc: 'Commit your time and create real community impact.' },
  { n: '04', icon: <Upload size={24} />, title: 'Upload Proof', desc: 'Log your hours with photo evidence easily.' },
  { n: '05', icon: <ShieldCheck size={24} />, title: 'Verification', desc: 'NGO partners authenticate your contribution.' },
  { n: '06', icon: <Award size={24} />, title: 'Certificate', desc: 'Earn verifiable blockchain-backed credentials.' },
];

const VolunteerJourney = () => {
  return (
    <section style={{ background: '#FDFBF7', padding: '5rem 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: 'var(--color-heading)', marginBottom: '0.75rem' }}>
            The Volunteer Journey
          </h2>
          <p style={{ color: 'var(--color-body)', fontSize: '1rem' }}>
            Six simple steps from sign-up to a verified certificate.
          </p>
        </div>

        {/* Desktop: horizontal flow with connecting line */}
        <div style={{ position: 'relative' }}>
          {/* connecting line */}
          <div style={{ position: 'absolute', top: 40, left: '8%', right: '8%', height: 2, background: 'linear-gradient(90deg, #F0EDE8, var(--color-primary), #F0EDE8)', borderRadius: 2, display: 'none' }} className="lg-line" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.875rem' }}
              >
                {/* Icon circle */}
                <div style={{ position: 'relative' }}>
                  <div
                    style={{ width: 72, height: 72, borderRadius: '50%', background: 'white', border: '2px solid #F0EDE8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', boxShadow: '0 4px 20px rgba(211,84,0,0.1)', transition: 'all 0.3s', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(211,84,0,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.borderColor = '#F0EDE8'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(211,84,0,0.1)'; }}
                  >
                    {step.icon}
                  </div>
                  {/* Step number badge */}
                  <div style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', background: 'var(--color-heading)', color: 'white', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                    {i + 1}
                  </div>
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-heading)', margin: 0 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-body)', lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VolunteerJourney;
