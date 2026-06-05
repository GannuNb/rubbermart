import React from "react";
import styles from "./PaymentsEarnings.module.css";

// 1. Delivery Payments SVG - Rupee Wheel Icon
const RupeeWheelIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svgGraphic}>
    <circle cx="32" cy="32" r="26" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="4.5" />
    <path d="M32 6C46.3594 6 58 17.6406 58 32C58 38.5 Main 52 42" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" opacity="0.9" />
    {/* Indian Rupee Symbol (₹) Vector path */}
    <path d="M25 21H39M25 27H37M25 21C29.5 21 35 21 35 27C35 33 25 33 25 33H30L36 43" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 2. Settlement Tracking SVG - Dashboard Analytics Graph
const AnalyticsGraphIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svgGraphic}>
    {/* Bar Metrics charts */}
    <rect x="10" y="38" width="5" height="14" rx="1.5" fill="rgba(255, 255, 255, 0.4)" />
    <rect x="19" y="28" width="5" height="24" rx="1.5" fill="rgba(255, 255, 255, 0.5)" />
    <rect x="28" y="34" width="5" height="18" rx="1.5" fill="rgba(255, 255, 255, 0.4)" />
    <rect x="37" y="22" width="5" height="30" rx="1.5" fill="rgba(255, 255, 255, 0.7)" />
    {/* Trend Line overlay */}
    <path d="M10 32L21 20L32 26L45 12" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="21" cy="20" r="3" fill="#ffffff" />
    <circle cx="32" cy="26" r="3" fill="#ffffff" />
    <circle cx="45" cy="12" r="3.5" fill="#ffffff" />
    {/* Bottom Base axis line */}
    <line x1="6" y1="52" x2="52" y2="52" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// 3. Secure Transactions SVG - Embossed Padlock Shield
const PadlockShieldIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svgGraphic}>
    {/* Shield Outer Shell */}
    <path d="M32 8C42 11 48 14 52 18V34C52 44.5 44 51.5 32 56C20 51.5 12 44.5 12 34V18C16 14 22 11 32 8Z" fill="rgba(255, 255, 255, 0.12)" stroke="#ffffff" strokeWidth="3.5" strokeLinejoin="round" />
    {/* Inner Lock icon */}
    <rect x="24" y="30" width="16" height="12" rx="2" fill="#ffffff" />
    <path d="M28 30V24C28 21.7909 29.7909 20 32 20C34.2091 20 36 21.7909 36 24V30" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const PaymentsEarnings = () => {
  const cardsData = [
    {
      id: "payments",
      icon: <RupeeWheelIcon />,
      title: "Delivery Payments",
      desc: "Earn delivery charges for each successful delivery completed on time.",
    },
    {
      id: "tracking",
      icon: <AnalyticsGraphIcon />,
      title: "Settlement Tracking",
      desc: "Track your earnings, pending amounts and settlement history in one place.",
    },
    {
      id: "secure",
      icon: <PadlockShieldIcon />,
      title: "Secure Transactions",
      desc: "All payments are processed securely and released transparently.",
    },
  ];

  return (
    <section className={styles.sectionContainer}>
      {/* FIGMA EXACT HEADER WITH TRIPLE DOTS */}
      <div className={styles.sectionHeader}>
        <span className={styles.dots}>•••</span>
        <h3 className={styles.headerTitle}>Payments & Earnings</h3>
        <span className={styles.dots}>•••</span>
      </div>

      {/* HORIZONTAL GRID ALIGNMENT */}
      <div className="row g-3">
        {cardsData.map((card) => (
          <div className="col-xl-4 col-lg-4 col-md-12 d-flex" key={card.id}>
            <div className={styles.earningCard}>
              <div className={styles.cardFlexWrapper}>
                {/* LEFT CELL: SVG ARTWORK */}
                <div className={styles.iconContainer}>
                  {card.icon}
                </div>
                
                {/* RIGHT CELL: CONTENT METADATA */}
                <div className={styles.textContainer}>
                  <h4 className={styles.cardTitle}>{card.title}</h4>
                  <p className={styles.cardDesc}>{card.desc}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PaymentsEarnings;