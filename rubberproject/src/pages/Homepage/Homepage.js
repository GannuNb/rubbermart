import React from "react";
import { useSelector } from "react-redux";

import HeroSection from "./HomeComponents/HeroSection";
import CategoriesSection from "./HomeComponents/CategoriesSection";
import WhoWeAreSection from "./HomeComponents/WhoWeAreSection";
import HowItWorksSection from "./HomeComponents/HowItWorksSection";
import FeaturedProductsSection from "./HomeComponents/FeaturedProductsSection";
import CommunitySection from "./HomeComponents/CommunitySection";
import TrustedBySection from "./HomeComponents/TrustedBySection";
import TestimonialsSection from "./HomeComponents/TestimonialsSection";
import MoreForYouSection from "./HomeComponents/MoreForYouSection";

import RecommendedProductsSection from "./HomeComponents/RecommendedProductsSection";

function Homepage() {

  const { user, token } = useSelector((state) => state.auth);

  const isLoggedIn = user && token;

  return (
    <div className="common-home">

      <HeroSection />

      <CategoriesSection />

      <WhoWeAreSection />

      <HowItWorksSection />

      <FeaturedProductsSection />

      {/* CONDITIONAL SECTION */}
      {isLoggedIn ? (
        <RecommendedProductsSection />
      ) : (
        <CommunitySection />
      )}

      <TestimonialsSection />

      <MoreForYouSection />

      <TrustedBySection />

    </div>
  );
}

export default Homepage;