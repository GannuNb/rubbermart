// HeroSection.jsx

import React, { useEffect, useRef, useState } from "react";

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

const HeroSection = () => {
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
      label: "Countries",
      color: "#6366f1",
    },
  ];

  return (
    <section className={styles.heroSection}>
      {/* BACKGROUND */}
      <div className={styles.backgroundWrapper}>
        <img
          src={heroImage}
          alt="background"
          className={styles.backgroundImage}
        />
      </div>

      <div className="container-fluid px-xl-5 px-lg-4 px-3">
        <div className={styles.heroContent}>
          {/* LEFT */}
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
              The Premier B2B marketplace connecting the global recycled rubber
              supply chain.
            </p>

            {/* BUTTONS */}
            <div className={styles.buttonGroup}>
              <button className={styles.primaryBtn}>
                Explore Marketplace
                <MoveRight size={18} />
              </button>

              <button className={styles.secondaryBtn}>
                About Us
                <MoveRight size={18} />
              </button>
            </div>

            {/* STATS */}
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

          {/* RIGHT */}
          <div className={styles.rightSection}></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
