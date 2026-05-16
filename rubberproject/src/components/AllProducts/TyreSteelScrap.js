import React, { useEffect } from 'react';
import { FiArrowRight, FiStar, FiCheckCircle, FiShield, FiTruck, FiActivity } from 'react-icons/fi';
import { GiAnvilImpact, GiRecycle } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import styles from "../../styles/AllProducts/Tyrescrap.module.css";

// Asset Imports
import SteelHero from '../../assests/categoryimages/pyrosteel.jpg';
import RubberCrumSteel from '../../assests/categoryimages/RubberCrumSteel1.jpg';

const TyreSteelScrap = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const technicalSpecs = [
        { label: "Carbon Content", value: "High Tensile", icon: <FiActivity /> },
        { label: "Contamination", value: "< 2% Rubber", icon: <FiCheckCircle /> },
        { label: "Standard", value: "ISRI 201-206", icon: <FiShield /> },
        { label: "Density", value: "Baled / Loose", icon: <FiTruck /> },
    ];

    const products = [
        {
            id: 1,
            name: "Pyro Steel",
            image: SteelHero, // Uses pyrosteel.jpg
            desc: "High-carbon steel wire recovered from pyrolysis reactors, cleaned of carbon black residue and industrial impurities.",
            featured: true,
            badge: "High Carbon"
        },
        {
            id: 2,
            name: "Rubber Crum Steel",
            image: RubberCrumSteel, // Uses RubberCrumSteel1.jpg
            desc: "Thin gauge high-tensile wire extracted during mechanical shredding and secondary magnetic separation processes.",
            featured: false,
            badge: "98% Pure"
        }
    ];

    return (
        <div className={styles.pageWrapper}>
            {/* 1. HERO SECTION */}
            <section className={styles.heroSection}>
                <div className={styles.container}>
                    <div className={styles.heroGrid}>
                        <div className={styles.heroContent}>
                            <span className={styles.tag}>Metallic Recovery</span>
                            <h1>Premium <span>Tyre Steel</span> Scrap</h1>

                            <p>
                                Sourced from high-tensile bead wires and tire cord, our steel scrap is
                                meticulously processed to ensure ultra-low rubber contamination,
                                making it a superior feedstock for global steel mills.
                            </p>

                            <ul className={styles.valueList}>
                                <li>✓ High Purity (Low Rubber/Textile Content)</li>
                                <li>✓ Compressed Bales or Loose Supply Options</li>
                                <li>✓ Ideal for Foundries & Secondary Smelting</li>
                            </ul>

                            <div className={styles.heroBtns}>
                                <a href="#marketplace" className={styles.primaryBtn}>Explore Inventory</a>
                            </div>
                        </div>
                        <div className={styles.heroImageWrapper}>
                            <img src={SteelHero} alt="Tyre Steel Scrap" className={styles.heroImg} />
                            <div className={styles.experienceBadge}>
                                <strong>Clean</strong>
                                <span> Recovery</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. TECHNICAL SPECS BENTO */}
            <section className={styles.specSection}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2>Material <span>Properties</span></h2>
                        <p>High-quality secondary raw materials for global steel industries.</p>
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

            {/* 3. CENTERED MARKETPLACE GRID */}
            <div id="marketplace" className={styles.marketplaceWrapper}>
                <div className={styles.container}>
                    <div className={styles.gridHeader} style={{ textAlign: 'center' }}>
                        <h2>Recycled <span>Steel Inventory</span></h2>
                    </div>
                    <div className={styles.marketplaceGrid}>
                        {products.map((product) => (
                            <div key={product.id} className={`${styles.productCard} ${product.featured ? styles.featured : ''}`}>
                                <div className={styles.imageContainer}>
                                    <img src={product.image} alt={product.name} />
                                    <span className={styles.premiumBadge}>
                                        <FiStar /> {product.badge}
                                    </span>
                                </div>
                                <div className={styles.cardContent}>
                                    <span className={styles.categoryTag}>Secondary Metal</span>
                                    <h3>{product.name}</h3>
                                    <p>{product.desc}</p>
                                    <div className={styles.cardFooter}>
                                        <Link to="/contactus" className={styles.quoteBtn}>
                                            Get Quote <FiArrowRight />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. FOOTER FEATURES & CTA */}
            <section className={styles.featureSection}>
                <div className={styles.container}>
                    <div className={styles.contentSplit}>
                        <div className={styles.featureList}>
                            <div className={styles.featureItem}>
                                <GiAnvilImpact className={styles.featureIcon} />
                                <div>
                                    <h4>Foundry Ready</h4>
                                    <p>Baled to standard sizes suitable for electric arc furnaces and high-volume foundries.</p>
                                </div>
                            </div>
                            <div className={styles.featureItem}>
                                <GiRecycle className={styles.featureIcon} />
                                <div>
                                    <h4>Circular Economy</h4>
                                    <p>Advanced magnetic separation ensures 98%+ purity from rubber and fabric contaminants.</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.ctaBox}>
                            <h3>Consult an Expert</h3>
                            <p>We offer customized baling and logistics solutions for global foundry partners.</p>
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

export default TyreSteelScrap;