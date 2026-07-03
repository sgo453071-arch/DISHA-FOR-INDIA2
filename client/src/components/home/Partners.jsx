import React from 'react';

// Mock partner logos - replacing with text for now but meant to be images
const partners = [
  "Ministry of Education", "UNICEF India", "World Wildlife Fund", 
  "Rotary International", "Tata Trusts", "Reliance Foundation", "Infosys Foundation"
];

const Partners = () => {
  return (
    <section className="py-16 px-6 bg-transparent overflow-hidden border-y" style={{ borderColor: 'var(--color-border)' }}>
      <div className="container mx-auto max-w-6xl text-center mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-body)', opacity: 0.7 }}>
          Trusted by leading organizations
        </p>
      </div>
      
      {/* Marquee Animation */}
      <div className="flex w-full overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
        <div className="flex animate-marquee whitespace-nowrap gap-12 py-4 items-center">
          {/* First set */}
          {partners.map((partner, idx) => (
            <div key={idx} className="flex-none px-8">
              <span className="text-2xl font-bold" style={{ color: 'var(--color-heading)', opacity: 0.4 }}>{partner}</span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {partners.map((partner, idx) => (
            <div key={`dup-${idx}`} className="flex-none px-8">
              <span className="text-2xl font-bold" style={{ color: 'var(--color-heading)', opacity: 0.4 }}>{partner}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
