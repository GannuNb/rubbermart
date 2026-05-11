import React from "react";
import styles from "../../styles/BuyerGuide/GuideSections.module.css";

import { 
  Package, ClipboardCheck, Bell, ShieldCheck, FileText, 
  Lock, Truck, Search, Scale, MousePointer2, Headphones 
} from "lucide-react";

const sectionsData = {
  order: {
    title: "Order Process",
    variant: "process",
    columns: 3,
    items: [
      { 
        icon: <Package size={26} />, 
        title: "Order Review", 
        desc: "The seller reviews your order, quantity, and availability to ensure requirements are met and inventory levels align with your requested scrap materials." 
      },
      { 
        icon: <ClipboardCheck size={26} />, 
        title: "Order Approval", 
        desc: "Seller verifies your order and approves it for processing; once successful, the order moves into active status for fulfillment." 
      },
      { 
        icon: <Bell size={26} />, 
        title: "Updates on Platform", 
        desc: "All communication stays on the platform for transparency; you will receive notifications regarding every step of the order lifecycle." 
      },
    ]
  },
  payment: {
    title: "Payment & safety",
    variant: "safety",
    columns: 3,
    items: [
      { 
        icon: <ShieldCheck size={24} />, 
        title: "Secure Transactions", 
        bullets: [
          "Only use official bank details provided by the system during checkout.",
          "Do not make payments to personal accounts or unverified off-platform links."
        ] 
      },
      { 
        icon: <FileText size={24} />, 
        title: "How to Pay", 
        bullets: [
          "Make payment only after the seller confirms your order and it moves to the approved stage.",
          "Upload your payment receipt on the Order page to alert the system of the completed transaction.",
          "Admin will verify and approve your payment before dispatch is authorized."
        ] 
      },
      { 
        icon: <Lock size={24} />, 
        title: "Your Safety Matters", 
        bullets: [
          "All order updates happen inside the platform to ensure buyer protection.",
          "Report any suspicious behaviour or requests for off-platform payment to support immediately."
        ] 
      },
    ]
  },
  shipping: {
    title: "Shipping & Delivery",
    variant: "process",
    columns: 3,
    items: [
      { 
        icon: <Truck size={26} />, 
        title: "Dispatch Updates", 
        desc: "Track shipment once the seller dispatches the material; you will be provided with logistical details to monitor the transit." 
      },
      { 
        icon: <FileText size={26} />, 
        title: "Platform Updates", 
        desc: "Get updates on your shipment status through the platform to stay informed on the estimated arrival time." 
      },
      { 
        icon: <Lock size={26} />, 
        title: "Delivery Confirmation", 
        desc: "Check the scrap material upon arrival and confirm delivery completion on the platform to finalize the transaction." 
      },
    ]
  },
  tips: {
    title: "Tips & Best Practices",
    variant: "tips",
    columns: 5,
    items: [
      { 
        icon: <FileText size={20} />, 
        title: "Check Product Details", 
        desc: "Read specifications, description and other details to ensure it meets your industry needs." 
      },
      { 
        icon: <Search size={20} />, 
        title: "Verify Material Grade", 
        desc: "See images and documents shared by the seller for quality clarity and grade confirmation." 
      },
      { 
        icon: <Scale size={20} />, 
        title: "Order the Right quantity", 
        desc: "Avoid delays by confirming your required quantity beforehand against the seller's availability." 
      },
      { 
        icon: <MousePointer2 size={20} />, 
        title: "Inspect on Delivery", 
        desc: "Check moisture %, contamination, count / weight and other factors on arrival." 
      },
      { 
        icon: <Headphones size={20} />, 
        title: "Need Help?", 
        desc: "Our support team is always available to assist you with any questions during the process." 
      },
    ]
  }
};

const GuideSections = ({ sectionId }) => {
  const section = sectionsData[sectionId];

  if (!section) return null;

  return (
    <div className={`${styles.sectionBlock} ${styles[section.variant]}`}>
      <div className={styles.headerArea}>
        <h2 className={styles.sectionHeading}>{section.title}</h2>
        <div className={styles.headingLine}></div>
      </div>
      
      <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${section.columns}, 1fr)` }}>
        {section.items.map((item, i) => (
          <div key={i} className={styles.detailCard}>
            <div className={styles.cardIconBox}>{item.icon}</div>
            <div className={styles.cardContent}>
              <h4 className={styles.cardTitle}>{item.title}</h4>
              {item.desc && <p className={styles.cardDesc}>{item.desc}</p>}
              {item.bullets && (
                <ul className={styles.cardList}>
                  {item.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
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

export default GuideSections;