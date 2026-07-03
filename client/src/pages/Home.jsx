import React from 'react';

// Components
import Hero from '../components/home/Hero';
import TrustBar from '../components/home/TrustBar';
import ImpactStats from '../components/home/ImpactStats';
import Mission from '../components/home/Mission';
import Programs from '../components/home/Programs';
import WhyDFI from '../components/home/WhyDFI';
import VolunteerJourney from '../components/home/VolunteerJourney';
import SuccessStories from '../components/home/SuccessStories';
import FounderMessage from '../components/home/FounderMessage';
import Gallery from '../components/home/Gallery';
import Benefits from '../components/home/Benefits';
import LeaderboardPreview from '../components/home/LeaderboardPreview';
import Blogs from '../components/home/Blogs';
import FAQ from '../components/home/FAQ';
import CTA from '../components/home/CTA';

const Home = () => {
  return (
    <div className="home-container bg-brandBg font-primary">
      <Hero />
      <TrustBar />
      <ImpactStats />
      <Mission />
      <Programs />
      <WhyDFI />
      <VolunteerJourney />
      <SuccessStories />
      <FounderMessage />
      <Gallery />
      <Benefits />
      <LeaderboardPreview />
      <Blogs />
      <FAQ />
      <CTA />
    </div>
  );
};

export default Home;
