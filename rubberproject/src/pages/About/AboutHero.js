// src/components/about/AboutHero.jsx

import styles from "../../styles/About/AboutHero.module.css";

import AboutImage from "../../assests/About.png";
import HeroBg from "../../assests/Aboutherobg.png";

import {
  ShieldCheck,
  ShoppingBag,
  Users,
  BadgeCheck,
} from "lucide-react";

const AboutHero = () => {
  return (
    <section
      className={styles.aboutHero}
      style={{
        backgroundImage: `url(${HeroBg})`,
      }}
    >
      <div className={styles.overlay}></div>

      <div className={styles.container}>
        <div className={styles.heroGrid}>
          {/* LEFT */}
          <div className={styles.heroLeft}>
            <span className={styles.sectionTag}>ABOUT US</span>

            <h1>
              Building a Stronger,
              <br />
              Sustainable Future{" "}
              <span className={styles.highlight}>Together</span>
            </h1>

            <p>
              RubberScrapMart is a trusted B2B marketplace connecting verified
              buyers and sellers of rubber scrap materials across industries. We
              simplify scrap trading through a transparent, efficient, and
              reliable digital platform.
            </p>

            {/* STATS */}
            <div className={styles.heroStats}>
              <div className={styles.statCard}>
                <div className={styles.iconBox}>
                  <ShieldCheck size={22} strokeWidth={2.2} />
                </div>

                <div>
                  <h3>10,000+</h3>
                  <span>Verified Businesses</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.iconBox}>
                  <ShoppingBag size={22} strokeWidth={2.2} />
                </div>

                <div>
                  <h3>50,000+</h3>
                  <span>Orders Facilitated</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.iconBox}>
                  <Users size={22} strokeWidth={2.2} />
                </div>

                <div>
                  <h3>200+</h3>
                  <span>Cities Covered</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.heroRight}>
            <img src={AboutImage} alt="Rubber Scrap" />

            <div className={styles.trustedCard}>
              <div className={styles.trustedIcon}>
                <BadgeCheck size={28} strokeWidth={2.4} />
              </div>

              <div>
                <h4>Trusted by</h4>
                <p>Businesses Across India</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;