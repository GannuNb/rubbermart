import React from "react";
import styles from "./TransportBestPractices.module.css";

// Native SVG Graphic Assets to prevent broken image references
const ShieldCheckIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 4C29 6.5 34 8.5 37 11V23C37 31 31 36.5 22 40C13 36.5 7 31 7 23V11C10 8.5 15 6.5 22 4Z" fill="#eae4ff" stroke="#6343e4" strokeWidth="2" />
    <path d="M16 22L20 26L28 18" stroke="#6343e4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TruckCircleIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="22" r="16" fill="#eae4ff" />
    <rect x="12" y="16" width="14" height="11" rx="1" stroke="#6343e4" strokeWidth="2" fill="#eae4ff" />
    <path d="M26 18H31L34 22V27H26V18Z" stroke="#6343e4" strokeWidth="2" fill="#6343e4" fillOpacity="0.2" />
    <circle cx="17" cy="29" r="2.5" fill="#6343e4" />
    <circle cx="29" cy="29" r="2.5" fill="#6343e4" />
  </svg>
);

const PhoneStatusIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="8" width="16" height="28" rx="3" fill="#eae4ff" stroke="#6343e4" strokeWidth="2" />
    <line x1="18" y1="14" x2="26" y2="14" stroke="#6343e4" strokeWidth="2" strokeLinecap="round" />
    <line x1="18" y1="20" x2="24" y2="20" stroke="#6343e4" strokeWidth="2" strokeLinecap="round" />
    <line x1="18" y1="26" x2="22" y2="26" stroke="#6343e4" strokeWidth="2" strokeLinecap="round" />
    <circle cx="22" cy="32" r="1.5" fill="#6343e4" />
  </svg>
);

const CameraIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="14" width="24" height="18" rx="3" fill="#eae4ff" stroke="#6343e4" strokeWidth="2" />
    <path d="M17 14L19 10H25L27 14H17Z" fill="#6343e4" stroke="#6343e4" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="22" cy="23" r="4.5" fill="#eae4ff" stroke="#6343e4" strokeWidth="2" />
  </svg>
);

const ChatBubblesIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="10" width="20" height="15" rx="3" fill="#eae4ff" stroke="#6343e4" strokeWidth="2" />
    <path d="M13 25V29L18 25H13Z" fill="#6343e4" stroke="#6343e4" strokeWidth="2" strokeLinejoin="round" />
    <rect x="18" y="18" width="18" height="13" rx="3" fill="#6343e4" fillOpacity="0.2" stroke="#6343e4" strokeWidth="2" />
    <circle cx="23" cy="24" r="1" fill="#6343e4" />
    <circle cx="27" cy="24" r="1" fill="#6343e4" />
    <circle cx="31" cy="24" r="1" fill="#6343e4" />
  </svg>
);

const TransportBestPractices = () => {
  const practices = [
    { 
      icon: <ShieldCheckIcon />, 
      title: "Verify Pickup Details", 
      desc: "Always verify order and pickup details before proceeding." 
    },
    { 
      icon: <TruckCircleIcon />, 
      title: "Maintain Vehicle Condition", 
      desc: "Ensure your vehicle is in good condition for safe transportation." 
    },
    { 
      icon: <PhoneStatusIcon />, 
      title: "Update Status Regularly", 
      desc: "Keep updating each stage of delivery in the system." 
    },
    { 
      icon: <CameraIcon />, 
      title: "Capture Delivery Proof", 
      desc: "Upload clear images and documents as proof of delivery." 
    },
    { 
      icon: <ChatBubblesIcon />, 
      title: "Communicate Clearly", 
      desc: "Stay in touch with buyers and sellers throughout delivery." 
    },
    { 
      icon: <ShieldCheckIcon />, 
      title: "Follow Safety Standards", 
      desc: "Follow all safety rules and transport regulations." 
    },
  ];

  return (
    <section className={styles.sectionContainer}>
      {/* TRIPLE DOT SECTION HEADER */}
      <div className={styles.sectionHeader}>
        <span className={styles.dots}>•••</span> 
        <h3 className={styles.headerTitle}>Transport Best Practices</h3> 
        <span className={styles.dots}>•••</span>
      </div>

      {/* 6-CARD GRID MATRIX */}
      <div className="row g-3">
        {practices.map((item, idx) => (
          <div className="col-xl-2 col-lg-4 col-md-6 d-flex" key={idx}>
            <div className={styles.practiceCard}>
              <div className={styles.iconWrapper}>
                {item.icon}
              </div>
              <h5 className={styles.cardTitle}>{item.title}</h5>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TransportBestPractices;