import React, { useRef } from "react";
import styles from "../../styles/SellerGuide/SellerGuide.module.css";
import SellerHero from "./SellerHero";
import SellerSteps from "./SellerSteps";
import SellerSections from "./SellerSections";
import SellerFAQ from "./SellerFAQ";

const SellerGuide = () => {
  const howToListRef = useRef(null);
  const fulfillmentRef = useRef(null);
  const pricingRef = useRef(null);
  const logisticsRef = useRef(null);
  const paymentsRef = useRef(null);
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
      <SellerHero 
        onTabClick={scrollToSection} 
        refs={{ howToListRef, fulfillmentRef, pricingRef, logisticsRef, paymentsRef, faqsRef }} 
      />
      
      <div className={styles.container}>
        <div ref={howToListRef}><SellerSteps /></div>
        
        <div ref={fulfillmentRef}>
          <SellerSections sectionId="fulfillment" />
        </div>
        
        <div ref={pricingRef}>
          <SellerSections sectionId="pricing" />
        </div>
        
        <div ref={logisticsRef}>
          <SellerSections sectionId="logistics" />
        </div>
        
        <div ref={paymentsRef}>
          <SellerSections sectionId="payments" />
        </div>
        
        <div ref={faqsRef}><SellerFAQ /></div>
      </div>
    </div>
  );
};

export default SellerGuide;