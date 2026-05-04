import React from "react";
import { MoveRight, Package, Users, User, Globe, ShieldCheck } from "lucide-react";
import heroImage from "../../../assests/hero-rubber.jpg"; 
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  const stats = [
    { icon: <Package size={20} />, val: "500+", label: "Products", color: "#3b82f6" },
    { icon: <Users size={20} />, val: "250+", label: "Verified Sellers", color: "#8b5cf6" },
    { icon: <User size={20} />, val: "1000+", label: "Active Buyers", color: "#d946ef" },
    { icon: <Globe size={20} />, val: "50+", label: "Countries", color: "#06b6d4" },
  ];

  return (
    <section className={styles.heroSection}>
      {/* Decorative Background Elements */}
      <div className={styles.blob} />
      <div className={styles.mapOverlay} />

      <div className="container-fluid px-md-5">
        <div className="row align-items-center g-5">
          
          <div className="col-lg-6 col-xl-5 order-2 order-lg-1">
            <div className={styles.textBlock}>
              <div className={styles.badge}>
                <ShieldCheck size={16} className="me-2" />
                <span>India’s Verified B2B Marketplace</span>
              </div>

              <h1 className={styles.mainHeading}>
                Global Supply Chain for <br /> 
                <span className={styles.highlightText}>Recycled Rubber</span>
              </h1>

              <p className={styles.subtext}>
                The premier digital ecosystem connecting scrap rubber suppliers with global manufacturers. Streamline your procurement with verified data.
              </p>

              <div className={styles.buttonRow}>
                <button className={styles.primaryBtn}>
                  Explore Marketplace <MoveRight size={18} />
                </button>
                <button className={styles.secondaryBtn}>
                  Sell Your Products
                </button>
              </div>

              <div className={styles.statsGrid}>
      {stats.map((stat, i) => (
        <div key={i} className={styles.statCard}>
          {/* Dynamic background tint based on the icon color */}
          <div 
            className={styles.iconBox} 
            style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
          >
            {stat.icon}
          </div>
          <div className={styles.statInfo}>
            <h3>{stat.val}</h3>
            <p>{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
            </div>
          </div>

          <div className="col-lg-6 col-xl-7 order-1 order-lg-2">
            <div className={styles.imageContainer}>
              <div className={styles.imageFrame}>
                 <img src={heroImage} alt="Recycled Rubber" className={styles.mainHeroImg} />
                 {/* Floating Card UI for professional look */}
                 <div className={styles.floatingCard}>
                    <div className={styles.greenPulse} />
                    <span>Live Market Prices Updated</span>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;