import React from "react";
import styles from "./TrustedBySection.module.css";
import saraswathiImg from "../../../assests/saraswathi.png";
import vssiImg from "../../../assests/vssi.png";
import vssGranulationImg from "../../../assests/vssgranulation.webp";
import lavaRubberImg from "../../../assests/lavarubberllc.png";

const TrustedBySection = () => {
  const partners = [
    { name: "Lakshmi Ganapathi Industries", img: saraswathiImg },
    { name: "VSS Granulation Pvt Ltd", img: vssGranulationImg },
    { name: "Venkata Siva Sai Industries", img: vssiImg },
    { name: "Lava Rubber FZ-LLC", img: lavaRubberImg },
  ];

  // Double the partners to create a seamless infinite loop
  const scrollPartners = [...partners, ...partners];

  return (
    <section className={styles.trustedSection}>
      <div className="container-fluid px-md-5">
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Trusted By Leading Businesses</h2>
          <div className={styles.line}></div>
        </div>

        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeTrack}>
            {scrollPartners.map((partner, index) => (
              <div key={index} className={styles.logoWrapper}>
                <img 
                  src={partner.img} 
                  alt={partner.name} 
                  className={styles.partnerLogo} 
                  title={partner.name}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;