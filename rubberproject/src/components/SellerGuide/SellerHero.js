import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/SellerGuide/SellerHero.module.css";
import sellerIllustration from "../../assests/sellerguide.jpg"; 
import { 
  BookOpen, 
  Package, 
  DollarSign, 
  Truck, 
  ShieldCheck, 
  HelpCircle, 
  LayoutDashboard, 
  ArrowRight,
  TrendingUp 
} from "lucide-react";

const SellerHero = ({ onTabClick, refs }) => {
  const [activeTab, setActiveTab] = useState("How to Sell");

  const handleTabAction = (label, ref) => {
    setActiveTab(label);
    onTabClick(ref);
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        {/* LEFT */}
        <div className={styles.left}>
          <div className={styles.badge}>
            <LayoutDashboard size={14} />
            <span>Seller Guide</span>
          </div>
          
          <h1 className={styles.title}>
            Scale Your Business: <br />
            The Ultimate <span>Seller <br />
            Success Guide</span>
          </h1>
          
          <p className={styles.desc}>
            Everything you need to list your scrap, manage inventory, and get 
            paid securely. Join hundreds of verified suppliers reaching global 
            buyers on Rubberscrapmart.
          </p>

          <div className={styles.buttonGroup}>
            <Link to="/seller-dashboard" className={styles.primaryBtn} style={{ textDecoration: 'none', display: 'inline-flex' }}>
              List Your Scrap
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <div className={styles.secureBadge}>
            <TrendingUp size={14} />
            <span>Verified Seller Status</span>
          </div>

          <img 
            src={sellerIllustration} 
            alt="Seller Guide" 
            className={styles.heroImage} 
          />
        </div>
      </div>

      {/* Tabs - Identical to Buyer style */}
      <div className={styles.tabsWrapper}>
        <div className={styles.tabs}>
          {[
            { label: "How to Sell", icon: <BookOpen size={16} />, ref: refs.howToListRef },
            { label: "Fulfillment", icon: <Package size={16} />, ref: refs.fulfillmentRef },
            { label: "Pricing", icon: <DollarSign size={16} />, ref: refs.pricingRef },
            { label: "Logistics", icon: <Truck size={16} />, ref: refs.logisticsRef },
            { label: "Payments", icon: <ShieldCheck size={16} />, ref: refs.paymentsRef },
            { label: "FAQs", icon: <HelpCircle size={16} />, ref: refs.faqsRef },
          ].map((tab) => (
            <div 
              key={tab.label}
              className={`${styles.tab} ${activeTab === tab.label ? styles.active : ""}`}
              onClick={() => handleTabAction(tab.label, tab.ref)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SellerHero;