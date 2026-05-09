// src/pages/About.js

import AboutHero from "./AboutHero";
import OurStory from "./OurStory";
import WhyChoose from "./WhyChoose";
import OurValues from "./OurValues";
import SolutionsSection from "./SolutionsSection";
import CommitmentSection from "./CommitmentSection";
import CTASection from "./CTASection";

const About = () => {
  return (
    <div className="bg-white">
      <AboutHero />
      <OurStory />
      <WhyChoose />
      <OurValues />
      <SolutionsSection />
      <CommitmentSection />
      <CTASection />
    </div>
  );
};

export default About;