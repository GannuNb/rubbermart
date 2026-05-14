import React from 'react';
import {
  FiDisc, FiDroplet, FiSettings, FiCheckCircle, FiGlobe,
  FiTruck, FiHeadphones, FiShield, FiZap
} from 'react-icons/fi';
import { GiRecycle, GiCircularSaw, GiOilDrum, GiIBeam } from 'react-icons/gi';
import { MdOutlineScience } from 'react-icons/md';
import styles from "../../styles/AllProducts/AllProducts.module.css";
import ProductCategory from './ProductCategory';
import { Link } from 'react-router-dom';

// Asset Imports
import HeroImg from '../../assests/AllProd.png';
import TyreImg from '../../assests/Tyrescrap.png';
import PyroImg from '../../assests/pyrooil.png';
import SteelImg from '../../assests/Tyresteelscrap.png';

const products = [
  {
    title: "Tyre Scrap",
    icon: FiDisc,
    description: "High-quality tyre scrap for various recycling and industrial applications. Our tyre scrap is processed to meet global quality standards and used in a wide range of industries.",
    image: TyreImg,
    features: [
      { label: "Consistent Quality", desc: "Carefully processed and quality checked", icon: GiCircularSaw },
      { label: "Wide Applications", desc: "Used in multiple industrial and recycling processes", icon: GiRecycle },
      { label: "Reliable Supply", desc: "Available in bulk with on-time delivery", icon: FiShield }
    ],
    buttonText: "Explore Tyre Scrap"
  },
  {
    title: "Pyro Oil",
    icon: FiDroplet,
    description: "Premium quality pyro oil derived from advanced pyrolysis process. Widely used as an alternative fuel in various industrial applications with high energy value.",
    image: PyroImg,
    features: [
      { label: "High Energy Value", desc: "Excellent calorific value and performance", icon: FiZap },
      { label: "Clean & Efficient", desc: "Low impurities and better combustion", icon: FiDroplet },
      { label: "Industrial Grade", desc: "Suitable for various industrial applications", icon: MdOutlineScience }
    ],
    buttonText: "Explore Pyro Oil"
  },
  {
    title: "Tyre Steel Scrap",
    icon: FiSettings,
    description: "Recycled steel scrap obtained from waste tyres. Our steel scrap is cleaned, processed and sorted to ensure high quality for recycling and re-use.",
    image: SteelImg,
    features: [
      { label: "High Purity", desc: "Processed steel with high metal content", icon: GiIBeam },
      { label: "Recyclable", desc: "100% recyclable and environment-friendly", icon: GiRecycle },
      { label: "Cost Effective", desc: "Reliable quality at competitive prices", icon: FiCheckCircle }
    ],
    buttonText: "Explore Tyre Steel Scrap"
  }
];

const AllProducts = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.overline}>ALL PRODUCTS</p>
          <h1>Our <span>Products</span></h1>
          <p className={styles.subtitle}>Explore our wide range of high-quality recycling products designed to deliver maximum value and sustainability.</p>

          <div className={styles.heroBadges}>
            <div className={styles.badgeItem}>
              <div className={styles.badgeIconWrapper}><FiShield /></div>
              <div>
                <strong>High Quality</strong>
                <span>Industry-standard quality assurance</span>
              </div>
            </div>
            <div className={styles.badgeItem}>
              <div className={styles.badgeIconWrapper}><GiRecycle /></div>
              <div>
                <strong>Sustainable</strong>
                <span>Environment-friendly recycling solutions</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img src={HeroImg} alt="Products Overview" />
        </div>
      </section>

      {/* Product List */}
      <section className={styles.productList}>
        <div className={styles.sectionHeader}>
          <h2>Explore Our <span>Product Categories</span></h2>
          <div className={styles.headerUnderline}><span></span></div>
          <p>Select a category to explore our product range in detail.</p>
        </div>

        {products.map((product, index) => (
          <ProductCategory key={index} {...product} />
        ))}
      </section>

      {/* Trust Bar */}
      <div className={styles.trustBar}>
        {[
          { icon: FiShield, title: "Quality Assured", desc: "Strict quality control at every processing stage" },
          { icon: GiRecycle, title: "Eco Friendly", desc: "Sustainable solutions for a greener planet" },
          { icon: FiTruck, title: "Timely Delivery", desc: "On-time logistics and reliable supply chain" },
          { icon: FiHeadphones, title: "Expert Support", desc: "Our experts are here to support your business" }
        ].map((item, i) => (
          <div key={i} className={styles.trustItem}>
            <div className={styles.trustIcon}><item.icon /></div>
            <div><strong>{item.title}</strong><span>{item.desc}</span></div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <section className={styles.ctaBanner}>
        <div className={styles.dotOverlay}></div>
        <div className={styles.ctaLeft}>
          <div className={styles.ctaIconCircle}><FiHeadphones /></div>
          <div className={styles.ctaContent}>
            <h3>Need help finding the right product?</h3>
            <p>Our experts are here to help you choose the best solution for your business.</p>
          </div>
        </div>
        <Link to="/contactus" className={styles.whiteBtn}>
          Talk to an Expert →
        </Link>      </section>
    </div>
  );
};

export default AllProducts;