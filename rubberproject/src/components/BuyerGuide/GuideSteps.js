import React from "react";
import styles from "../../styles/BuyerGuide/GuideSteps.module.css";
import {
  Search,
  ShoppingCart,
  ClipboardCheck,
  Truck,
  Package,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: <Search size={34} />,
    title: "Browse Products",
    desc: "Explore categories and find the right materials you need.",
  },
  {
    icon: <ShoppingCart size={34} />,
    title: "Place an Order",
    desc: "Select the quantity and placed your order easily.",
  },
  {
    icon: <ClipboardCheck size={34} />,
    title: "Seller Approval",
    desc: "Seller reviews your order and approves it with updated details.",
  },
  {
    icon: <Truck size={34} />,
    title: "Shipping",
    desc: "Seller dispatches the material and shares tracking updates.",
  },
  {
    icon: <Package size={34} />,
    title: "Receive Order",
    desc: "Inspect the material on arrival for quality and quantity.",
  },
  {
    icon: <ShieldCheck size={34} />,
    title: "Order Completed",
    desc: "Confirm completion and provide feedback for a trusted experience.",
  },
];

const GuideSteps = () => {
  return (
    <section className={styles.section}>
      <div className={styles.headingContainer}>
        <span className={styles.dots}>•••</span>
        <h2 className={styles.heading}>How to Buy</h2>
        <span className={styles.dots}>•••</span>
      </div>

      <div className={styles.grid}>
        {steps.map((item, index) => (
          <React.Fragment key={index}>
            <div className={styles.card}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <div className={styles.iconCircle}>{item.icon}</div>
              <h4 className={styles.cardTitle}>{item.title}</h4>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
            
            {/* Arrow logic: Hidden via CSS on specific breakpoints */}
            {index !== steps.length - 1 && (
              <div className={styles.arrowContainer}>
                <ArrowRight className={styles.arrowIcon} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default GuideSteps;