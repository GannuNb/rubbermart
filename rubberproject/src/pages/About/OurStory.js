// src/components/about/OurStory.jsx

import styles from "../../styles/About/OurStory.module.css";

import { Target, Orbit } from "lucide-react";

const OurStory = () => {
  return (
    <section className={styles.ourStory}>
      <div className={styles.container}>
        <div className={styles.storyGrid}>
          {/* LEFT CONTENT */}
          <div className={styles.storyContent}>
            <span className={styles.sectionTag}>OUR STORY</span>

            <h2>The Journey Behind RubberScrapMart</h2>

            <p>
              RubberScrapMart was founded with a vision to modernize the rubber
              scrap trading industry by creating a transparent, technology-driven,
              and trusted B2B marketplace for businesses across India.
            </p>

            <p>
              The rubber recycling industry plays a crucial role in sustainability
              and industrial growth, yet businesses often face challenges like
              fragmented supply chains, inconsistent pricing, and lack of trusted
              networks.
            </p>

            <p>
              We built RubberScrapMart to bridge these gaps by connecting verified
              buyers and sellers through a seamless digital ecosystem that drives
              efficiency, trust, and long-term business growth.
            </p>
          </div>

          {/* RIGHT CARDS */}
          <div className={styles.missionWrapper}>
            {/* MISSION */}
            <div className={styles.missionCard}>
              <div className={styles.iconBox}>
                <Target size={26} strokeWidth={2.3} />
              </div>

              <div>
                <h3>Our Mission</h3>

                <p>
                  To simplify rubber scrap trading for businesses by providing a
                  transparent, reliable, and efficient marketplace that supports
                  sustainability and business growth.
                </p>
              </div>
            </div>

            {/* VISION */}
            <div className={styles.missionCard}>
              <div className={styles.iconBox}>
                <Orbit size={26} strokeWidth={2.3} />
              </div>

              <div>
                <h3>Our Vision</h3>

                <p>
                  To become India’s most trusted and preferred rubber scrap B2B
                  marketplace while contributing toward a cleaner and circular
                  economy for the future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;