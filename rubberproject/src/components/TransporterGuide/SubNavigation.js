import React, { useState } from "react";
import { 
  HelpCircle, 
  GitBranch, 
  RefreshCw, 
  Layers, 
  Heart, 
  ShieldCheck 
} from "lucide-react";
import styles from "./SubNavigation.module.css";

const TransporterNavigation = ({ onTabClick, refs = {} }) => {
  const [activeTab, setActiveTab] = useState("How It Works");

  const handleTabAction = (label, ref) => {
    setActiveTab(label);
    if (onTabClick && ref) {
      onTabClick(ref);
    }
  };

  // Maps your original Transporter array structure to the high-fidelity UI logic
  const navItems = [
    { label: "How It Works", icon: <HelpCircle size={18} />, ref: refs.howItWorksRef },
    { label: "Delivery Process", icon: <GitBranch size={18} />, ref: refs.deliveryRef },
    { label: "Status Updates", icon: <RefreshCw size={18} />, ref: refs.statusRef },
    { label: "Payments", icon: <Layers size={18} />, ref: refs.paymentsRef },
    { label: "Best Practices", icon: <Heart size={18} />, ref: refs.practicesRef },
    { label: "FAQs", icon: <ShieldCheck size={18} />, ref: refs.faqsRef }
  ];

  return (
    <nav className={styles.subNavBarWrapper}>
      {/* Top Gold/Orange Accent Wave Strip copied from image_0bb0ca.png */}
      <div className={styles.topCurveAccent}></div>
      
      <div className="container-fluid px-md-5">
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
                
                {/* Clean white bottom baseline anchor clip from image_0bb0ca.png */}
                {isActive && <div className={styles.activeBottomStroke}></div>}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TransporterNavigation;