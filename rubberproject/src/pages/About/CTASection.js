// src/components/about/CTASection.jsx

import styles from "../../styles/About/CTASection.module.css";

import { ArrowRight, ShieldCheck } from "lucide-react";

const CTASection = () => {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <div className={styles.ctaWrapper}>
          {/* LEFT CONTENT */}
          <div className={styles.leftContent}>
            <div className={styles.badge}>
              <ShieldCheck size={16} strokeWidth={2.4} />
              Trusted B2B Marketplace
            </div>

            <h2>
              Join Thousands of Businesses Growing with
              <span> RubberScrapMart</span>
            </h2>

            <p>
              Be a part of India’s trusted rubber scrap marketplace and connect
              with verified buyers, sellers, and recycling businesses across
              industries.
            </p>
          </div>

          {/* BUTTON */}
          <div className={styles.buttonWrapper}>
            <button className={styles.ctaButton}>
              Join Now
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;