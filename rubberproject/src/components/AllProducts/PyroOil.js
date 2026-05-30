import React, { useEffect } from 'react';
import { FiArrowRight, FiCheckCircle, FiShield, FiTruck, FiActivity } from 'react-icons/fi';
import { GiOilDrum, GiFactory } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import styles from "../../styles/AllProducts/Tyrescrap.module.css";

// Asset
import OilHero from '../../assests/categoryimages/pyrooil.png';

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
              <span className={styles.tag}>Alternative Fuel Product Range</span>

              <h1>
                Explore Our <span>Pyrolysis Oil Products</span>
              </h1>

              <p>
                We supply high-quality Tyre Derived Oil (TDO) for industrial energy applications.
                Our pyrolysis oil is processed, filtered, and optimized for efficient combustion
                in kilns, boilers, and power systems.
              </p>

              <ul className={styles.valueList}>
                <li>✓ High Calorific Value Industrial Fuel</li>
                <li>✓ Filtered & Moisture-Controlled Oil</li>
                <li>✓ Bulk Supply & Export Available</li>
              </ul>

              <div className={styles.heroBtns}>
                <a href="#inventory" className={styles.primaryBtn}>
                  View Products
                </a>
              </div>
            </div>

            <div className={styles.heroImageWrapper}>
              <img
                src={OilHero}
                alt="Pyrolysis Oil"
                className={styles.heroImg}
              />

              <div className={styles.experienceBadge}>
                <strong>Industrial</strong>
                <span> Grade Fuel</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TECHNICAL SPECS */}
      <section className={styles.specSection}>
        <div className={styles.container}>

          <div className={styles.sectionHeader}>
            <h2>Technical <span>Specifications</span></h2>
            <p>Consistent quality standards for industrial combustion efficiency.</p>
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

      {/* 3. MARKETPLACE SECTION */}
      <div id="inventory" className={styles.marketplaceWrapper}>
        <div className={styles.container}>

          <div className={styles.gridHeader}>
            <h2>Available <span>Pyrolysis Oil Products</span></h2>
          </div>

          <div className={styles.marketplaceGrid}>

            <div className={styles.productCard}>
              <div className={styles.imageContainer}>
                <img src={OilHero} alt="Pyrolysis Oil" />
              </div>

              <div className={styles.cardContent}>
                <span className={styles.categoryTag}>Industrial Fuel</span>
                <h3>Tyre Derived Pyrolysis Oil (TDO)</h3>

                <p>
                  High-efficiency liquid fuel derived from waste tyres,
                  optimized for industrial burners, cement plants, and thermal systems.
                </p>

                <div className={styles.cardFooter}>
                  <Link to="/our-products" className={styles.quoteBtn}>
                    View More <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 4. FOOTER CTA */}
      <section className={styles.featureSection}>
        <div className={styles.container}>
          <div className={styles.contentSplit}>

            <div className={styles.featureList}>

              <div className={styles.featureItem}>
                <GiOilDrum className={styles.featureIcon} />
                <div>
                  <h4>Bulk Supply Network</h4>
                  <p>Reliable tanker and industrial-scale delivery across regions.</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <GiFactory className={styles.featureIcon} />
                <div>
                  <h4>Consistent Quality</h4>
                  <p>Controlled processing ensures stable combustion performance.</p>
                </div>
              </div>

            </div>

            <div className={styles.ctaBox}>
              <h3>Consult an Expert</h3>
              <p>Get bulk pricing, lab reports, and supply chain details.</p>

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