import React, { useRef } from "react";
import styles from "../../styles/BuyerGuide/BuyerGuide.module.css";
import BuyerHero from "./BuyerHero";
import GuideSteps from "./GuideSteps";
import GuideSections from "./GuideSections";
import FAQSupport from "./FAQSupport";

const BuyerGuide = () => {
  const howToBuyRef = useRef(null);
  const orderProcessRef = useRef(null);
  const paymentSafetyRef = useRef(null);
  const shippingRef = useRef(null);
  const tipsRef = useRef(null);
  const faqsRef = useRef(null);

  const scrollToSection = (elementRef) => {
    if (elementRef.current) {
      window.scrollTo({
        top: elementRef.current.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={styles.page}>
      <BuyerHero 
        onTabClick={scrollToSection} 
        refs={{ howToBuyRef, orderProcessRef, paymentSafetyRef, shippingRef, tipsRef, faqsRef }} 
      />
      
      <div className={styles.container}>
        <div ref={howToBuyRef}><GuideSteps /></div>
        
        {/* Pass sectionId to match the component's internal logic */}
        <div ref={orderProcessRef}>
          <GuideSections sectionId="order" />
        </div>
        
        <div ref={paymentSafetyRef}>
          <GuideSections sectionId="payment" />
        </div>
        
        <div ref={shippingRef}>
          <GuideSections sectionId="shipping" />
        </div>
        
        <div ref={tipsRef}>
          <GuideSections sectionId="tips" />
        </div>
        
        <div ref={faqsRef}><FAQSupport /></div>
      </div>
    </div>
  );
};

export default BuyerGuide;