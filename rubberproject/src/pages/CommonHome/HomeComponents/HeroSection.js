import React from "react";
import {
  MoveRight,
  Package,
  Users,
  User,
  Globe,
  ShieldCheck,
} from "lucide-react";

import heroImage from "../../../assests/topfull.png";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  const stats = [
    {
      icon: <Package size={20} />,
      value: "500+",
      label: "Products",
      color: "#4f46e5",
    },
    {
      icon: <Users size={20} />,
      value: "250+",
      label: "Verified Sellers",
      color: "#7c3aed",
    },
    {
      icon: <User size={20} />,
      value: "1000+",
      label: "Buyers",
      color: "#9333ea",
    },
    {
      icon: <Globe size={20} />,
      value: "50+",
      label: "Countries",
      color: "#6366f1",
    },
  ];

  return (
    <section className={styles.heroSection}>

      {/* FULL BACKGROUND IMAGE */}
      <div className={styles.backgroundWrapper}>
        <img
          src={heroImage}
          alt="background"
          className={styles.backgroundImage}
        />
      </div>

      <div className="container-fluid px-xl-5 px-lg-4 px-3">

        <div className={styles.heroContent}>

          {/* LEFT SIDE */}
          <div className={styles.leftSection}>

            <div className={styles.badge}>
              <ShieldCheck size={15} />
              <span>India’s Exclusive B2B Marketplace</span>
            </div>

            <h1 className={styles.heading}>
              Rubber Derived
              <span>Products</span>
            </h1>

            <p className={styles.subText}>
              The Premier B2B marketplace connecting the global recycled
              rubber supply chain.
            </p>

            <div className={styles.buttonGroup}>

              <button className={styles.primaryBtn}>
                Explore Marketplace
                <MoveRight size={18} />
              </button>

              <button className={styles.secondaryBtn}>
                Explore Marketplace
                <MoveRight size={18} />
              </button>

            </div>

            {/* STATS */}
            <div className={styles.statsRow}>
              {stats.map((item, index) => (
                <div
                  className={styles.statCard}
                  key={index}
                >

                  <div
                    className={styles.iconBox}
                    style={{
                      background: `${item.color}15`,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <h4>{item.value}</h4>
                    <p>{item.label}</p>
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* RIGHT EMPTY SPACE */}
          <div className={styles.rightSection}></div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;