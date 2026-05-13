import React from "react";

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
  const steps = [
    {
      icon: <UserPlus size={22} />,
      title: "Get Started",
      desc: "Create your profile and access global rubber markets as a buyer or seller.",
      theme: "purple",
    },

    {
      icon: <Search size={22} />,
      title: "Explore & Connect",
      desc: "Find verified suppliers, products, and connect with buyers or sellers worldwide.",
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
    <section className={styles.sectionWrapper}>
      <div className={styles.leftDots}></div>
      <div className={styles.rightDots}></div>

      <div className="container-fluid px-xl-5 px-lg-4 px-3">
        {/* HEADER */}
        <div className={styles.headerSection}>
          <div className={styles.topBadge}>
            <Sparkles size={13} />
            <span>SIMPLE, SECURE & TRANSPARENT</span>
          </div>

          <h2 className={styles.mainTitle}>
            How It <span>Works</span>
          </h2>

          <p className={styles.subTitle}>
            Our streamlined process ensures a secure and efficient trading
            experience for buyers and sellers.
          </p>
        </div>

        {/* STEPS */}
        <div className={styles.stepsWrapper}>
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className={styles.stepCard}>
                <div
                  className={`${styles.iconBox}
                  ${
                    step.theme === "green"
                      ? styles.greenIcon
                      : styles.purpleIcon
                  }`}
                >
                  {step.icon}
                </div>

                <h4>{step.title}</h4>

                <div
                  className={`${styles.smallLine}
                  ${
                    step.theme === "green"
                      ? styles.greenLine
                      : styles.purpleLine
                  }`}
                ></div>

                <p>{step.desc}</p>

                <div
                  className={`${styles.bottomLine}
                  ${step.theme === "green" ? styles.greenBg : styles.purpleBg}`}
                ></div>
              </div>

              {/* DASHED ARROW */}
              {index !== steps.length - 1 && (
                <div className={styles.arrowWrapper}>
                  <div
                    className={`${styles.dashedLine}
                    ${index % 2 === 0 ? styles.purpleDash : styles.greenDash}`}
                  ></div>

                  <MoveRight
                    size={24}
                    className={
                      index % 2 === 0 ? styles.purpleArrow : styles.greenArrow
                    }
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* GUIDE CARDS */}
        <div className={styles.guideWrapper}>
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
            >
              <MoveRight size={18} />
            </button>

            <div className={styles.guideDotsPurple}></div>
          </div>

          {/* SELLER */}
          <div className={styles.guideCard}>
            <div className={styles.guideLeft}>
              <div className={`${styles.guideIcon} ${styles.greenIcon}`}>
                <Store size={24} />
              </div>

              <div className={styles.guideText}>
                <h5 className={styles.greenText}>Seller Guide</h5>

                <p>Learn how to sell and grow your business globally.</p>
              </div>
            </div>

            <button
              className={`${styles.guideArrow} ${styles.greenGuideArrow}`}
              onClick={() => navigate("/seller-guide")}
            >
              <MoveRight size={18} />
            </button>

            <div className={styles.guideDotsGreen}></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
