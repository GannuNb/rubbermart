import React, { useState } from "react";
import styles from "../../styles/BuyerGuide/BuyerHero.module.css";
import buyerIllustration from "../../assests/buyerguide.png"; 
import { BookOpen, Box, ShieldCheck, Truck, Lightbulb, HelpCircle, Lock, Headphones } from "lucide-react";

const BuyerHero = ({ onTabClick, refs }) => {
  const [activeTab, setActiveTab] = useState("How to Buy");

  const handleTabAction = (label, ref) => {
    setActiveTab(label);
    onTabClick(ref);
  };

  return (
    <div className={styles.heroSection}>
<div className={styles.heroContent}>
        <div className={styles.left}>
          {/* Top Badge like the "Let's Talk" one */}
          <div className={styles.badge}>
            <BookOpen size={16} className={styles.highlight} />
            <span>Buyer Guide</span>
          </div>
          
          <h1 className={styles.title}>
            Master Our Scrap Marketplace: Your Complete <span className={styles.highlight}>Buyer Guide</span>
          </h1>
          
          <p className={styles.desc}>
            Everything you need to know to source and buy scrap materials with confidence on
            RubberScrapMart. Start with our step-by-step guide.
          </p>

          <button className={styles.startBtn}>Start Browsing</button>
        </div>

        <div className={styles.right}>
          {/* Floating Secure Badge */}
          <div style={{ position: 'absolute', top: '10%', left: '-10%', zIndex: 3 }}>
             <div className={styles.badge}>
                <Lock size={16} color="#6d28d9" />
                <span>Secure Transactions</span>
             </div>
          </div>

          <img 
            src={buyerIllustration} 
            alt="Buyer Guide Illustration" 
            className={styles.heroImage} 
          />

          {/* Floating Support Badge like in your reference */}
          <div className={styles.supportBadge}>
            <Headphones size={18} color="#6d28d9" />
            <span>24/7 Expert Support</span>
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <div 
            className={`${styles.tab} ${activeTab === "How to Buy" ? styles.active : ""}`}
            onClick={() => handleTabAction("How to Buy", refs.howToBuyRef)}
          >
            <BookOpen size={18} /> <span>How to Buy</span>
          </div>

          <div 
            className={`${styles.tab} ${activeTab === "Order Process" ? styles.active : ""}`}
            onClick={() => handleTabAction("Order Process", refs.orderProcessRef)}
          >
            <Box size={18} /> <span>Order Process</span>
          </div>

          <div 
            className={`${styles.tab} ${activeTab === "Payment & Safety" ? styles.active : ""}`}
            onClick={() => handleTabAction("Payment & Safety", refs.paymentSafetyRef)}
          >
            <ShieldCheck size={18} /> <span>Payment & Safety</span>
          </div>

          <div 
            className={`${styles.tab} ${activeTab === "Shipping & Delivery" ? styles.active : ""}`}
            onClick={() => handleTabAction("Shipping & Delivery", refs.shippingRef)}
          >
            <Truck size={18} /> <span>Shipping & Delivery</span>
          </div>

          <div 
            className={`${styles.tab} ${activeTab === "Tips & Best Practices" ? styles.active : ""}`}
            onClick={() => handleTabAction("Tips & Best Practices", refs.tipsRef)}
          >
            <Lightbulb size={18} /> <span>Tips & Best Practices</span>
          </div>

          <div 
            className={`${styles.tab} ${activeTab === "FAQs" ? styles.active : ""}`}
            onClick={() => handleTabAction("FAQs", refs.faqsRef)}
          >
            <HelpCircle size={18} /> <span>FAQs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerHero;
