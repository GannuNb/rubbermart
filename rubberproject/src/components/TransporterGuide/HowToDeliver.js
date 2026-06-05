import React from "react";
import { 
  ClipboardList, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Package, 
  FileCheck2, 
  ArrowRight 
} from "lucide-react";
import styles from "./HowToDeliver.module.css";

const HowToDeliver = () => {
  const steps = [
    { 
      icon: <ClipboardList size={24} />, 
      title: "Receive Assignment", 
      desc: "You will receive delivery assignments from admin for specific orders." 
    },
    { 
      icon: <CheckCircle2 size={24} />, 
      title: "Accept Delivery", 
      desc: "Review the details and accept the delivery that you can manage." 
    },
    { 
      icon: <Truck size={24} />, 
      title: "Arrange Vehicle", 
      desc: "Assign a suitable vehicle and get ready for pickup." 
    },
    { 
      icon: <MapPin size={24} />, 
      title: "Pick Material", 
      desc: "Reach the seller location and pick up the material." 
    },
    { 
      icon: <Package size={24} />, 
      title: "Deliver Material", 
      desc: "Transport and deliver the material to the buyer location." 
    },
    { 
      icon: <FileCheck2 size={24} />, 
      title: "Upload Proof", 
      desc: "Upload proof of delivery and complete the assignment." 
    },
  ];

  return (
    <section className={styles.sectionWrapper}>
      {/* HEADER SECTION MATCHING FIGMA */}
      <div className={styles.sectionHeader}>
        <span className={styles.headerDots}>•••</span> 
        <h3 className={styles.headerTitle}>How To Deliver</h3> 
        <span className={styles.headerDots}>•••</span>
      </div>

      {/* CARDS TIMELINE GRID */}
      <div className="row g-3 align-items-stretch justify-content-center">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="col-xl-2 col-lg-4 col-md-6 d-flex">
              <div className={styles.stepCard}>
                {/* FLOATING CORNER BADGE */}
                <div className={styles.stepNumberBadge}>{idx + 1}</div>
                
                {/* ICON BOX CONTAINER */}
                <div className={styles.iconContainer}>
                  {step.icon}
                </div>
                
                <h5 className={styles.cardTitle}>{step.title}</h5>
                <p className={styles.cardDesc}>{step.desc}</p>
              </div>
            </div>
            
            {/* FIGMA TIMELINE CONNECTING ARROW */}
            {idx < steps.length - 1 && (
              <div className={`col-auto d-none d-xl-flex align-items-center justify-content-center ${styles.arrowWrapper}`}>
                <ArrowRight size={18} className={styles.connectorArrow} strokeWidth={2.5} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default HowToDeliver;