import React from 'react';
import HeroSection from './HomeComponents/HeroSection';
import CategoriesSection from './HomeComponents/CategoriesSection';
import WhoWeAreSection from './HomeComponents/WhoWeAreSection';
import HowItWorksSection from './HomeComponents/HowItWorksSection';
import FeaturedProductsSection from './HomeComponents/FeaturedProductsSection';
import CommunitySection from './HomeComponents/CommunitySection';
import TrustedBySection from './HomeComponents/TrustedBySection';
import TestimonialsSection from './HomeComponents/TestimonialsSection.js';

function CommonHome() {
  return (
    <div className="common-home">

      <HeroSection />
      <CategoriesSection />
      <WhoWeAreSection />
      <HowItWorksSection />
      <FeaturedProductsSection />
      <CommunitySection />
      <TestimonialsSection/>
      <TrustedBySection />

    </div>
  );
}

export default CommonHome;