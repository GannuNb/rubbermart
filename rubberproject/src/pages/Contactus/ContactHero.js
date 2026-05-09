// ContactHero.js

import React from "react";

import {
    FiMail,
    FiPhoneCall,
    FiMessageCircle,
} from "react-icons/fi";

import contactImage from "../../assests/Contactus.png";

import styles from "../../styles/Contactus/ContactHero.module.css";

const ContactHero = () => {
    return (
        <section className={styles.heroSection}>

            {/* BACKGROUND PATTERN */}
            <div className={styles.bgPattern}></div>

            {/* LEFT */}
            <div className={styles.heroContent}>

                <div className={styles.topTag}>
                    <FiMessageCircle />
                    Let’s Talk
                </div>

                <h1>
                    Contact Our <span>Support Team</span>
                </h1>

                <p>
                    Have questions or business inquiries?
                    Our team is always ready to help you with
                    quick and professional support.
                </p>

                {/* CONTACT CARDS */}
                <div className={styles.contactCards}>

                    <div className={styles.contactCard}>
                        <div className={styles.iconBox}>
                            <FiMail />
                        </div>

                        <div>
                            <h4>Email Support</h4>
                            <span>Quick replies within 24 hours</span>
                        </div>
                    </div>

                    <div className={styles.contactCard}>
                        <div className={styles.iconBox}>
                            <FiPhoneCall />
                        </div>

                        <div>
                            <h4>Call Anytime</h4>
                            <span>Professional assistance available</span>
                        </div>
                    </div>

                </div>

                <button className={styles.contactBtn}>
                    Contact Support
                </button>

            </div>

            {/* RIGHT */}
            <div className={styles.heroImageSection}>

                {/* FLOATING CARDS */}
                <div className={styles.floatCardOne}>
                    <FiMail />
                    Instant Email Support
                </div>

                <div className={styles.floatCardTwo}>
                    <FiPhoneCall />
                    24/7 Customer Assistance
                </div>

                <img
                    src={contactImage}
                    alt="contact"
                    className={styles.heroImage}
                />

            </div>

        </section>
    );
};

export default ContactHero;