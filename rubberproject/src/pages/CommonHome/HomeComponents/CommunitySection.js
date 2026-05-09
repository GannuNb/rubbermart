import React, { useEffect, useState } from "react";

import styles from "./CommunitySection.module.css";

import {
  FaUsers,
  FaTag,
  FaUserCheck,
  FaGlobe,
  FaArrowUp,
  FaShieldAlt,
  FaBoxOpen,
} from "react-icons/fa";

import { MoveRight } from "lucide-react";

const CommunitySection = () => {
  const stats = [
    {
      icon: <FaUsers />,
      value: 10000,
      suffix: "+",
      label: "Active Users",
    },
    {
      icon: <FaTag />,
      value: 250000,
      suffix: "+",
      label: "Products Listed",
    },
    {
      icon: <FaUserCheck />,
      value: 500,
      suffix: "+",
      label: "Verified Sellers",
    },
    {
      icon: <FaGlobe />,
      value: 28,
      suffix: "+",
      label: "States Connected",
    },
  ];

  const features = [
    {
      tag: "Community",
      icon: <FaGlobe />,
      title: "India Wide Marketplace",
      desc: "Connect with verified rubber buyers and sellers across multiple states in India.",
    },
    {
      tag: "Security",
      icon: <FaShieldAlt />,
      title: "Verified Businesses",
      desc: "Every supplier and buyer undergoes verification for trusted and secure transactions.",
    },
    {
      tag: "Orders",
      icon: <FaBoxOpen />,
      title: "Secure Order Process",
      desc: "Manage inquiries, confirmations, shipments and deliveries with complete transparency.",
    },
  ];

  /* =========================
     COUNTER STATE
  ========================= */

  const [counts, setCounts] = useState(stats.map(() => 0));

  const [startCount, setStartCount] = useState(false);

  /* =========================
     START ONLY WHEN VISIBLE
  ========================= */

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
        }
      },
      {
        threshold: 0.4,
      },
    );

    const section = document.querySelector(`.${styles.communitySection}`);

    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  /* =========================
     COUNT ANIMATION
  ========================= */

  useEffect(() => {
    if (!startCount) return;

    const duration = 2000;
    const intervalTime = 30;

    const intervals = stats.map((stat, index) => {
      const increment = stat.value / (duration / intervalTime);

      return setInterval(() => {
        setCounts((prev) => {
          const updated = [...prev];

          if (updated[index] < stat.value) {
            updated[index] = Math.min(updated[index] + increment, stat.value);
          }

          return updated;
        });
      }, intervalTime);
    });

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [startCount]);

  /* =========================
     FORMAT COUNTS
  ========================= */

  const formatValue = (num) => {
    if (num >= 100000) {
      return `${Math.floor(num / 1000)}k`;
    }

    if (num >= 1000) {
      return `${Math.floor(num / 1000)}k`;
    }

    return Math.floor(num);
  };

  return (
    <section className={styles.communitySection}>
      <div className="container-fluid px-md-5">
        {/* =========================
            TOP HERO
        ========================= */}

        <div className={styles.heroWrapper}>
          {/* LEFT SIDE */}
          <div className={styles.ctaSide}>
            <div className={styles.badge}>
              <FaUsers />
              <span>COMMUNITY</span>
            </div>

            <h2 className={styles.bannerTitle}>
              Join our Growing
              <span> Community</span>
            </h2>

            <p className={styles.bannerSubtitle}>
              Connect and grow with verified businesses, recyclers, suppliers
              and scrap professionals across India.
            </p>

            <div className={styles.bannerBtns}>
              <button className={styles.buyerBtn}>Join as Buyer</button>

              <button className={styles.sellerBtn}>Join as Seller</button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className={styles.statsSide}>
            <div className={styles.statsGrid}>
              {stats.map((stat, index) => (
                <div key={index} className={styles.statItem}>
                  <div className={styles.statLeft}>
                    <div className={styles.statIcon}>{stat.icon}</div>

                    <div className={styles.statText}>
                      <h4>
                        {formatValue(counts[index])}
                        {stat.suffix}
                      </h4>

                      <span>{stat.label}</span>
                    </div>
                  </div>

                  {/* GREEN ARROW */}
                  <div className={styles.statArrow}>
                    <FaArrowUp className={styles.arrowSvg} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================
            FEATURE CARDS
        ========================= */}

        <div className="row g-4">
          {features.map((item, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <div className={styles.featureCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.featureTag}>{item.tag}</span>

                  <div className={styles.featureIconBox}>{item.icon}</div>
                </div>

                <div className={styles.cardBody}>
                  <h4>{item.title}</h4>

                  <p>{item.desc}</p>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.learnMore}>Learn more</span>

                  <MoveRight className={styles.arrowIcon} />
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
