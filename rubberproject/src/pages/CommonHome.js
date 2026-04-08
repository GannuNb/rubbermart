import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/CommonHome.module.css";

function CommonHome() {
  const navigate = useNavigate();

  return (
    <div className={styles.commonHomePage}>
      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <p className={styles.tag}>Rubber Scrap Mart</p>

        <h1>
          Buy and Sell Rubber Scrap Products Easily
        </h1>

        <p className={styles.description}>
          Join Rubber Scrap Mart to connect with buyers and sellers for tyres,
          shreds, granules, pyro oil, steel scrap and many more products.
        </p>

        <div className={styles.buttonGroup}>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>

          <button
            className={styles.secondaryBtn}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommonHome;