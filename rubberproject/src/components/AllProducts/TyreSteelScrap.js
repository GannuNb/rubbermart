import React, { useEffect } from 'react';
import { FiArrowRight, FiStar, FiCheckCircle, FiShield, FiTruck, FiActivity } from 'react-icons/fi';
import { GiAnvilImpact, GiRecycle } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import styles from "../../styles/AllProducts/Tyrescrap.module.css";

// Assets
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
        { label: "Supply Form", value: "Baled / Loose", icon: <FiTruck /> },
    ];

    const products = [
        {
            id: 1,
            name: "Pyro Steel Wire",
            image: SteelHero,
            desc: "High-carbon steel wire recovered from pyrolysis reactors, cleaned and processed for industrial steel applications.",
            badge: "High Carbon"
        },
        {
            id: 2,
            name: "Rubber Crumb Steel Wire",
            image: RubberCrumSteel,
            desc: "Fine steel wire recovered during mechanical shredding and magnetic separation processes.",
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
                            <span className={styles.tag}>Metal Recovery Product Range</span>

                            <h1>
                                Explore Our <span>Tyre Steel Scrap</span>
                            </h1>

                            <p>
                                We supply high-quality recovered steel wire extracted from tyre pyrolysis
                                and mechanical recycling processes. Our steel scrap is processed for
                                high purity, making it ideal for foundries and steel manufacturing industries.
                            </p>

                            <ul className={styles.valueList}>
                                <li>✓ High Purity Steel Wire Recovery</li>
                                <li>✓ Baled & Loose Supply Options</li>
                                <li>✓ Suitable for Foundries & Steel Mills</li>
                            </ul>

                            <div className={styles.heroBtns}>
                                <a href="#marketplace" className={styles.primaryBtn}>
                                    View Products
                                </a>
                            </div>
                        </div>

                        <div className={styles.heroImageWrapper}>
                            <img
                                src={SteelHero}
                                alt="Tyre Steel Scrap"
                                className={styles.heroImg}
                            />

                            <div className={styles.experienceBadge}>
                                <strong>98%+</strong>
                                <span> Purity</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 2. TECHNICAL SPECS */}
            <section className={styles.specSection}>
                <div className={styles.container}>

                    <div className={styles.sectionHeader}>
                        <h2>Material <span>Specifications</span></h2>
                        <p>High-quality secondary steel feedstock for industrial recycling systems.</p>
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

            {/* 3. MARKETPLACE GRID */}
            <div id="marketplace" className={styles.marketplaceWrapper}>
                <div className={styles.container}>

                    <div className={styles.gridHeader}>
                        <h2>Available <span>Steel Scrap Products</span></h2>
                    </div>

                    <div className={styles.marketplaceGrid}>

                        {products.map((product) => (
                            <div key={product.id} className={styles.productCard}>

                                <div className={styles.imageContainer}>
                                    <img src={product.image} alt={product.name} />
                                    <span className={styles.premiumBadge}>
                                        <FiStar /> {product.badge}
                                    </span>
                                </div>

                                <div className={styles.cardContent}>
                                    <span className={styles.categoryTag}>Recycled Steel</span>
                                    <h3>{product.name}</h3>
                                    <p>{product.desc}</p>

                                    <div className={styles.cardFooter}>
                                        <Link to="/our-products" className={styles.quoteBtn}>
                                            View More <FiArrowRight />
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        ))}

                    </div>

                </div>
            </div>

            {/* 4. FOOTER CTA */}
            <section className={styles.featureSection}>
                <div className={styles.container}>
                    <div className={styles.contentSplit}>

                        <div className={styles.featureList}>

                            <div className={styles.featureItem}>
                                <GiAnvilImpact className={styles.featureIcon} />
                                <div>
                                    <h4>Foundry Grade Material</h4>
                                    <p>Processed steel wire suitable for industrial melting and casting applications.</p>
                                </div>
                            </div>

                            <div className={styles.featureItem}>
                                <GiRecycle className={styles.featureIcon} />
                                <div>
                                    <h4>Circular Recovery</h4>
                                    <p>Efficient separation process ensures high recovery rate of reusable steel.</p>
                                </div>
                            </div>

                        </div>

                        <div className={styles.ctaBox}>
                            <h3>Consult an Expert</h3>
                            <p>Get bulk pricing, chemical composition reports, and logistics support.</p>

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