// src/components/footer/BuyerFooter.js

import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaRecycle,
  FaLeaf,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./BuyerFooter.module.css";

function BuyerFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerOverlay}></div>

      <div className={styles.footerContainer}>
        {/* LEFT SECTION */}
        <div className={styles.leftSection}>
          <img
            src="/rsm_logo.png"
            alt="Rubber Scrap Mart"
            className={styles.logo}
          />

          <p className={styles.description}>
            India’s trusted B2B marketplace for rubber scrap, tyre materials,
            pyrolysis products, and sustainable recycling solutions.
          </p>

          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <FaPhoneAlt />
              <span>022-46033434</span>
            </div>

            <div className={styles.contactItem}>
              <FaEnvelope />
              <span>info@rubberscrapmart.com</span>
            </div>

            <div className={styles.contactItem}>
              <FaMapMarkerAlt />
              <span>
                Ground Floor, Office No-52, Plot No-44, Sai Chamber CHS, Wing A,
                Sector 11, Nerul, Navi Mumbai - 400706
              </span>
            </div>
          </div>

          <div className={styles.socialIcons}>
            <a href="/">
              <FaFacebookF />
            </a>
            <a href="/">
              <FaInstagram />
            </a>
            <a href="/">
              <FaLinkedinIn />
            </a>
            <a href="/">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* MARKETPLACE */}
        <div className={styles.footerLinks}>
          <h3>Marketplace</h3>
          <Link to="/tyre-scrap">Tyre Scrap</Link>
          <Link to="/pyro-oil">Pyro Oil</Link>
          <Link to="/tyresteel-scrap">Tyre Steel Scrap</Link>
          <Link to="/our-products">All Products</Link>
        </div>

        {/* COMPANY */}
        <div className={styles.footerLinks}>
          <h3>Company</h3>
          <Link to="/about">About Us</Link>
          <Link to="/contactus">Contact Us</Link>
          <Link to="/termsandconditions">Terms & Conditions</Link>
        </div>

        {/* SUPPORT */}
        <div className={styles.footerLinks}>
          <h3>Support</h3>
          <Link to="/buyer-guide">Buyer Guide</Link>
          <Link to="/seller-guide">Seller Guide</Link>
          <Link to="/contact">FAQs</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>

        {/* RIGHT SECTION */}
        <div className={styles.rightSection}>
          <h3>Why Choose Us?</h3>

          <div className={styles.whyItem}>
            <div className={styles.whyIcon}>
              <FaShieldAlt />
            </div>
            <div>
              <h4>Verified & Trusted</h4>
              <p>Secure transactions with verified buyers & sellers.</p>
            </div>
          </div>

          <div className={styles.whyItem}>
            <div className={styles.whyIcon}>
              <FaRecycle />
            </div>
            <div>
              <h4>Wide Product Range</h4>
              <p>Access multiple rubber scrap and recycled materials.</p>
            </div>
          </div>

          <div className={styles.whyItem}>
            <div className={styles.whyIcon}>
              <FaLeaf />
            </div>
            <div>
              <h4>Sustainable Future</h4>
              <p>Driving circular economy with eco-friendly business.</p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className={styles.bottomBar}>
        <p>© 2026 Rubber Scrap Mart. All rights reserved.</p>

        <div className={styles.bottomLinks}>
          <Link to="/termsandconditions">Terms & Conditions</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}

export default BuyerFooter;