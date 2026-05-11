import React, { useState } from "react";
import styles from "../../styles/SellerGuide/SellerHero.module.css";
import sellerIllustration from "../../assests/sellerguide.jpg"; 
import { BookOpen, Package, DollarSign, Truck, ShieldCheck, HelpCircle, LayoutDashboard, Headphones } from "lucide-react";

const SellerHero = ({ onTabClick, refs }) => {
  const [activeTab, setActiveTab] = useState("How to Sell");

  const handleTabAction = (label, ref) => {
    setActiveTab(label);
    onTabClick(ref);
  };

  return (
    <div className={styles.heroSection}>
      <div className={styles.heroContent}>
        <div className={styles.left}>
          <div className={styles.badge}>
            <LayoutDashboard size={16} className={styles.highlight} />
            <span>Seller Guide</span>
          </div>
          
          <h1 className={styles.title}>
            Expand Your Reach: The Ultimate <span className={styles.highlight}>Seller Guide</span>
          </h1>
          
          <p className={styles.desc}>
            Everything you need to list your scrap, manage inventory, and get paid securely. 
            Join hundreds of verified sellers on RubberScrapMart.
          </p>

          <button className={styles.startBtn}>List Your Scrap</button>
        </div>

        <div className={styles.right}>
          <img src={sellerIllustration} alt="Seller Guide" className={styles.heroImage} />
          <div className={styles.supportBadge}>
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {[
            { label: "How to Sell", icon: <BookOpen size={18} />, ref: refs.howToListRef },
            { label: "Fulfillment", icon: <Package size={18} />, ref: refs.fulfillmentRef },
            { label: "Pricing", icon: <DollarSign size={18} />, ref: refs.pricingRef },
            { label: "Logistics", icon: <Truck size={18} />, ref: refs.logisticsRef },
            { label: "Payments", icon: <ShieldCheck size={18} />, ref: refs.paymentsRef },
            { label: "FAQs", icon: <HelpCircle size={18} />, ref: refs.faqsRef },
          ].map((tab) => (
            <div 
              key={tab.label}
              className={`${styles.tab} ${activeTab === tab.label ? styles.active : ""}`}
              onClick={() => handleTabAction(tab.label, tab.ref)}
            >
              {tab.icon} <span>{tab.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerHero;