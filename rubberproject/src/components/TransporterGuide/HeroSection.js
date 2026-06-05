import React, { useState } from "react";
import styles from "./HeroSection.module.css";
import transporterImg from "../../assests/transporterguide.png";

import {
  HelpCircle,
  GitBranch,
  RefreshCw,
  Layers,
  Heart,
  ShieldCheck,
  MoveRight,
} from "lucide-react";

const HeroSection = ({ onTabClick, refs }) => {
  const [activeTab, setActiveTab] = useState("How It Works");

  const handleTabAction = (label, ref) => {
    setActiveTab(label);
    if (onTabClick && ref) {
      onTabClick(ref);
    }
  };

  const navItems = [
    { label: "How It Works", icon: <HelpCircle size={18} />, ref: refs?.howItWorksRef },
    { label: "Delivery Process", icon: <GitBranch size={18} />, ref: refs?.deliveryRef },
    { label: "Status Updates", icon: <RefreshCw size={18} />, ref: refs?.statusRef },
    { label: "Payments", icon: <Layers size={18} />, ref: refs?.paymentsRef },
    { label: "Best Practices", icon: <Heart size={18} />, ref: refs?.practicesRef },
    { label: "FAQs", icon: <ShieldCheck size={18} />, ref: refs?.faqsRef }
  ];

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        {/* LEFT COLUMN */}
        <div className={styles.left}>
          <div className={styles.badge}>
            <span role="img" aria-label="folder" style={{ marginRight: "4px" }}>📁</span>
            <span>Transporter Guide</span>
          </div>

          <h1 className={styles.title}>
            Master Delivery <br />
            Operations: The <br />
            Complete <span>Transporter Guide</span>
          </h1>

          <p className={styles.desc}>
            Learn how to manage assigned deliveries, update shipment statuses, 
            upload proof of delivery, and receive payments smoothly.
          </p>

          <div className={styles.buttonGroup}>
            <button className={styles.primaryBtn}>
              Start Delivering
              <MoveRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.right}>
          <img
            src={transporterImg}
            alt="Master Delivery Operations Illustration"
            className={styles.heroImage}
          />
        </div>
      </div>

      {/* Tabs Menu Wrapper */}
      <div className={styles.tabsWrapper}>
        <div className={styles.subNavBarOuterCapsule}>
          {navItems.map((item, i) => {
            const isActive = activeTab === item.label;
            return (
              <div
                key={i}
                className={`${styles.navItemContainer} ${isActive ? styles.activeTabCard : styles.inactiveRowLink}`}
                onClick={() => handleTabAction(item.label, item.ref)}
              >
                <div className={styles.iconBox}>
                  {item.icon}
                </div>
                <span className={styles.labelSpan}>{item.label}</span>
                
                {isActive && <div className={styles.activeBottomStroke}></div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;