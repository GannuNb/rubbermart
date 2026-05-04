import React from "react";
import { Users, ShieldCheck, Globe, Leaf, Lock } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./WhoWeAreSection.module.css";

const WhoWeAreSection = () => {
  const features = [
    {
      icon: <ShieldCheck size={26} />,
      title: "Trusted Platform",
      desc: "We maintain a rigorous verification process for all sellers and buyers, ensuring a safe environment for genuine businesses to trade with complete confidence across the industry.",
    },
    {
      icon: <Globe size={26} />,
      title: "Global Reach",
      desc: "Expanding your horizons beyond local markets. We connect rubber industry leaders across 50+ countries, facilitating seamless international trade and long-term partnerships.",
    },
    {
      icon: <Leaf size={26} />,
      title: "Sustainability Focus",
      desc: "Driving the circular economy forward. Our platform prioritizes recycled rubber products, helping businesses reduce their carbon footprint and promote a greener future for all.",
    },
    {
      icon: <Lock size={26} />,
      title: "Secure Transactions",
      desc: "Your security is our priority. Benefit from protected payment gateways, verified lead generation, and reliable end-to-end support for every deal you close on our marketplace.",
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <section className={styles.sectionWrapper}>
      <div className="container-fluid px-md-5">
        <motion.div 
          className={styles.mainCard}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div className="row g-0 align-items-center">
            
            {/* Left Brand Column */}
            <div className="col-lg-5">
              <div className={styles.introContent}>
                <div className={styles.headerRow}>
                  <div className={styles.iconCircleLarge}>
                    <Users size={32} strokeWidth={1.5} />
                  </div>
                  <h2 className={styles.mainTitle}>Who We Are</h2>
                </div>
                
                <p className={styles.mainDescription}>
                  RubberScrapMart is India's First and most trusted B2B 
                  marketplace for rubber derived products. We connect 
                  buyers and sellers globally, promoting sustainability 
                  through high-quality recycled rubber solutions.
                </p>
                
                <button className={styles.learnMoreBtn}>
                  Learn More About Us
                </button>
              </div>
            </div>

            {/* Right Features Column (2x2 Grid) */}
            <div className="col-lg-7">
              <div className={styles.featuresGrid}>
                {features.map((item, index) => (
                  <div key={index} className={styles.featureItem}>
                    <div className={styles.iconCircleSmall}>
                      {item.icon}
                    </div>
                    <div className={styles.featureTextWrapper}>
                      <h4 className={styles.featureTitle}>{item.title}</h4>
                      <p className={styles.featureDesc}>{item.desc}</p>
                    </div>
                  </div>
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