import React from 'react';

const programsData = [
  {
    id: 1,
    title: 'Education',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Healthcare Access',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Disaster Relief',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><path d="M9 14h6"/><path d="M12 11v6"/>
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Skill Development',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Women Empowerment',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <circle cx="12" cy="10" r="6"/><line x1="12" x2="12" y1="16" y2="22"/><line x1="9" x2="15" y1="19" y2="19"/>
      </svg>
    ),
  },
];

const WhatWeDo = () => {
  return (
    <section className="py-24 bg-[#FDFBF7] overflow-hidden" aria-labelledby="what-we-do-heading">
      <div className="container mx-auto px-6 max-w-[1400px]">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p
            className="text-secondary mb-2 text-xl"
            style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic' }}
          >
            Our Programs
          </p>
          <h2
            id="what-we-do-heading"
            className="font-heading text-4xl md:text-5xl font-bold text-heading"
          >
            What We Do
          </h2>
        </div>

        {/* Responsive circle sizes */}
        <style>{`
          .wd-circle {
            width: 140px;
            height: 140px;
          }
          @media (min-width: 768px) {
            .wd-circle { width: 160px; height: 160px; }
          }
          @media (min-width: 1024px) {
            .wd-circle { width: 175px; height: 175px; }
          }
          @media (min-width: 1280px) {
            .wd-circle { width: 210px; height: 210px; }
          }
        `}</style>

        {/* Cards Row */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-10">
          {programsData.map((program) => (
            <button
              key={program.id}
              className="group focus:outline-none shrink-0 cursor-pointer"
              aria-label={`${program.title} Program`}
            >
              {/*
                LAYOUT STRUCTURE (in normal document flow):
                ┌──────────────────────────────┐  ← relative div (circle container)
                │    ○  Circular Image  ○       │
                │                              │
                │      ┌─────────────┐         │  ← badge: absolute bottom-0 translate-y-1/2
                │      │  Icon Badge │         │    → half inside circle, half protrudes below
                └──────┴─────────────┴─────────┘
                       [  h-7 spacer (28px)  ]   ← exact height of protruding half-badge
                       [  mt-4 gap (16px)    ]   ← extra breathing room
                       [  Program Title      ]   ← always below badge, never overlapping
              */}
              <div className="flex flex-col items-center">

                {/* Circle + badge container */}
                <div className="relative transition-transform duration-500 ease-in-out group-hover:-translate-y-2 group-focus:-translate-y-2">

                  {/* Double ring border */}
                  <div className="wd-circle rounded-full p-[6px] bg-[#ECFDF5] border-[2px] border-[#A7F3D0] shadow-sm transition-all duration-500 ease-in-out group-hover:shadow-xl group-hover:border-[#34D399] group-focus:shadow-xl">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                      <img
                        src={program.image}
                        alt={program.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-focus:scale-105"
                      />
                    </div>
                  </div>

                  {/*
                    Icon Badge:
                    - bottom-0: anchored to the bottom edge of the circle container
                    - translate-y-1/2: shifts down by exactly 50% of the badge's own height
                    - Result: 50% of the badge overlaps the circle, 50% protrudes below it
                    - Badge height: h-12=48px (mobile), md:h-14=56px (desktop)
                    - Protrusion: 24px (mobile) / 28px (desktop)
                  */}
                  <div
                    className="
                      absolute bottom-0 left-1/2
                      -translate-x-1/2 translate-y-1/2
                      z-10
                      w-12 h-12 md:w-14 md:h-14
                      bg-white rounded-full border border-gray-100
                      flex items-center justify-center
                      shadow-md text-[#059669]
                      transition-all duration-500 ease-in-out
                      group-hover:scale-110 group-hover:shadow-lg group-hover:text-[#047857]
                      group-focus:scale-110 group-focus:shadow-lg
                    "
                  >
                    {program.icon}
                  </div>
                </div>

                {/*
                  Physical spacer — this is the KEY fix.
                  h-7 = 28px = half of the desktop badge height (56px ÷ 2).
                  This space is NOT transparent — it is real document flow height.
                  It ensures the text container starts BELOW the badge, not behind it.
                  CSS transforms (translate) do NOT create space in the flow, spacers do.
                */}
                <div className="h-7" aria-hidden="true" />

                {/* Program title — sits 16px (mt-4) below the spacer = below the badge */}
                <span
                  className="
                    block mt-4
                    font-heading font-bold
                    text-base md:text-lg lg:text-xl
                    text-heading text-center leading-tight px-2
                    transition-colors duration-500 ease-in-out
                    group-hover:text-primary group-focus:text-primary
                  "
                >
                  {program.title}
                </span>

              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhatWeDo;
