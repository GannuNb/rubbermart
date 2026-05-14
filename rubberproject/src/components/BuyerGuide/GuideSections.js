import React from "react";
import styles from "../../styles/BuyerGuide/GuideSections.module.css";
import {
  FileText,
  User,
  Package,
  Truck,
  CheckCircle,
  Lock,
  CreditCard,
  Shield,
  Send,
  Bell,
  Box,
  Search,
  Award,
  ClipboardList,
  Handshake,
  Star,
  Headphones,
} from "lucide-react";

const sections = {
  order: {
    type: "timeline",
    title: "Order Process",
    items: [
      {
        icon: <FileText size={24} />,
        title: "Order Placed",
        desc: "You place an order and proceed with details.",
      },
      {
        icon: <User size={24} />,
        title: "Seller Confirms",
        desc: "Seller verifies and confirms your order.",
      },
      {
        icon: <Package size={24} />,
        title: "Packing",
        desc: "Material is packed and prepared for dispatch.",
      },
      {
        icon: <Truck size={24} />,
        title: "Shipped",
        desc: "Your order is shipped with tracking details.",
      },
      {
        icon: <CheckCircle size={24} />,
        title: "Delivered",
        desc: "Order delivered successfully to your location.",
      },
    ],
  },

  payment: {
    type: "gradientCards",
    title: "Payment & Safety",
    items: [
      {
        icon: <Lock size={22} />,
        title: "Secure Transactions",
        bullets: [
          "Safe and verified transactions for buyers and sellers.",
          "All payments are protected and processed securely.",
        ],
      },
      {
        icon: <CreditCard size={22} />,
        title: "How to Pay",
        bullets: [
          "Pay securely online or via bank transfer.",
          "Payments are released after order confirmation.",
        ],
      },
      {
        icon: <Shield size={22} />,
        title: "Your Safety Matters",
        bullets: [
          "Our team monitors all transactions for your safety.",
          "Report suspicious activity immediately.",
        ],
      },
    ],
  },

  shipping: {
    type: "whiteCards",
    title: "Shipping & Delivery",
    items: [
      {
        icon: <Send size={24} />,
        color: "blue",
        title: "Dispatch Updates",
        desc: "Track shipment updates in real-time via email or platform.",
      },
      {
        icon: <Bell size={24} />,
        color: "purple",
        title: "Platform Updates",
        desc: "Regular order updates from packing to delivery.",
      },
      {
        icon: <CheckCircle size={24} />,
        color: "green",
        title: "Delivery Confirmation",
        desc: "Check and confirm delivery once order is received.",
      },
      {
        icon: <Box size={24} />,
        color: "orange",
        title: "Timely Delivery",
        desc: "Trusted logistics for safe and on-time delivery.",
      },
    ],
  },

  tips: {
    type: "miniCards",
    title: "Tips & Best Practices",
    items: [
      {
        icon: <Search size={20} />,
        color: "purple",
        title: "Check Product Details",
        desc: "Review product specs, images & descriptions carefully.",
      },
      {
        icon: <Award size={20} />,
        color: "yellow",
        title: "Verify Material Grade",
        desc: "Ensure material grade matches requirements.",
      },
      {
        icon: <ClipboardList size={20} />,
        color: "blue",
        title: "Order Right Quantity",
        desc: "Plan quantity based on needs and availability.",
      },
      {
        icon: <Box size={20} />,
        color: "orange",
        title: "Inspect on Delivery",
        desc: "Check material quality before acceptance.",
      },
      {
        icon: <Handshake size={20} />,
        color: "pink",
        title: "Negotiate Smartly",
        desc: "Communicate clearly for best pricing.",
      },
      {
        icon: <Star size={20} />,
        color: "yellow",
        title: "Review Ratings",
        desc: "Check seller ratings before ordering.",
      },
      {
        icon: <Headphones size={20} />,
        color: "purple",
        title: "Raise a Query",
        desc: "Contact support for doubts or assistance.",
      },
    ],
  },
};

const GuideSections = ({ sectionId }) => {
  const section = sections[sectionId];
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

export default GuideSections;