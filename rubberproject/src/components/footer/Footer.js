import React from 'react';
import { 
  FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram, 
  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt 
} from 'react-icons/fa';
import styles from './Footer.module.css';
import logo from '../../assests/Logo.png'; // Update with your actual path

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Brand Column */}
        <div className={styles.brandCol}>
          <img src={logo} alt="Rubber Scrap Mart" className={styles.logo} />
          <p className={styles.brandText}>
            India’s premier B2B marketplace for rubber derived products connecting global supply chain.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialIcon}><FaFacebookF /></a>
            <a href="#" className={styles.socialIcon}><FaLinkedinIn /></a>
            <a href="#" className={styles.socialIcon}><FaTwitter /></a>
            <a href="#" className={styles.socialIcon}><FaInstagram /></a>
          </div>
        </div>

        {/* Links Columns */}
        <div className={styles.linksGrid}>
          <div className={styles.linkGroup}>
            <h3>Marketplace</h3>
            <ul>
              <li><a href="/products">All Products</a></li>
              <li><a href="/categories">Categories</a></li>
              <li><a href="/sellers">Sellers</a></li>
              <li><a href="/buyers">Buyers</a></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h3>Company</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/blogs">Blogs</a></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h3>Support</h3>
            <ul>
              <li><a href="/help">Help center</a></li>
              <li><a href="/faqs">FAQs</a></li>
              <li><a href="/terms">Terms & Conditions</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h3>For Sellers</h3>
            <ul>
              <li><a href="/seller/register">Become a Seller</a></li>
              <li><a href="/seller/dashboard">Seller Dashboard</a></li>
              <li><a href="/seller/products">Products Management</a></li>
              <li><a href="/seller/pricing">Pricing Plans</a></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h3>For Buyers</h3>
            <ul>
              <li><a href="/buyer/dashboard">Buyer Dashboard</a></li>
              <li><a href="/buyer/orders">My Orders</a></li>
              <li><a href="/buyer/track">Track Orders</a></li>
              <li><a href="/products">Explore Products</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>© {currentYear} RUBBERSCRAPMART. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;