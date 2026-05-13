// src/components/footer/DashboardFooter.js

import React from "react";

import { Link } from "react-router-dom";

import styles from "./DashboardFooter.module.css";

function DashboardFooter() {
  return (
    <footer className={styles.footer}>

      <div className={styles.footerContainer}>

        {/* LEFT */}
        <div className={styles.left}>
          <h3>
            Rubber Scrap Mart
          </h3>

          <p>
            Secure B2B Rubber Marketplace
          </p>
        </div>

        {/* CENTER */}
        <div className={styles.centerLinks}>

          <Link to="/termsandconditions">
            Terms
          </Link>

          <Link to="/privacy-policy">
            Privacy
          </Link>

          <Link to="/contactus">
            Support
          </Link>

        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          © 2026 Rubber Scrap Mart
        </div>

      </div>

    </footer>
  );
}

export default DashboardFooter;