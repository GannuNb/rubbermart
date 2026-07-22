import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Search,
  ClipboardCheck,
  CreditCard,
  Truck,
  MoveRight,
  ShoppingBag,
  Store,
  Sparkles,
} from "lucide-react";
import styles from "./HowItWorksSection.module.css";

function HowItWorksSection() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealActive);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(`.${styles.revealOnScroll}`);
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      icon: <UserPlus size={22} />,
      title: "Get Started",
      desc: "Create your profile and start trading with trusted rubber businesses across India.",
      theme: "purple",
    },
    {
      icon: <Search size={22} />,
      title: "Explore & Connect",
      desc: "Find verified suppliers, products, and connect with buyers or sellers country wide.",
      theme: "green",
    },
    {
      icon: <ClipboardCheck size={22} />,
      title: "Order Confirmed",
      desc: "Buyer places the order and seller confirms quantity, pricing, and delivery details.",
      theme: "purple",
    },
    {
      icon: <CreditCard size={22} />,
      title: "Payment",
      desc: "Buyer securely makes the payment to our official bank account after confirmation.",
      theme: "green",
    },
    {
      icon: <Truck size={22} />,
      title: "Ship & Track",
      desc: "Seller ships the material and buyer tracks the shipment until delivery.",
      theme: "purple",
    },
  ];

  return (
    <section className={styles.sectionWrapper} ref={sectionRef}>
      <div className={styles.leftGlowBlob}></div>
      <div className={styles.rightGlowBlob}></div>

      <div className="container px-xl-4 px-lg-3 px-2">
        {/* HEADER */}
        <div className={`${styles.headerSection} ${styles.revealOnScroll}`}>
          <div className={styles.topBadge}>
            <Sparkles size={14} className={styles.badgeIcon} />
            <span>SIMPLE, SECURE & TRANSPARENT</span>
          </div>

          <h2 className={styles.mainTitle}>
            How It <span>Works</span>
          </h2>
        </div>

        {/* HORIZONTAL TRACK */}
        <div className={`${styles.trackWrapper} ${styles.revealOnScroll}`} style={{ transitionDelay: "150ms" }}>
          <div className={styles.trackLine}></div>

          {steps.map((step, index) => (
            <div key={index} className={styles.trackCard}>
              <div
                className={`${styles.iconCircle} ${
                  step.theme === "green" ? styles.greenIcon : styles.purpleIcon
                }`}
              >
                {step.icon}
                <span className={styles.miniNum}>0{index + 1}</span>
              </div>

              <h4 className={styles.trackTitle}>{step.title}</h4>
              <p className={styles.trackDesc}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* GUIDE CARDS */}
        <div className={`${styles.guideWrapper} ${styles.revealOnScroll}`} style={{ transitionDelay: "300ms" }}>
          {/* BUYER */}
          <div className={styles.guideCard}>
            <div className={styles.guideLeft}>
              <div className={`${styles.guideIcon} ${styles.purpleIcon}`}>
                <ShoppingBag size={24} />
              </div>
              <div className={styles.guideText}>
                <h5>Buyer Guide</h5>
                <p>Learn how to buy materials easily and securely.</p>
              </div>
            </div>
            <button
              className={styles.guideArrow}
              onClick={() => navigate("/buyer-guide")}
              aria-label="Buyer Guide"
            >
              <MoveRight size={18} />
            </button>
          </div>

          {/* SELLER */}
          <div className={styles.guideCard}>
            <div className={styles.guideLeft}>
              <div className={`${styles.guideIcon} ${styles.greenIcon}`}>
                <Store size={24} />
              </div>
              <div className={styles.guideText}>
                <h5 className={styles.greenText}>Seller Guide</h5>
                <p>Learn how to expand your rubber business and reach buyers across India.</p>
              </div>
            </div>
            <button
              className={`${styles.guideArrow} ${styles.greenGuideArrow}`}
              onClick={() => navigate("/seller-guide")}
              aria-label="Seller Guide"
            >
              <MoveRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;