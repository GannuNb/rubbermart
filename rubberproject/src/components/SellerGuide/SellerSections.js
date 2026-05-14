import React from "react";
import styles from "../../styles/SellerGuide/GuideSections.module.css";
import { 
  ClipboardList, LayoutDashboard, ShieldCheck, Banknote, 
  MessageSquare, PackageSearch, Truck, BarChart3, TrendingUp, Zap,
  Package, MapPin, FileCheck
} from "lucide-react";

const sellerSectionsData = {
  // TIMELINE VARIANT
  fulfillment: {
    type: "timeline",
    title: "Order Fulfillment",
    items: [
      {
        icon: <ClipboardList size={24} />,
        title: "Review Buyer Request",
        desc: "Check buyer requirements including material type, grade, and quantity before confirming availability."
      },
      {
        icon: <LayoutDashboard size={24} />,
        title: "Update Inventory",
        desc: "Maintain accurate stock records to avoid mismatches and order cancellations."
      },
      {
        icon: <ShieldCheck size={24} />,
        title: "Material Verification",
        desc: "Ensure scrap quality and grading match listing details before preparing for dispatch."
      },
    ]
  },

  // GRADIENT CARDS VARIANT
  payments: {
    type: "gradientCards",
    title: "Payments & Security",
    items: [
      {
        icon: <Banknote size={22} />,
        title: "Secure Payment Release",
        bullets: [
          "Payments are released after buyer confirmation.",
          "Funds are transferred to your registered bank account."
        ]
      },
      {
        icon: <MessageSquare size={22} />,
        title: "Platform Communication",
        bullets: [
          "Keep all communication within RubberScrapMart.",
          "Avoid external transactions to prevent fraud risks."
        ]
      },
      {
        icon: <PackageSearch size={22} />,
        title: "Dispute Handling",
        bullets: [
          "Disputes are resolved using evidence like loading photos.",
          "Fair resolution support for both buyer and seller."
        ]
      },
    ]
  },

  // WHITE CARDS VARIANT
  logistics: {
    type: "whiteCards",
    title: "Logistics & Shipping",
    items: [
      {
        icon: <Truck size={24} />,
        color: "blue",
        title: "Arrange Transport",
        desc: "Sellers must arrange transportation using their preferred logistics or local transport providers."
      },
      {
        icon: <TrendingUp size={24} />,
        color: "purple",
        title: "Prepare for Dispatch",
        desc: "Ensure materials are packed, weighed, and ready before pickup to avoid delays."
      },
      {
        icon: <Package size={24} />,
        color: "orange",
        title: "Secure Packaging",
        desc: "Pack materials properly to avoid damage, contamination, or weight loss during transit."
      },
      {
        icon: <MapPin size={24} />,
        color: "green",
        title: "Accurate Pickup Details",
        desc: "Provide correct pickup address and contact information for smooth coordination."
      },
      {
        icon: <FileCheck size={24} />,
        color: "blue",
        title: "Dispatch Update",
        desc: "Update shipment details immediately after dispatch for verification."
      },
      {
        icon: <ShieldCheck size={24} />,
        color: "orange",
        title: "Handling Guidelines",
        desc: "Follow safe handling practices to maintain material quality during movement."
      }
    ]
  },

  // MINI CARDS VARIANT
  growth: {
    type: "miniCards",
    title: "Pro Seller Tips",
    items: [
      {
        icon: <Zap size={20} />,
        color: "yellow",
        title: "Fast Response",
        desc: "Quick replies to buyer inquiries help build trust and improve conversion rates."
      },
      {
        icon: <BarChart3 size={20} />,
        color: "blue",
        title: "Clear Listings",
        desc: "High-quality images and accurate descriptions reduce disputes and increase credibility."
      },
      {
        icon: <TrendingUp size={20} />,
        color: "purple",
        title: "Consistent Grading",
        desc: "Accurate material grading helps build long-term buyer relationships."
      },
    ]
  }
};

const SellerSections = ({ sectionId }) => {
  const section = sellerSectionsData[sectionId];
  if (!section) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        <span>•••</span> {section.title} <span>•••</span>
      </h2>

      {section.type === "timeline" && (
        <div className={styles.timeline}>
          {section.items.map((item, i) => (
            <div className={styles.timelineItem} key={i}>
              <div className={styles.timelineIcon}>{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {section.type === "gradientCards" && (
        <div className={styles.gradientGrid}>
          {section.items.map((item, i) => (
            <div className={styles.gradientCard} key={i}>
              <div className={styles.gradientIcon}>{item.icon}</div>
              <h4>{item.title}</h4>
              <ul>
                {item.bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {section.type === "whiteCards" && (
        <div className={styles.whiteGrid}>
          {section.items.map((item, i) => (
            <div className={styles.whiteCard} key={i}>
              <div className={`${styles.whiteIcon} ${styles[item.color]}`}>
                {item.icon}
              </div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {section.type === "miniCards" && (
        <div className={styles.miniGrid}>
          {section.items.map((item, i) => (
            <div className={styles.miniCard} key={i}>
              <div className={`${styles.miniIcon} ${styles[item.color]}`}>
                {item.icon}
              </div>
              <h5>{item.title}</h5>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SellerSections;