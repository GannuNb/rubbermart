// src/components/about/CommitmentSection.jsx

import styles from "../../styles/About/CommitmentSection.module.css";

import AboutGreen from "../../assests/Aboutgreen.png";

import {
  CheckCircle2,
  Leaf,
  Recycle,
  Factory,
  ArrowRight,
} from "lucide-react";

const commitments = [
  "Promoting responsible recycling and reuse of rubber materials",
  "Helping industries achieve sustainability and ESG goals",
  "Reducing industrial waste through smarter scrap management",
  "Creating a cleaner and greener future for next generations",
];

const CommitmentSection = () => {
  return (
    <section className={styles.commitmentSection}>
      <div className={styles.container}>
        <div className={styles.commitmentGrid}>
          {/* IMAGE SIDE */}
          <div className={styles.imageWrapper}>
            <img
              src={AboutGreen}
              alt="sustainability"
              className={styles.image}
            />

            {/* FLOATING CARD */}
            <div className={styles.floatingCard}>
              <div className={styles.floatingIcon}>
                <Leaf size={22} strokeWidth={2.2} />
              </div>

              <div>
                <h4>Sustainable Future</h4>
                <p>Driving eco-friendly recycling solutions</p>
              </div>
            </div>
          </div>

          {/* CONTENT SIDE */}
          <div className={styles.content}>
            <span className={styles.sectionTag}>OUR COMMITMENT</span>

            <h2>Committed to a Better Tomorrow</h2>

            <p className={styles.description}>
              At RubberScrapMart, sustainability is at the core of everything we
              do. We are committed to transforming the rubber scrap industry
              through responsible recycling, transparent trade practices, and
              technology-driven solutions that support a circular economy.
            </p>

            {/* FEATURES */}
            <div className={styles.features}>
              {commitments.map((item, index) => (
                <div className={styles.featureItem} key={index}>
                  <div className={styles.featureIcon}>
                    <CheckCircle2 size={18} strokeWidth={2.5} />
                  </div>

                  <p>{item}</p>
                </div>
              ))}
            </div>

            {/* INFO CARDS */}
            <div className={styles.bottomCards}>
              <div className={styles.infoCard}>
                <div className={styles.cardIcon}>
                  <Recycle size={24} strokeWidth={2.2} />
                </div>

                <div>
                  <h3>Eco-Friendly</h3>
                  <span>Supporting responsible recycling</span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.cardIcon}>
                  <Factory size={24} strokeWidth={2.2} />
                </div>

                <div>
                  <h3>Industry Growth</h3>
                  <span>Helping businesses grow sustainably</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommitmentSection;