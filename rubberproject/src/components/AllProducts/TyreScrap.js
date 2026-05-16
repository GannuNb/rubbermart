import React, { useState, useEffect } from 'react';
import { FiSearch, FiArrowRight, FiStar, FiCheckCircle, FiShield, FiTruck, FiActivity } from 'react-icons/fi';
import { GiRecycle, GiCircularSaw } from 'react-icons/gi';
import styles from "../../styles/AllProducts/Tyrescrap.module.css";
import { Link } from 'react-router-dom';

// Hero Import
import TyreHero from '../../assests/Tyrescrapbg.png';

// Category Image Imports from src/assests/categoryimages/
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
            featured: false, 
            desc: "Passenger Car Radial, high-density baling for export and clean processing." 
        },
        { 
            id: 2, 
            name: "Baled Tyres TBR", 
            category: "Baled", 
            image: baledtyrestbr, 
            featured: true, 
            desc: "Truck/Bus Radial. Maximum wire and rubber yield for Pyrolysis plants." 
        },
        { 
            id: 3, 
            name: "Three Piece PCR", 
            category: "Cut", 
            image: threepiecepcr, 
            featured: false, 
            desc: "Car tyres cut into three sections for optimized reactor loading and storage." 
        },
        { 
            id: 4, 
            name: "Three Piece TBR", 
            category: "Cut", 
            image: threepiecetbr, 
            featured: true, 
            desc: "Heavy-duty truck tyres cut for optimized shipping weight and easy handling." 
        },
        { 
            id: 5, 
            name: "Tyre Shreds", 
            category: "Processed", 
            image: shreds, 
            featured: false, 
            desc: "TDF-ready shredded rubber pieces optimized for industrial furnace fuel." 
        },
        { 
            id: 6, 
            name: "Rubber Granules", 
            category: "Processed", 
            image: rubbergranules, 
            featured: true, 
            desc: "99.9% pure wire-free crumb rubber granules for manufacturing and tracks." 
        },
        { 
            id: 7, 
            name: "Mulch PCR", 
            category: "Processed", 
            image: mulch, 
            featured: false, 
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
            {/* 1. HERO SECTION */}
            <section className={styles.heroSection}>
                <div className={styles.container}>
                    <div className={styles.heroGrid}>
                        <div className={styles.heroContent}>
                            <span className={styles.tag}>Raw Material Excellence</span>
                            <h1>Premium <span>Tyre Scrap</span> Solutions</h1>

                            <p>
                                Powering the future of alternative fuels and recycled manufacturing.
                                Access a global network of high-quality waste tyre products tailored
                                to your specific industrial requirements.
                            </p>

                            <ul className={styles.valueList}>
                                <li>✓ TDF (Tyre Derived Fuel) Grade</li>
                                <li>✓ Whole, Baled, or Shredded Options</li>
                                <li>✓ Real-time Shipment Tracking</li>
                            </ul>

                            <div className={styles.heroBtns}>
                                <a href="#marketplace" className={styles.primaryBtn}>Explore Marketplace</a>
                            </div>
                        </div>
                        <div className={styles.heroImageWrapper}>
                            <img src={TyreHero} alt="Tyre Scrap Processing" className={styles.heroImg} />
                            <div className={styles.experienceBadge}>
                                <strong>10+</strong>
                                <span> Years Quality</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. TECHNICAL BENTO GRID */}
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

            {/* 3. MARKETPLACE FILTER BAR */}
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

            {/* 4. MARKETPLACE GRID */}
            <div className={styles.marketplaceWrapper}>
                <div className={styles.container}>
                    <div className={styles.gridHeader}>
                        <h2>Showing {filteredProducts.length} <span>Inventory Results</span></h2>
                    </div>
                    <div className={styles.marketplaceGrid}>
                        {filteredProducts.map((product) => (
                            <div key={product.id} className={`${styles.productCard} ${product.featured ? styles.featured : ''}`}>
                                <div className={styles.imageContainer}>
                                    <img src={product.image} alt={product.name} />
                                    {product.featured && <span className={styles.premiumBadge}><FiStar /> Featured</span>}
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

            {/* 5. FOOTER CTA */}
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
                                    <p>Certified global shipping and eco-friendly waste management.</p>
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