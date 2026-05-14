import React, { useState } from "react";
import styles from "../../styles/BuyerGuide/BuyerHero.module.css";
import buyerIllustration from "../../assests/buyerguide.png";
import { Link } from "react-router-dom";

import {
  BookOpen,
  Box,
  ShieldCheck,
  Truck,
  Lightbulb,
  HelpCircle,
  Lock,
  ArrowRight,
} from "lucide-react";

const BuyerHero = ({ onTabClick, refs }) => {
  const [activeTab, setActiveTab] = useState("How to Buy");

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
            <BookOpen size={14} />
            <span>Buyer Guide</span>
          </div>

          <h1 className={styles.title}>
            Master Our Scrap <br />
            Marketplace: Your <br />
            Complete <span>Buyer Guide</span>
          </h1>

          <p className={styles.desc}>
            Everything you need to know to source and buy high-quality materials
            with confidence on Rubberscrapmart. Start with our step-by-step
            guide.
          </p>

         <div className={styles.buttonGroup}>
  <Link to="/our-products" className={styles.primaryBtn} style={{ textDecoration: 'none', display: 'inline-flex' }}>
    Start Browsing
    <ArrowRight size={17} />
  </Link>
</div>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <div className={styles.secureBadge}>
            <Lock size={14} />
            <span>Secure Transactions</span>
          </div>

          <img
            src={buyerIllustration}
            alt="Buyer Guide"
            className={styles.heroImage}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsWrapper}>
        <div className={styles.tabs}>
          <div
            className={`${styles.tab} ${
              activeTab === "How to Buy" ? styles.active : ""
            }`}
            onClick={() => handleTabAction("How to Buy", refs.howToBuyRef)}
          >
            <BookOpen size={16} />
            <span>How to Buy</span>
          </div>

          <div
            className={`${styles.tab} ${
              activeTab === "Order Process" ? styles.active : ""
            }`}
            onClick={() =>
              handleTabAction("Order Process", refs.orderProcessRef)
            }
          >
            <Box size={16} />
            <span>Order Process</span>
          </div>

          <div
            className={`${styles.tab} ${
              activeTab === "Payment & Safety" ? styles.active : ""
            }`}
            onClick={() =>
              handleTabAction("Payment & Safety", refs.paymentSafetyRef)
            }
          >
            <ShieldCheck size={16} />
            <span>Payment & Safety</span>
          </div>

          <div
            className={`${styles.tab} ${
              activeTab === "Shipping & Delivery" ? styles.active : ""
            }`}
            onClick={() =>
              handleTabAction("Shipping & Delivery", refs.shippingRef)
            }
          >
            <Truck size={16} />
            <span>Shipping & Delivery</span>
          </div>

          <div
            className={`${styles.tab} ${
              activeTab === "Tips & Best Practices" ? styles.active : ""
            }`}
            onClick={() =>
              handleTabAction("Tips & Best Practices", refs.tipsRef)
            }
          >
            <Lightbulb size={16} />
            <span>Tips & Best Practices</span>
          </div>

          <div
            className={`${styles.tab} ${
              activeTab === "FAQs" ? styles.active : ""
            }`}
            onClick={() => handleTabAction("FAQs", refs.faqsRef)}
          >
            <HelpCircle size={16} />
            <span>FAQs</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuyerHero;