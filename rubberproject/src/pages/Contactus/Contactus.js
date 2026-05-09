import React from "react";

import ContactHero from "./ContactHero";
import ContactMain from "./ContactMain";
import FAQSection from "./FAQSection";
import SupportBanner from "./SupportBanner";

import styles from "../../styles/Contactus/Contactus.module.css";

const Contactus = () => {
    return (
        <div className={styles.contactPage}>
            <ContactHero />
            <ContactMain />
            <FAQSection />
            <SupportBanner />
        </div>
    );
};

export default Contactus;