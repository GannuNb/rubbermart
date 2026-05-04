import React, { useEffect, useRef, useState } from "react";
import styles from "./CommunitySection.module.css";
import { FaUsers, FaHandshake, FaComments, FaGlobe, FaTag, FaUserCheck } from "react-icons/fa";

const CommunitySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    { icon: <FaUsers />, value: "10k+", label: "Active Users" },
    { icon: <FaTag />, value: "250k+", label: "Products Listed" },
    { icon: <FaUserCheck />, value: "500+", label: "Verified Sellers" },
    { icon: <FaGlobe />, value: "50+", label: "Countries" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className={`${styles.communitySection} ${isVisible ? styles.animateIn : ""}`}
    >
      <div className="container-fluid px-md-5">
        <div className={styles.heroWrapper}>
          {/* LEFT/TOP: CTA Side */}
          <div className={styles.ctaSide}>
            <h2 className={styles.bannerTitle}>Join our Growing Community</h2>
            <p className={styles.bannerSubtitle}>Connect with verified buyers and sellers across the globe.</p>
            <div className={styles.bannerBtns}>
              <button className={styles.buyerBtn}>Join as Buyer</button>
              <button className={styles.sellerBtn}>Join as Seller</button>
            </div>
          </div>

          {/* RIGHT/BOTTOM: Stats Grid */}
          <div className={styles.statsSide}>
            <div className={styles.statsGrid}>
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={styles.statItem} 
                  style={{ "--delay": `${index * 0.1}s` }}
                >
                  <div className={styles.statIcon}>{stat.icon}</div>
                  <div className={styles.statText}>
                    <h4>{stat.value}</h4>
                    <span>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="row g-4 mt-2">
          {[
            { icon: <FaUsers />, title: "Global Network", desc: "Connect with a worldwide marketplace of verified scrap professionals.", tag: "Community" },
            { icon: <FaHandshake />, title: "Verified Trust", desc: "Every profile undergoes a multi-step vetting process for safe transactions.", tag: "Security" },
            { icon: <FaComments />, title: "Direct Chat", desc: "Negotiate pricing and logistics in real-time with built-in secure messaging.", tag: "Tools" }
          ].map((feature, idx) => (
            <div key={idx} className="col-md-4">
              <div className={styles.featureCard} style={{ "--delay": `${0.5 + idx * 0.1}s` }}>
                <div className={styles.cardHeader}>
                  <span className={styles.featureTag}>{feature.tag}</span>
                  <div className={styles.featureIconBox}>{feature.icon}</div>
                </div>
                <div className={styles.cardBody}>
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.learnMore}>Learn more <FaGlobe className={styles.miniIcon} /></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;