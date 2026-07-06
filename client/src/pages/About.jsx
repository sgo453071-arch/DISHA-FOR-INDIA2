import React from 'react';
import AboutHero from '../components/about/AboutHero';
import OurJourneyTimeline from '../components/about/OurJourneyTimeline';
import MissionVisionValues from '../components/about/MissionVisionValues';
import ImpactNumbers from '../components/about/ImpactNumbers';
import AreasWeWork from '../components/about/AreasWeWork';
import HowWeCreateImpact from '../components/about/HowWeCreateImpact';

const About = () => {
  return (
    <main>
      <AboutHero />
      <OurJourneyTimeline />
      <MissionVisionValues />
      <ImpactNumbers />
      <AreasWeWork />
      <HowWeCreateImpact />
    </main>
  );
};

export default About;

