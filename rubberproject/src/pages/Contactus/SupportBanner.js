import React from "react";
import {
  FiHeadphones,
  FiMessageCircle,
  FiPhoneCall,
  FiMail,
} from "react-icons/fi";

import styles from "../../styles/Contactus/SupportBanner.module.css";

const SupportBanner = () => {
  return (
    <section className={styles.supportBanner}>
      <div className={styles.supportGlow}></div>

      <div className={styles.supportContent}>
        {/* LEFT */}
        <div className={styles.supportLeft}>
          <div className={styles.supportIcon}>
            <FiHeadphones className={styles.mainIcon} />
            <FiMessageCircle className={styles.subIcon} />
          </div>

          <div className={styles.textBlock}>
            <h3>Still have questions?</h3>
            <p>
              Our support team is available to assist you with platform queries,
              buyer connections, and business support.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.supportActions}>
          <a href="tel:02246033434" className={styles.primaryBtn}>
            <FiPhoneCall />
            Call Support
          </a>

          <a
            href="mailto:info@rubberscrapmart.com"
            className={styles.secondaryBtn}
          >
            <FiMail />
            Email Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default SupportBanner;