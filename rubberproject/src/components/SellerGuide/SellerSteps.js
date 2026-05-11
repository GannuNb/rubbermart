import React from "react";
import styles from "../../styles/SellerGuide/GuideSteps.module.css";
import { UserPlus, PlusCircle, Truck, BadgeCheck, ShieldCheck } from "lucide-react";

const steps = [
  { icon: <UserPlus size={36} />, title: "Register", desc: "Create your seller profile and get verified by our admin team." },
  { icon: <PlusCircle size={36} />, title: "List Material", desc: "Upload photos and details of your scrap (grade, moisture, quantity)." },
  { icon: <ShieldCheck size={36} />, title: "Listing Approved", desc: "Your material is reviewed and published on the platform." },
  { icon: <Truck size={36} />, title: "Ship Material", desc: "Arrange logistics and update tracking details on the platform." },
  { icon: <BadgeCheck size={36} />, title: "Get Paid", desc: "Receive secure payment once the transaction is completed." },
];

const SellerSteps = () => {
  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>How to Sell on RubberScrapMart</h2>
      <div className={styles.grid}>
        {steps.map((item, index) => (
          <div className={styles.card} key={index}>
            <div className={styles.stepNumber}>{index + 1}</div>
            <div className={styles.iconWrapper}>
              <div className={styles.iconCircle}>{item.icon}</div>
            </div>
            <h4 className={styles.cardTitle}>{item.title}</h4>
            <p className={styles.cardDesc}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerSteps;