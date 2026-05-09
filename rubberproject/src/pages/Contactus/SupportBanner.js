import React from "react";
import {
    FiMessageSquare,
    FiHeadphones,
    FiMessageCircle,
} from "react-icons/fi";

import styles from "../../styles/Contactus/SupportBanner.module.css";

const SupportBanner = () => {
    return (
        <div className={styles.supportBanner}>
            <div className={styles.supportGlow} />

            <div className={styles.supportLeft}>
                <div className={styles.supportIcon}>
                    <FiHeadphones className={styles.mainIcon} />
                    <FiMessageCircle className={styles.subIcon} />
                </div>

                <div className={styles.textBlock}>
                    <h3>Still have questions?</h3>
                    <p>Our support team is ready to help you anytime.</p>
                </div>
            </div>

            <button className={styles.supportBtn}>
                <FiMessageSquare />
                Contact Support
            </button>
        </div>
    );
};

export default SupportBanner;