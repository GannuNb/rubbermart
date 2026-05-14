import React from "react";
import styles from "../../styles/SellerGuide/GuideSteps.module.css";
import { 
  UserPlus, 
  PlusCircle, 
  ShieldCheck, 
  Truck, 
  BadgeCheck, 
  ArrowRight 
} from "lucide-react";

const steps = [
  { 
    icon: <UserPlus size={34} />, 
    title: "Register", 
    desc: "Create your seller profile and get verified by our admin team." 
  },
  { 
    icon: <PlusCircle size={34} />, 
    title: "List Material", 
    desc: "Upload photos and details of your scrap (grade, moisture, quantity)." 
  },
  { 
    icon: <ShieldCheck size={34} />, 
    title: "Listing Approved", 
    desc: "Your material is reviewed and published on the platform." 
  },
  { 
    icon: <Truck size={34} />, 
    title: "Ship Material", 
    desc: "Arrange logistics and update tracking details on the platform." 
  },
  { 
    icon: <BadgeCheck size={34} />, 
    title: "Get Paid", 
    desc: "Receive secure payment once the transaction is completed." 
  },
];

const SellerSteps = () => {
  return (
    <section className={styles.section}>
      <div className={styles.headingContainer}>
        <span className={styles.dots}>•••</span>
        <h2 className={styles.heading}>How to Sell</h2>
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
            
            {/* Arrow logic: Displays between cards */}
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

export default SellerSteps;