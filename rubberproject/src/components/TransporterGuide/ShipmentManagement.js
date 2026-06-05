import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./ShipmentManagement.module.css";

// 1. Assigned Deliveries Icon (Clipboard + Magnifying Glass + Dots)
const AssignedIcon = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#bdafff" />
        <stop offset="100%" stopColor="#6343e4" />
      </linearGradient>
    </defs>
    {/* Clipboard Body */}
    <rect x="12" y="10" width="32" height="38" rx="6" fill="url(#purpleGrad)" fillOpacity="0.15" stroke="#6343e4" strokeWidth="2.5" />
    {/* Clipboard Clip */}
    <rect x="22" y="6" width="12" height="6" rx="2" fill="#6343e4" />
    {/* Lines/Dots */}
    <circle cx="20" cy="20" r="2" fill="#6343e4" />
    <line x1="26" y1="20" x2="38" y2="20" stroke="#6343e4" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    <circle cx="20" cy="28" r="2" fill="#6343e4" />
    <line x1="26" y1="28" x2="38" y2="28" stroke="#6343e4" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    <circle cx="20" cy="36" r="2" fill="#6343e4" />
    {/* Magnifying Glass Overlay */}
    <circle cx="38" cy="38" r="6" fill="#f9f8ff" stroke="#4b26d1" strokeWidth="2.5" />
    <line x1="42.5" y1="42.5" x2="48" y2="48" stroke="#4b26d1" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

// 2. Active Deliveries Icon (Moving Shipping Truck)
const ActiveIcon = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <use href="#purpleGrad" />
    {/* Truck Container Back */}
    <rect x="6" y="16" width="26" height="22" rx="4" fill="url(#purpleGrad)" fillOpacity="0.2" stroke="#6343e4" strokeWidth="2.5" />
    {/* Truck Cabin Front */}
    <path d="M32 20H42L48 28V38H32V20Z" fill="url(#purpleGrad)" fillOpacity="0.15" stroke="#6343e4" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Cabin Window */}
    <path d="M35 23H41L44 28H35V23Z" fill="none" stroke="#6343e4" strokeWidth="2" strokeLinejoin="round" />
    {/* Wheels */}
    <circle cx="14" cy="38" r="5" fill="#f9f8ff" stroke="#4b26d1" strokeWidth="2.5" />
    <circle cx="14" cy="38" r="1.5" fill="#4b26d1" />
    <circle cx="38" cy="38" r="5" fill="#f9f8ff" stroke="#4b26d1" strokeWidth="2.5" />
    <circle cx="38" cy="38" r="1.5" fill="#4b26d1" />
  </svg>
);

// 3. Completed Deliveries Icon (Box + Dynamic Checkmark Bubble)
const CompletedIcon = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <use href="#purpleGrad" />
    {/* Cardboard Box Package */}
    <rect x="10" y="14" width="30" height="30" rx="4" fill="url(#purpleGrad)" fillOpacity="0.15" stroke="#6343e4" strokeWidth="2.5" />
    {/* Flaps details */}
    <path d="M10 22H40M25 14V22" stroke="#6343e4" strokeWidth="2" opacity="0.6" />
    {/* Floating Success Check Shield */}
    <circle cx="40" cy="38" r="9" fill="#4b26d1" />
    <path d="M36 38L39 41L44 35" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 4. Delivery Proof Icon (Cloud Upload Arrow + Document Secure Page)
const ProofIcon = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <use href="#purpleGrad" />
    {/* Secure Document Sheet */}
    <path d="M12 10H34L44 20V46C44 48.2091 42.2091 50 40 50H12C9.79086 50 8 48.2091 8 46V14C8 11.7909 9.79086 10 12 10Z" fill="url(#purpleGrad)" fillOpacity="0.15" stroke="#6343e4" strokeWidth="2.5" />
    <path d="M34 10V20H44" stroke="#6343e4" strokeWidth="2" strokeLinejoin="round" />
    {/* Document inner line hints */}
    <line x1="14" y1="20" x2="26" y2="20" stroke="#6343e4" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <line x1="14" y1="28" x2="28" y2="28" stroke="#6343e4" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    {/* Cloud Badge Upload Area */}
    <path d="M22 42C20 42 18 40.5 18 38.5C18 36.5 19.5 35 21.5 35C21.5 33 23.5 31 26 31C29 31 31 33.5 31 36C32.5 36 34 37 34 38.5C34 40 32.5 42 31 42H22Z" fill="#4b26d1" />
    <path d="M26 40V35M26 35L24 37M26 35L28 37" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShipmentManagement = () => {
  const navigate = useNavigate();

  const managementCards = [
    {
      id: "assigned",
      iconComponent: <AssignedIcon />,
      title: "Assigned Deliveries",
      desc: "View all deliveries assigned by admin with complete details.",
      btnText: "View Assignments",
      action: () => navigate("/deliveries/assigned"),
    },
    {
      id: "active",
      iconComponent: <ActiveIcon />,
      title: "Active Deliveries",
      desc: "Track ongoing deliveries and update shipment statuues in real-time.",
      btnText: "View Active",
      action: () => navigate("/deliveries/active"),
    },
    {
      id: "completed",
      iconComponent: <CompletedIcon />,
      title: "Completed Deliveries",
      desc: "Review completed deliveries and download proofs and invoices.",
      btnText: "View Completed",
      action: () => navigate("/deliveries/completed"),
    },
    {
      id: "proof",
      iconComponent: <ProofIcon />,
      title: "Delivery Proof",
      desc: "Upload POD, images, documents and other required proofs.",
      btnText: "Upload Proof",
      action: () => navigate("/deliveries/upload-pod"),
    },
  ];

  return (
    <section className={styles.sectionContainer}>
      {/* EXACT DECORATIVE HEADER */}
      <div className={styles.sectionHeader}>
        <span className={styles.dots}>•••</span>
        <h3 className={styles.headerTitle}>Shipment Management</h3>
        <span className={styles.dots}>•••</span>
      </div>

      {/* CARD ROW GRID CONTAINER */}
      <div className="row g-3">
        {managementCards.map((card) => (
          <div className="col-xl-3 col-lg-6 col-md-6 d-flex" key={card.id}>
            <motion.div 
              className={styles.managementCard}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.cardFlexLayout}>
                {/* GENERATED EMBEDDED GRAPHIC COLUMN */}
                <div className={styles.graphicAssetBox}>
                  {card.iconComponent}
                </div>
                
                {/* TEXT CONTENT & ACTIONS */}
                <div className={styles.textColumnBody}>
                  <h4 className={styles.cardTitle}>{card.title}</h4>
                  <p className={styles.cardDesc}>{card.desc}</p>
                  
                  <button className={styles.exactOutlineBtn} onClick={card.action}>
                    {card.btnText}
                    <ArrowRight size={13} strokeWidth={2.5} className={styles.btnArrow} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShipmentManagement;