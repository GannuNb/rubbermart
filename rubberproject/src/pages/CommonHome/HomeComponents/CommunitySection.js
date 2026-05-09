import React from "react";

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
      value: "10k+",
      label: "Active Users",
    },
    {
      icon: <FaTag />,
      value: "250k+",
      label: "Products Listed",
    },
    {
      icon: <FaUserCheck />,
      value: "500+",
      label: "Verified Sellers",
    },
    {
      icon: <FaGlobe />,
      value: "50+",
      label: "Countries",
    },
  ];

  const features = [
    {
      tag: "Community",
      icon: <FaGlobe />,
      title: "Global Marketplace",
      desc: "Connect with verified rubber buyers and sellers across multiple countries worldwide.",
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
      desc: "Manage product inquiries, confirmations, shipments and deliveries with confidence.",
    },
  ];

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
              Connect and grow with thousands of verified
              businesses and scrap professionals worldwide.
            </p>

            <div className={styles.bannerBtns}>

              <button className={styles.buyerBtn}>
                Join as Buyer
              </button>

              <button className={styles.sellerBtn}>
                Join as Seller
              </button>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className={styles.statsSide}>

            <div className={styles.statsGrid}>

              {stats.map((stat, index) => (

                <div key={index} className={styles.statItem}>

                  <div className={styles.statLeft}>

                    <div className={styles.statIcon}>
                      {stat.icon}
                    </div>

                    <div className={styles.statText}>
                      <h4>{stat.value}</h4>
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

                  <span className={styles.featureTag}>
                    {item.tag}
                  </span>

                  <div className={styles.featureIconBox}>
                    {item.icon}
                  </div>

                </div>

                <div className={styles.cardBody}>

                  <h4>{item.title}</h4>

                  <p>{item.desc}</p>

                </div>

                <div className={styles.cardFooter}>

                  <span className={styles.learnMore}>
                    Learn more
                  </span>

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