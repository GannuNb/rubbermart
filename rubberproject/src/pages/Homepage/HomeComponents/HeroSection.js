import React, { useEffect, useRef, useState } from "react";

import {
  MoveRight,
  Package,
  Users,
  User,
  Globe,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import heroImage from "../../../assests/topfull.png";

import styles from "./HeroSection.module.css";

import NavbarPromotion from "../../../components/navbar/NavbarPromotion";
import {
  navbarPromotions,
  RST4000Image,
  TyreBalerImage,
} from "../../../config/navbarPromotion";

// =====================================================
// COUNTER
// =====================================================

const Counter = ({ end, suffix = "+", duration = 2000 }) => {
  const [count, setCount] = useState(0);

  const counterRef = useRef(null);

  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      {
        threshold: 0.4,
      },
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let start = 0;

    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [started, end, duration]);

  return (
    <span ref={counterRef}>
      {count}
      {suffix}
    </span>
  );
};

// =====================================================
// HERO SECTION
// =====================================================

const HeroSection = () => {
  const navigate = useNavigate();

  // ===================================================
  // STATS
  // ===================================================

  const stats = [
    {
      icon: <Package size={20} />,
      value: 500,
      label: "Products",
      color: "#4f46e5",
    },

    {
      icon: <Users size={20} />,
      value: 250,
      label: "Verified Sellers",
      color: "#7c3aed",
    },

    {
      icon: <User size={20} />,
      value: 1000,
      label: "Buyers",
      color: "#9333ea",
    },

    {
      icon: <Globe size={20} />,
      value: 50,
      label: "Cities",
      color: "#6366f1",
    },
  ];

  const topPromotions = [
    {
      ...navbarPromotions.find((item) => item.id === "vikah-ecotech"),
      sideImage: TyreBalerImage,
    },

    navbarPromotions.find((item) => item.id === "tyre-scrap-balers"),

    {
      ...navbarPromotions.find((item) => item.id === "visit-us"),
      sideImage: TyreBalerImage,
    },
  ];

  const bottomPromotions = [
    {
      ...navbarPromotions.find((item) => item.id === "vikah-ecotech"),
      sideImage: RST4000Image,
    },

    navbarPromotions.find((item) => item.id === "rst-4000"),

    {
      ...navbarPromotions.find((item) => item.id === "visit-us"),
      sideImage: RST4000Image,
    },
  ];
  return (
    <section className={styles.heroSection}>
      {/* =================================================
          LEFT HERO SECTION
      ================================================= */}

      <div className={styles.leftHeroSection}>
        {/* =================================================
            LEFT BACKGROUND IMAGE
            ================================================= */}

        <div className={styles.leftBackground}>
          <img
            src={heroImage}
            alt="Rubber Scrap Mart"
            className={styles.backgroundImage}
          />
        </div>

        {/* =================================================
            LEFT CONTENT
        ================================================= */}

        <div className={styles.leftOverlay}>
          <div className={styles.leftContent}>
            {/* =================================================
                BADGE
            ================================================= */}

            <div className={styles.badge}>
              <ShieldCheck size={15} />

              <span>India’s Exclusive B2B Marketplace</span>
            </div>

            {/* =================================================
                HEADING
            ================================================= */}

            <h1 className={styles.heading}>
              Rubber Derived
              <span>Products</span>
            </h1>

            {/* =================================================
                SUBTEXT
            ================================================= */}

            <p className={styles.subText}>
              The Premier B2B marketplace connecting the recycled rubber supply
              chain.
            </p>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className={styles.buttonGroup}>
              <button
                className={styles.primaryBtn}
                onClick={() => navigate("/our-products")}
              >
                Explore Marketplace
                <MoveRight size={18} />
              </button>

              <button
                className={styles.secondaryBtn}
                onClick={() => navigate("/about")}
              >
                About Us
                <MoveRight size={18} />
              </button>
            </div>

            {/* =================================================
                STATS
            ================================================= */}

            <div className={styles.statsRow}>
              {stats.map((item, index) => (
                <div className={styles.statCard} key={index}>
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
                    <h4>
                      <Counter end={item.value} />
                    </h4>

                    <p>{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          RIGHT SPONSORED ADS SECTION
      ================================================= */}

      <aside className={styles.rightPromotionSection}>
        <div className={styles.promotionInner}>
          {/* =================================================
              SPONSORED ADS HEADER
          ================================================= */}

          <div className={styles.promotionHeader}>
            <span className={styles.promotionLine}></span>

            <span className={styles.promotionHeading}>Sponsored Ads</span>

            <span className={styles.promotionLine}></span>
          </div>

          {/* =================================================
    TOP SPONSORED CARD
================================================= */}

          <div className={styles.promotionSlider}>
            <NavbarPromotion promotions={topPromotions} interval={5000} />
          </div>

          {/* =================================================
    SECOND SPONSORED CARD
================================================= */}

          <div className={styles.promotionSlider}>
            <NavbarPromotion promotions={bottomPromotions} interval={5000} />
          </div>
        </div>
      </aside>
    </section>
  );
};

export default HeroSection;
