import React from "react";
import styles from "../styles/Buyersignup.module.css";

function Buyersignup() {
  return (
    <div className={styles.buyerSignupPage}>
      <div className={styles.buyerSignupCard}>
        <div className={styles.buyerSignupTop}>
          <span className={styles.backLogin}>← Back to login</span>
          <span className={styles.needHelp}>Need any help?</span>
        </div>

        <div className={styles.buyerSignupContent}>
          <h1>Sign Up</h1>
          <p>Create your account to continue</p>

          <form className={styles.buyerSignupForm}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" />
            </div>

            <div className={styles.inputGroup}>
              <label>Email</label>
              <input type="email" placeholder="newuser@gmail.com" />
            </div>

            <div className={styles.inputGroup}>
              <label>Location (optional)</label>
              <input type="text" placeholder="e.g., San Francisco, CA" />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input type="password" placeholder="Password" />
            </div>

            <div className={styles.inputGroup}>
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm Password" />
            </div>

            <button type="submit" className={styles.signupBtn}>
              Sign Up
            </button>

            <div className={styles.divider}>
              <span>OR</span>
            </div>

            <button type="button" className={styles.googleBtn}>
              Sign Up with Google
            </button>

            <p className={styles.loginText}>
              Already have an account? <span>Login here</span>
            </p>

            <button type="button" className={styles.sellerBtn}>
              Sign Up as a Seller
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Buyersignup;