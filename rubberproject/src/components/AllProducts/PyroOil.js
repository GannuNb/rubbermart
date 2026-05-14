import React, { useEffect } from 'react';
import { FiArrowRight, FiCheckCircle, FiShield, FiTruck, FiActivity } from 'react-icons/fi';
import { GiOilDrum, GiFactory } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import styles from "../../styles/AllProducts/Tyrescrap.module.css";
import OilHero from '../../assests/Tyrescrap.png';

const PyroOil = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const technicalSpecs = [
    { label: "Calorific Value", value: "10,000+ kcal/kg", icon: <FiActivity /> },
    { label: "Flash Point", value: "40°C - 60°C", icon: <FiCheckCircle /> },
    { label: "Sulfur Content", value: "< 1.0%", icon: <FiShield /> },
    { label: "Supply Form", value: "Bulk Tankers", icon: <FiTruck /> },
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* 1. HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <span className={styles.tag}>Alternative Energy</span>
              <h1>Sustainable <span>Pyrolysis Oil</span></h1>

              <p>
                Optimize your industrial energy costs with high-yield Tyre Derived Oil (TDO).
                A carbon-efficient alternative to heavy furnace oil, perfect for
                high-output burners, kilns, and power generation.
              </p>

              <ul className={styles.valueList}>
                <li>✓ High Calorific Value (9,000+ kcal/kg)</li>
                <li>✓ Filtered to Minimize Moisture & Ash</li>
                <li>✓ Eco-Friendly Waste-to-Energy Solution</li>
              </ul>

              <div className={styles.heroBtns}>
                <a href="/" className={styles.primaryBtn}>Explore Marketplace</a>
              </div>
            </div>
            <div className={styles.heroImageWrapper}>
              <img src={OilHero} alt="Pyrolysis Oil" className={styles.heroImg} />
              <div className={styles.experienceBadge}>
                <strong>High</strong>
                <span> Calorific</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TECHNICAL SPECS BENTO */}
      <section className={styles.specSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Fuel <span>Specifications</span></h2>
            <p>Laboratory tested standards for high-efficiency combustion.</p>
          </div>
          <div className={styles.bentoGrid}>
            {technicalSpecs.map((spec, index) => (
              <div key={index} className={styles.specCard}>
                <div className={styles.specIcon}>{spec.icon}</div>
                <h3>{spec.value}</h3>
                <span>{spec.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CENTERED PRODUCT DISPLAY */}
      <div id="inventory" className={styles.marketplaceWrapper}>
        <div className={styles.container}>
          <div className={styles.gridHeader} style={{ textAlign: 'center' }}>
            <h2>Available <span>Product</span></h2>
          </div>
          <div className={styles.marketplaceGrid}>
            <div className={`${styles.productCard} ${styles.featured}`}>
              <div className={styles.imageContainer}>
                <img src={OilHero} alt="Pyrolysis Oil" />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.categoryTag}>Liquid Fuel</span>
                <h3>Standard Pyrolysis Oil</h3>
                <p>Filtered and de-watered TPO optimized for industrial heating and energy recovery systems.</p>
                <div className={styles.cardFooter}>
                  <Link to="/contactus" className={styles.quoteBtn}>
                    Request Pricing <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FOOTER FEATURES & CTA */}
      <section className={styles.featureSection}>
        <div className={styles.container}>
          <div className={styles.contentSplit}>
            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <GiOilDrum className={styles.featureIcon} />
                <div>
                  <h4>Bulk Logistics</h4>
                  <p>Flexible delivery options ranging from 20-ton tankers to flexitanks for global export.</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <GiFactory className={styles.featureIcon} />
                <div>
                  <h4>Industrial Grade</h4>
                  <p>Consistently maintained viscosity and moisture levels for seamless burner operation.</p>
                </div>
              </div>
            </div>
            <div className={styles.ctaBox}>
              <h3>Consult an Expert</h3>
              <p>Discuss bulk contract pricing and chemical analysis reports with our energy team.</p>
              <Link to="/contactus" className={styles.ctaBtn}>
                Contact Us <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PyroOil;