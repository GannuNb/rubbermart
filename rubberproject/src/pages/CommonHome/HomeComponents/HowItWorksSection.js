import React from "react";
import { UserPlus, Search, ClipboardList, Truck, CheckCircle2, MoveRight } from "lucide-react";
import styles from "./HowItWorksSection.module.css";

function HowItWorksSection() {
  const steps = [
    {
      icon: <UserPlus size={24} />,
      title: "1. Get Started",
      desc: "Create your profile in seconds. Register as a buyer to source materials or a seller to reach global rubber markets.",
    },
    {
      icon: <Search size={24} />,
      title: "2. Explore & Connect",
      desc: "Use advanced filters to find specific rubber grades, verified suppliers, and lucrative trade opportunities worldwide.",
    },
    {
      icon: <ClipboardList size={24} />,
      title: "3. Order & Negotiate",
      desc: "Communicate directly with partners to discuss specifications, negotiate pricing, and finalize secure digital contracts.",
    },
    {
      icon: <Truck size={24} />,
      title: "4. Ship & Track",
      desc: "Benefit from integrated logistics. Monitor your shipment’s journey from the warehouse to your doorstep in real-time.",
    },
    {
      icon: <CheckCircle2 size={24} />,
      title: "5. Complete Trade",
      desc: "Inspect your delivery and release payment securely. Leave feedback to maintain a trusted community ecosystem.",
    },
  ];

  return (
    <section className={styles.sectionPadding}>
      <div className="container-fluid px-md-5">
        <div className={styles.mainContainer}>
          <div className={styles.headerText}>
            <h2 className={styles.title}>How It Works</h2>
            <p className={styles.subtitle}>Our streamlined process ensures a secure and efficient trading experience.</p>
          </div>

          <div className={styles.stepsWrapper}>
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className={styles.stepItem}>
                  <div className={styles.iconCircle}>
                    {step.icon}
                  </div>
                  <div className={styles.stepContent}>
                    <h5 className={styles.stepTitle}>{step.title}</h5>
                    <p className={styles.stepDesc}>{step.desc}</p>
                  </div>
                </div>
                
                {index !== steps.length - 1 && (
                  <div className={styles.arrowWrapper}>
                    <MoveRight 
                      className={styles.arrowIcon} 
                      size={32} 
                      strokeWidth={2.5} 
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;