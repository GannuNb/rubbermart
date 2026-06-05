import React, { useRef } from "react";
import HeroSection from "./HeroSection";
import HowToDeliver from "./HowToDeliver";
import DeliveryWorkflow from "./DeliveryWorkflow";
import ShipmentManagement from "./ShipmentManagement";
import PaymentsEarnings from "./PaymentsEarnings";
import TransportBestPractices from "./TransportBestPractices";
import FAQAccordion from "./FAQAccordion";

import styles from "./TransporterGuide.module.css";

const TransporterGuide = () => {
  // Create solid target reference nodes
  const howItWorksRef = useRef(null);
  const deliveryRef = useRef(null);
  const statusRef = useRef(null);
  const paymentsRef = useRef(null);
  const practicesRef = useRef(null);
  const faqsRef = useRef(null);

  const sectionRefs = {
    howItWorksRef,
    deliveryRef,
    statusRef,
    paymentsRef,
    practicesRef,
    faqsRef,
  };

  // High-performance smooth animation viewport execution block
  const handleScrollToSection = (targetRef) => {
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <HeroSection onTabClick={handleScrollToSection} refs={sectionRefs} />
      
      <div className="container-fluid px-md-5 py-5">
        <div className={styles.sectionsContainer}>
          {/* Dynamic wrapper bindings ensuring clear anchor targets */}
          <div ref={howItWorksRef} className={styles.scrollTarget}><HowToDeliver /></div>
          <div ref={deliveryRef} className={styles.scrollTarget}><DeliveryWorkflow /></div>
          <div ref={statusRef} className={styles.scrollTarget}><ShipmentManagement /></div>
          <div ref={paymentsRef} className={styles.scrollTarget}><PaymentsEarnings /></div>
          <div ref={practicesRef} className={styles.scrollTarget}><TransportBestPractices /></div>
          <div ref={faqsRef} className={styles.scrollTarget}><FAQAccordion /></div>
        </div>
      </div>
    </div>
  );
};

export default TransporterGuide;