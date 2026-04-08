// src/pages/Login.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Buyersignup.module.css";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import {
  loginThunk,
  googleLoginThunk,
} from "../redux/slices/authThunk";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loginLoading,
    loginError,
    loginSuccessMessage,
    user,
  } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (loginSuccessMessage) {
      if (user?.role === "seller") {
        navigate("/seller-dashboard");
      } else {
        navigate("/");
      }
    }
  }, [loginSuccessMessage, user, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
        );

        const userData = await response.json();

        dispatch(
          googleLoginThunk({
            email: userData.email,
          })
        );
      } catch (error) {
        console.log("Google Login Error:", error);
      }
    },

    onError: () => {
      console.log("Google Login Failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill all required fields");
      return;
    }

    dispatch(
      loginThunk({
        email: formData.email,
        password: formData.password,
      })
    );
  };

  return (
    <div className={styles.buyerSignupPage}>
      <div className={styles.buyerSignupContent}>
        <h1>Login</h1>
        <p>Login to continue to your account</p>

        <form className={styles.buyerSignupForm} onSubmit={handleSubmit}>
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

          {loginSuccessMessage && (
            <p className={styles.successText}>
              {loginSuccessMessage}
            </p>
          )}

          {loginError && (
            <p className={styles.errorText}>
              {loginError}
            </p>
          )}

          <button type="submit" className={styles.signupBtn}>
            {loginLoading ? "Logging In..." : "Login"}
          </button>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <button
            type="button"
            className={styles.googleBtn}
            onClick={() => handleGoogleLogin()}
          >
            <FcGoogle className={styles.googleIcon} />
            Login with Google
          </button>

          <p className={styles.loginText}>
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}>
              Sign up here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;