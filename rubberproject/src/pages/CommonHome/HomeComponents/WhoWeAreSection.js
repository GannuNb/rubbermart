import React from "react";
import {
  Users,
  ShieldCheck,
  Globe,
  Leaf,
  Lock,
  MoveRight,
} from "lucide-react";

import { motion } from "framer-motion";

import bgImage from "../../../assests/wwa.png";

import styles from "./WhoWeAreSection.module.css";

const WhoWeAreSection = () => {

  const features = [
    {
      icon: <ShieldCheck size={26} />,
      title: "Trusted Platform",
      desc: "Verified sellers and buyers ensuring secure and reliable B2B transactions across the recycled rubber industry.",
    },
    {
      icon: <Globe size={26} />,
      title: "Global Reach",
      desc: "Connecting businesses across 50+ countries with seamless international sourcing and trade opportunities.",
    },
    {
      icon: <Leaf size={26} />,
      title: "Sustainability Focus",
      desc: "Promoting eco-friendly recycled rubber solutions that support a greener and more sustainable future.",
    },
    {
      icon: <Lock size={26} />,
      title: "Secure Transactions",
      desc: "Advanced verification, protected communication, and trusted marketplace support for every business deal.",
    },
  ];

  return (
    <section className={styles.sectionWrapper}>

      {/* REMOVE px-xl-5 px-lg-4 px-3 */}
      <div className="container-fluid p-0">

        <motion.div
          className={styles.mainCard}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >

          {/* BACKGROUND */}
          <div
            className={styles.bgOverlay}
            style={{
              backgroundImage: `url(${bgImage})`,
            }}
          />

          <div className="row align-items-center position-relative g-0">

            {/* =========================
                LEFT CONTENT
            ========================= */}
            <div className="col-lg-5">

              <div className={styles.leftContent}>

                {/* TAG */}
                <div className={styles.topTag}>
                  <Users size={14} />
                  <span>About RubberScrapMart</span>
                </div>

                {/* TITLE */}
                <h2 className={styles.mainTitle}>
                  Who <span>We Are</span>
                </h2>

                {/* SMALL LINE */}
                <div className={styles.titleLine}></div>

                {/* DESC */}
                <p className={styles.mainDescription}>
                  RubberScrapMart is India's first and most trusted
                  B2B marketplace for rubber derived products.
                  We connect buyers and sellers globally,
                  promoting sustainability through high-quality
                  recycled rubber solutions.
                </p>

                {/* BUTTON */}
                <button className={styles.learnMoreBtn}>
                  Learn More About Us
                  <MoveRight size={18} />
                </button>

              </div>

            </div>

            {/* =========================
                RIGHT FEATURES
            ========================= */}
            <div className="col-lg-7">

              <div className={styles.featuresGrid}>

                {features.map((item, index) => (

                  <motion.div
                    key={index}
                    className={styles.featureCard}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                  >

                    {/* ICON */}
                    <div className={styles.iconBox}>
                      {item.icon}
                    </div>

                    {/* TITLE */}
                    <h4>{item.title}</h4>

                    {/* DESC */}
                    <p>{item.desc}</p>

                    {/* BOTTOM LINE */}
                    <div className={styles.cardLine}></div>

                    {/* DOTS */}
                    <div className={styles.dots}>
                      •••
                    </div>

                  </motion.div>

                ))}

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
};

export default WhoWeAreSection;