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
      title: "Trusted Marketplace",
      desc: "Verified buyers and sellers ensuring secure and reliable B2B transactions across the rubber scrap industry.",
    },
    {
      icon: <Globe size={26} />,
      title: "Pan India Network",
      desc: "Connecting rubber businesses, recyclers, traders, and industries across multiple states in India.",
    },
    {
      icon: <Leaf size={26} />,
      title: "Sustainability Driven",
      desc: "Promoting eco-friendly recycled rubber solutions that help reduce waste and support a greener future.",
    },
    {
      icon: <Lock size={26} />,
      title: "Secure Business Deals",
      desc: "Advanced verification, protected communication, and trusted marketplace support for every transaction.",
    },
  ];

  return (
    <section className={styles.sectionWrapper}>

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

            {/* LEFT CONTENT */}
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

                {/* DESCRIPTION */}
                <p className={styles.mainDescription}>
                  RubberScrapMart is India’s dedicated B2B marketplace
                  for rubber derived products and tyre scrap materials.
                  We connect buyers, sellers, recyclers, and industries
                  through a secure digital platform focused on transparency,
                  sustainability, and efficient business growth.
                </p>

                {/* BUTTON */}
                <button className={styles.learnMoreBtn}>
                  Explore Our Marketplace
                  <MoveRight size={18} />
                </button>

              </div>

            </div>

            {/* RIGHT FEATURES */}
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

                    {/* DESCRIPTION */}
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