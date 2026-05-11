import React from "react";
import styles from "../../styles/SellerGuide/GuideSections.module.css";
import { 
  ClipboardList, LayoutDashboard, ShieldCheck, Banknote, 
  MessageSquare, PackageSearch, Truck, BarChart3, TrendingUp, Zap,
  Package, MapPin, FileCheck
} from "lucide-react";

const sellerSectionsData = {
  fulfillment: {
    title: "Order Fulfillment",
    variant: "process",
    columns: 3,
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

  payments: {
    title: "Payments & Security",
    variant: "safety",
    columns: 3,
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

  logistics: {
    title: "Logistics & Shipping",
    variant: "process",
    columns: 2,
    items: [
      {
        icon: <Truck size={24} />,
        title: "Arrange Transport",
        desc: "Sellers must arrange transportation using their preferred logistics or local transport providers."
      },
      {
        icon: <TrendingUp size={24} />,
        title: "Prepare for Dispatch",
        desc: "Ensure materials are packed, weighed, and ready before pickup to avoid delays."
      },
      {
        icon: <Package size={24} />,
        title: "Secure Packaging",
        desc: "Pack materials properly to avoid damage, contamination, or weight loss during transit."
      },
      {
        icon: <MapPin size={24} />,
        title: "Accurate Pickup Details",
        desc: "Provide correct pickup address and contact information for smooth coordination."
      },
      {
        icon: <FileCheck size={24} />,
        title: "Dispatch Update",
        desc: "Update shipment details immediately after dispatch for verification."
      },
      {
        icon: <ShieldCheck size={24} />,
        title: "Handling Guidelines",
        desc: "Follow safe handling practices to maintain material quality during movement."
      }
    ]
  },

  growth: {
    title: "Pro Seller Tips",
    variant: "tips",
    columns: 3,
    items: [
      {
        icon: <Zap size={20} />,
        title: "Fast Response",
        desc: "Quick replies to buyer inquiries help build trust and improve conversion rates."
      },
      {
        icon: <BarChart3 size={20} />,
        title: "Clear Listings",
        desc: "High-quality images and accurate descriptions reduce disputes and increase credibility."
      },
      {
        icon: <TrendingUp size={20} />,
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
    <div className={`${styles.sectionBlock} ${styles[section.variant]}`}>
      <div className={styles.headerArea}>
        <h2 className={styles.sectionHeading}>{section.title}</h2>
        <div className={styles.headingLine}></div>
      </div>

      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${section.columns}, 1fr)` }}
      >
        {section.items.map((item, i) => (
          <div key={i} className={styles.detailCard}>
            <div className={styles.cardIconBox}>{item.icon}</div>

            <div className={styles.cardContent}>
              <h4 className={styles.cardTitle}>{item.title}</h4>

              {item.desc && (
                <p className={styles.cardDesc}>{item.desc}</p>
              )}

              {item.bullets && (
                <ul className={styles.cardList}>
                  {item.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerSections;