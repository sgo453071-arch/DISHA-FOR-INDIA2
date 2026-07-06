import React from 'react';
import AboutHero from '../components/about/AboutHero';
import OurJourneyTimeline from '../components/about/OurJourneyTimeline';
import MissionVisionValues from '../components/about/MissionVisionValues';
import FounderSpotlight from '../components/about/FounderSpotlight';
import ImpactNumbers from '../components/about/ImpactNumbers';
import AreasWeWork from '../components/about/AreasWeWork';

const About = () => {
  return (
    <main>
      <AboutHero />
      <OurJourneyTimeline />
      <MissionVisionValues />
      <FounderSpotlight />
      <ImpactNumbers />
      <AreasWeWork />
    </main>
  );
};

export default About;

