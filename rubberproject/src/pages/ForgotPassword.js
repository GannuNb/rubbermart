import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { FiMail } from "react-icons/fi";

import styles from "../styles/Auth/ResetPassword.module.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  /* =========================
      HANDLE SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter email");

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        alert("Password reset link sent successfully. Kindly check your email and reset your password.");

        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.resetPage}>
      <div className={styles.resetCard}>
        <div className={styles.resetGlow}></div>

        {/* ICON */}
        <div className={styles.logoBadge}>
          <FiMail />
        </div>

        {/* TITLE */}
        <h1 className={styles.title}>Forgot Password</h1>

        <p className={styles.subtitle}>
          Enter your registered email address and we’ll send you a password
          reset link.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.resetBtn} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* BOTTOM */}
        <div className={styles.bottomText}>
          Remember password?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
