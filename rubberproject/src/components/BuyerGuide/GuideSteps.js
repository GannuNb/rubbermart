import React from "react";
import styles from "../../styles/BuyerGuide/GuideSteps.module.css";
import { Search, ShoppingCart, ClipboardCheck, Truck, Package, ShieldCheck } from "lucide-react";

const steps = [
  { icon: <Search size={36} />, title: "Browse Products", desc: "Explore Categories and find the scrap materials you need." },
  { icon: <ShoppingCart size={36} />, title: "Place an Order", desc: "Select the quantity and submit your order request." },
  { icon: <ClipboardCheck size={36} />, title: "Seller Approval", desc: "Seller reviews your order and approves it with updated details." },
  { icon: <Truck size={36} />, title: "Shipping", desc: "Seller dispatches the material and shares tracking updates." },
  { icon: <Package size={36} />, title: "Receive Order", desc: "Inspect the delivered scrap material for quality and quantity." },
  { icon: <ShieldCheck size={36} />, title: "Order Completed", desc: "Confirm completion once everything matches expectations." },
];

const GuideSteps = () => {
  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>How to Buy</h2>
      <div className={styles.grid}>
        {steps.map((item, index) => (
          <div className={styles.card} key={index}>
            <div className={styles.stepNumber}>{index + 1}</div>
            <div className={styles.iconWrapper}>
              <div className={styles.iconCircle}>
                {item.icon}
              </div>
            </div>
            <h4 className={styles.cardTitle}>{item.title}</h4>
            <p className={styles.cardDesc}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuideSteps;