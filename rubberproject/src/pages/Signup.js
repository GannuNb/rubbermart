import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Buyersignup.module.css";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import {
  signupThunk,
  googleSignupThunk,
} from "../redux/slices/authThunk";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    signupLoading,
    signupError,
    signupSuccessMessage,
  } = useSelector((state) => state.auth);

  const [role, setRole] = useState("buyer");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (signupSuccessMessage) {
      navigate("/business-profile");
    }
  }, [signupSuccessMessage, navigate]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
        );

        const userData = await response.json();

        dispatch(
          googleSignupThunk({
            fullName: userData.name,
            email: userData.email,
            profileImage: userData.picture,
            role,
          })
        );
      } catch (error) {
        console.log("Google Login Error:", error);
      }
    },

    onError: () => {
      console.log("Google Sign Up Failed");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      alert("Please fill all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    dispatch(
      signupThunk({
        ...formData,
        role,
      })
    );

    setFormData({
      fullName: "",
      email: "",
      location: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className={styles.buyerSignupPage}>
      <div className={styles.buyerSignupContent}>
        <h1>Sign Up</h1>
        <p>Create your account to continue</p>

        <form className={styles.buyerSignupForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="newuser@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Location (optional)</label>
            <input
              type="text"
              name="location"
              placeholder="e.g., Hyderabad, Telangana"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>

            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
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

          <div className={styles.inputGroup}>
            <label>Confirm Password</label>

            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <span
                className={styles.eyeIcon}
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          {signupSuccessMessage && (
            <p className={styles.successText}>
              {signupSuccessMessage}
            </p>
          )}

          {signupError && (
            <p className={styles.errorText}>
              {signupError}
            </p>
          )}

          <button type="submit" className={styles.signupBtn}>
            {signupLoading
              ? role === "seller"
                ? "Signing Up as Seller..."
                : "Signing Up..."
              : role === "seller"
              ? "Sign Up as Seller"
              : "Sign Up"}
          </button>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <button
            type="button"
            className={styles.googleBtn}
            onClick={() => handleGoogleSignup()}
          >
            <FcGoogle className={styles.googleIcon} />
            Sign Up with Google
          </button>

          <p className={styles.loginText}>
            Already have an account? <span>Login here</span>
          </p>

          <button
            type="button"
            className={styles.sellerBtn}
            onClick={() =>
              setRole(role === "buyer" ? "seller" : "buyer")
            }
          >
            <HiOutlineBuildingStorefront className={styles.sellerIcon} />
            {role === "buyer"
              ? "Sign Up as a Seller"
              : "Continue as Buyer"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;