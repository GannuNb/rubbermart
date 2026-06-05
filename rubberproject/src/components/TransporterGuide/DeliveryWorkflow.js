import React from "react";
import { 
  ClipboardList, 
  UserCheck, 
  Truck, 
  MapPin, 
  Route, 
  PackageCheck, 
  IndianRupee 
} from "lucide-react";
import styles from "./DeliveryWorkflow.module.css";

const DeliveryWorkflow = () => {
  const nodes = [
    { 
      label: "Assignment", 
      sub: "Order is assigned to you by admin",
      icon: <ClipboardList size={18} />
    },
    { 
      label: "Acceptance", 
      sub: "You accept the delivery request",
      icon: <UserCheck size={18} />
    },
    { 
      label: "Vehicle Dispatch", 
      sub: "Vehicle is arranged for the shipment",
      icon: <Truck size={18} />
    },
    { 
      label: "Material Pickup", 
      sub: "Material is picked up from seller",
      icon: <MapPin size={18} />
    },
    { 
      label: "In Transit", 
      sub: "Material is on the way to destination",
      icon: <Route size={18} />
    },
    { 
      label: "Delivered", 
      sub: "Material is delivered to buyer",
      icon: <PackageCheck size={18} />
    },
    { 
      label: "Payment Released", 
      sub: "Payment is released to your account",
      icon: <IndianRupee size={18} />
    },
  ];

  return (
    <section className={styles.sectionWrapper}>
      {/* SECTION HEADER */}
      <div className={styles.sectionHeader}>
        <span className={styles.headerDots}>•••</span> 
        <h3 className={styles.headerTitle}>Delivery Workflow</h3> 
        <span className={styles.headerDots}>•••</span>
      </div>

      {/* HORIZONTAL TIMELINE CONTAINER */}
      <div className={styles.timelineOuterBox}>
        <div className={styles.timelineTrackLine}></div>
        
        <div className={styles.nodesWrapper}>
          {nodes.map((node, idx) => (
            <div key={idx} className={styles.workflowNode}>
              {/* CORE ICON CIRCLE */}
              <div className={styles.nodeCircle}>
                {node.icon}
              </div>
              
              {/* META CONTENT */}
              <h6 className={styles.nodeLabel}>{node.label}</h6>
              <p className={styles.nodeSubText}>{node.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeliveryWorkflow;