import React from 'react';
import {
  FiDisc, FiDroplet, FiSettings, FiCheckCircle, 
  FiTruck, FiHeadphones, FiShield, FiZap, FiArrowRight
} from 'react-icons/fi';
import { GiRecycle, GiCircularSaw, GiIBeam } from 'react-icons/gi';
import { MdOutlineScience } from 'react-icons/md';
import styles from "../../styles/AllProducts/AllProducts.module.css";
import { Link } from 'react-router-dom';

// Asset Imports
import HeroImg from '../../assests/AllProd.png';
import TyreImg from '../../assests/Tyrescrap.png';
import PyroImg from '../../assests/pyrooil.png';
import SteelImg from '../../assests/Tyresteelscrap.png';
import BgImg from '../../assests/bg1.png'; // Imported background asset safely

const products = [
  {
    title: "Tyre Scrap",
    icon: FiDisc,
    description: "High-quality tyre scrap processed carefully to meet rigid global purity standards, optimized for a vast array of sustainable recycling and industrial applications.",
    image: TyreImg,
    features: [
      { label: "Consistent Quality", desc: "Rigorous sorting protocols", icon: GiCircularSaw },
      { label: "Wide Applications", desc: "For asphalt, surfaces, and raw compounds", icon: GiRecycle },
      { label: "Reliable Supply", desc: "B2B wholesale volumes ready for dispatch", icon: FiShield }
    ],
    buttonText: "Explore Tyre Scrap"
  },
  {
    title: "Pyro Oil",
    icon: FiDroplet,
    description: "Premium commercial-grade pyrolysis oil with exceptionally high calorific yield. Crafted as a high-efficiency alternative fuel source for intensive industrial combustion.",
    image: PyroImg,
    features: [
      { label: "High Energy Value", desc: "Excellent thermal output and performance", icon: FiZap },
      { label: "Clean & Efficient", desc: "Low moisture content and low impurities", icon: FiDroplet },
      { label: "Industrial Grade", desc: "Ideal for kilns, boilers, and power stations", icon: MdOutlineScience }
    ],
    buttonText: "Explore Pyro Oil"
  },
  {
    title: "Tyre Steel Scrap",
    icon: FiSettings,
    description: "De-beaded and thoroughly magnetic-separated steel wire scrap recovered cleanly from radial waste tyres, built directly for metal smelting recycling loops.",
    image: SteelImg,
    features: [
      { label: "High Purity", desc: "Extremely low rubber contamination", icon: GiIBeam },
      { label: "100% Recyclable", desc: "Eco-friendly circuit circular economy feed", icon: GiRecycle },
      { label: "Cost Effective", desc: "Premium grade pricing optimized for margins", icon: FiCheckCircle }
    ],
    buttonText: "Explore Tyre Steel Scrap"
  }
];

const AllProducts = () => {
  return (
    // Applied style directly or via CSS module definition below
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        
        {/* Clean Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroGrid}>
            <div className={styles.heroLeft}>
              <span className={styles.tagline}>PREMIUM RECYCLING SOLUTIONS</span>
              <h1 className={styles.heroTitle}>Our <span>Products</span></h1>
              <p className={styles.heroSubtitle}>
                Discover industrial-grade, sustainable materials engineered through state-of-the-art circular resource technology.
              </p>
              <div className={styles.miniBadges}>
                <div className={styles.mBadge}><FiShield className={styles.bIcon}/> Certified Quality</div>
                <div className={styles.mBadge}><GiRecycle className={styles.bIcon}/> 100% Sustainable</div>
              </div>
            </div>
            <div className={styles.heroRight}>
              <div className={styles.heroImgFrame}>
                <img src={HeroImg} alt="Products Distribution" />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Product Listings */}
        <section className={styles.productsSection}>
          <div className={styles.sectionHeader}>
            <h2>Product Categories</h2>
            <p>Select a category to explore specifications and volume ordering channels.</p>
          </div>

          <div className={styles.cardsStack}>
            {products.map((product, index) => {
              const IconComponent = product.icon;
              return (
                <div key={index} className={styles.cleanCard}>
                  <div className={styles.cardImageSide}>
                    <img src={product.image} alt={product.title} className={styles.optimizedImg} />
                    <div className={styles.cardFloatingIcon}><IconComponent /></div>
                  </div>
                  
                  <div className={styles.cardContentSide}>
                    <div className={styles.cardMeta}>
                      <h3>{product.title}</h3>
                      <p className={styles.productDesc}>{product.description}</p>
                    </div>
                    
                    <div className={styles.divider}></div>
                    
                    <div className={styles.featuresGrid}>
                      {product.features.map((feat, fIdx) => {
                        const FeatIcon = feat.icon;
                        return (
                          <div key={fIdx} className={styles.featRow}>
                            <div className={styles.featIconBox}><FeatIcon /></div>
                            <div className={styles.featInfo}>
                              <h4>{feat.label}</h4>
                              <p>{feat.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button className={styles.actionBtn}>
                      {product.buttonText} <FiArrowRight />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Trust Highlights Strip */}
        <section className={styles.trustStrip}>
          {[
            { icon: FiShield, title: "Quality Assured", desc: "Strict verification stages" },
            { icon: GiRecycle, title: "Eco Friendly", desc: "Carbon footprint reduction" },
            { icon: FiTruck, title: "Global Logistics", desc: "Secure bulk delivery channels" },
            { icon: FiHeadphones, title: "Expert Support", desc: "Dedicated corporate managers" }
          ].map((trust, idx) => {
            const TrustIcon = trust.icon;
            return (
              <div key={idx} className={styles.trustCell}>
                <div className={styles.trustIconCell}><TrustIcon /></div>
                <div className={styles.trustTextCell}>
                  <h5>{trust.title}</h5>
                  <p>{trust.desc}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Elegant CTA Banner */}
        <section className={styles.ctaBox}>
          <div className={styles.ctaInner}>
            <div>
              <h3>Need custom technical logistics specifications?</h3>
              <p>Connect immediately with our structural supply chain specialists today.</p>
            </div>
            <Link to="/contactus" className={styles.ctaButton}>
              Talk to an Expert
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AllProducts;