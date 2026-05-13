import React, { useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";

import styles from "../styles/Auth/ResetPassword.module.css";

function ResetPassword() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  /* =========================
      HANDLE CHANGE
  ========================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
      HANDLE SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      alert("Please fill all fields");

      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/reset-password/${token}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            password: formData.password,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        alert("Password reset successful");

        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Failed to reset password");
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
          <FiLock />
        </div>

        {/* TITLE */}
        <h1 className={styles.title}>Reset Password</h1>

        <p className={styles.subtitle}>
          Create a strong new password to secure your account and continue
          accessing Rubber Scrap Mart safely.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* PASSWORD */}
          <div className={styles.formGroup}>
            <label>New Password</label>

            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
              />

              <span
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          {/* CONFIRM */}
          <div className={styles.formGroup}>
            <label>Confirm Password</label>

            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* BUTTON */}
          <button type="submit" className={styles.resetBtn} disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        {/* BOTTOM */}
        <div className={styles.bottomText}>
          Remembered your password?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
