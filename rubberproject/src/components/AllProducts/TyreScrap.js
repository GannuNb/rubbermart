import React, { useState, useEffect } from 'react';
import { FiSearch, FiArrowRight, FiStar, FiCheckCircle, FiShield, FiTruck, FiActivity } from 'react-icons/fi';
import { GiRecycle, GiCircularSaw } from 'react-icons/gi';
import styles from "../../styles/AllProducts/Tyrescrap.module.css";
import { Link } from 'react-router-dom';

// Hero Import
import TyreHero from '../../assests/Tyrescrapbg.png';

// Category Image Imports
import baledtyrespcr from '../../assests/categoryimages/baledtyrespcr.jpg';
import baledtyrestbr from '../../assests/categoryimages/baledtyrestbr.jpg';
import threepiecepcr from '../../assests/categoryimages/threepiecepcr.png';
import threepiecetbr from '../../assests/categoryimages/threepiecetbr.png';
import shreds from '../../assests/categoryimages/shreds.png';
import rubbergranules from '../../assests/categoryimages/RubberGranules2.webp';
import mulch from '../../assests/categoryimages/mulch.png';

const TyreScrap = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const technicalSpecs = [
        { label: "Main Material", value: "End-of-Life Tyres", icon: <FiActivity /> },
        { label: "Purity Level", value: "95% - 99%", icon: <FiCheckCircle /> },
        { label: "Steel Content", value: "Variable (PCR/TBR)", icon: <FiShield /> },
        { label: "Supply Form", icon: <FiTruck />, value: "Bales / Cut / Shreds" },
    ];

    const allProducts = [
        {
            id: 1,
            name: "Baled Tyres PCR",
            category: "Baled",
            image: baledtyrespcr,
            desc: "Passenger Car Radial, high-density baling for export and clean processing."
        },
        {
            id: 2,
            name: "Baled Tyres TBR",
            category: "Baled",
            image: baledtyrestbr,
            desc: "Truck/Bus Radial. Maximum wire and rubber yield for Pyrolysis plants."
        },
        {
            id: 3,
            name: "Three Piece PCR",
            category: "Cut",
            image: threepiecepcr,
            desc: "Car tyres cut into three sections for optimized reactor loading and storage."
        },
        {
            id: 4,
            name: "Three Piece TBR",
            category: "Cut",
            image: threepiecetbr,
            desc: "Heavy-duty truck tyres cut for optimized shipping weight and easy handling."
        },
        {
            id: 5,
            name: "Tyre Shreds",
            category: "Processed",
            image: shreds,
            desc: "TDF-ready shredded rubber pieces optimized for industrial furnace fuel."
        },
        {
            id: 6,
            name: "Rubber Granules/Crumb",
            category: "Processed",
            image: rubbergranules,
            desc: "99.9% pure wire-free crumb rubber granules for manufacturing and tracks."
        },
        {
            id: 7,
            name: "PCR Mulch",
            category: "Processed",
            image: mulch,
            desc: "Safety-grade rubber mulch ideal for landscaping and playground surfaces."
        }
    ];

    const filteredProducts = allProducts.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === "All" || item.category === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className={styles.pageWrapper}>

            {/* HERO SECTION */}
            <section className={styles.heroSection}>
                <div className={styles.container}>
                    <div className={styles.heroGrid}>

                        <div className={styles.heroContent}>
                            <span className={styles.tag}>Tyre Scrap Product Range</span>

                            <h1>
                                Explore Our <span>Tyre Scrap Products</span>
                            </h1>

                            <p>
                                We offer a complete range of high-quality tyre scrap materials including
                                baled tyres, cut sections, shredded rubber, and processed granules.
                                These materials are sourced, processed, and supplied for recycling,
                                energy recovery, and industrial manufacturing applications.
                            </p>

                            <ul className={styles.valueList}>
                                <li>✓ TDF (Tyre Derived Fuel) Grade</li>
                                <li>✓ Whole, Baled, or Shredded Options</li>
                                <li>✓ Real-time Shipment Tracking</li>
                            </ul>

                            <div className={styles.heroBtns}>
                                <a href="#marketplace" className={styles.primaryBtn}>
                                    View Products
                                </a>
                            </div>
                        </div>

                        <div className={styles.heroImageWrapper}>
                            <img
                                src={TyreHero}
                                alt="Tyre Scrap Products"
                                className={styles.heroImg}
                            />

                            <div className={styles.experienceBadge}>
                                <strong>7+</strong>
                                <span> Product Types</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* TECHNICAL SPECIFICATIONS */}
            <section className={styles.specSection}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2>Technical <span>Specifications</span></h2>
                        <p>Industry-leading quality standards for recycling and energy recovery.</p>
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

            {/* MARKETPLACE FILTER */}
            <section id="marketplace" className={styles.topBar}>
                <div className={styles.container}>
                    <div className={styles.searchNav}>
                        <div className={styles.searchBox}>
                            <FiSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search products (TBR, PCR, Shreds)..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className={styles.filterGroup}>
                            {["All", "Baled", "Cut", "Processed"].map((tab) => (
                                <button
                                    key={tab}
                                    className={activeFilter === tab ? styles.activeTab : styles.tab}
                                    onClick={() => setActiveFilter(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* PRODUCT GRID */}
            <div className={styles.marketplaceWrapper}>
                <div className={styles.container}>
                    <div className={styles.gridHeader}>
                        <h2>Available <span>Tyre Scrap Products</span></h2>
                    </div>

                    <div className={styles.marketplaceGrid}>
                        {filteredProducts.map((product) => (
                            <div key={product.id} className={styles.productCard}>
                                <div className={styles.imageContainer}>
                                    <img src={product.image} alt={product.name} />
                                </div>

                                <div className={styles.cardContent}>
                                    <span className={styles.categoryTag}>{product.category}</span>
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

            {/* FOOTER CTA */}
            <section className={styles.featureSection}>
                <div className={styles.container}>
                    <div className={styles.contentSplit}>

                        <div className={styles.featureList}>
                            <div className={styles.featureItem}>
                                <GiCircularSaw className={styles.featureIcon} />
                                <div>
                                    <h4>High Processing Capacity</h4>
                                    <p>Consistent monthly supply to meet large-scale industrial demands.</p>
                                </div>
                            </div>

                            <div className={styles.featureItem}>
                                <GiRecycle className={styles.featureIcon} />
                                <div>
                                    <h4>Sustainable Logistics</h4>
                                    <p>Reliable nationwide shipping and eco-friendly waste management.</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.ctaBox}>
                            <h3>Consult an Expert</h3>
                            <p>Discuss volume pricing and shipping logistics with our team.</p>
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

export default TyreScrap;