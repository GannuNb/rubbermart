// src/pages/Login.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Signup/Buyersignup.module.css";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk, googleLoginThunk } from "../redux/slices/authThunk";
import CustomAlert from "../components/alert/CustomAlert";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loginLoading, loginError, loginSuccessMessage, user } =
    useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const [alertData, setAlertData] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ✅ Show success alert
  useEffect(() => {
    if (loginSuccessMessage) {
      setAlertData({
        show: true,
        type: "success",
        title: "Login Successful",
        message: loginSuccessMessage,
      });
    }
  }, [loginSuccessMessage]);

  // ✅ Show error alert
  useEffect(() => {
    if (loginError) {
      setAlertData({
        show: true,
        type: "error",
        title: "Login Failed",
        message: loginError,
      });
    }
  }, [loginError]);

  // ✅ 🔥 MAIN FIX: Navigate when user is set
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "seller") {
        navigate("/seller-dashboard");
      } else {
        navigate("/home"); // buyer
      }
    }
  }, [user, navigate]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Google login
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
        setAlertData({
          show: true,
          type: "error",
          title: "Google Login Failed",
          message: "Something went wrong while logging in with Google.",
        });
      }
    },
    onError: () => {
      setAlertData({
        show: true,
        type: "error",
        title: "Google Login Failed",
        message: "Unable to continue with Google login.",
      });
    },
  });

  // ✅ Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setAlertData({
        show: true,
        type: "warning",
        title: "Required Fields",
        message: "Please fill all required fields before continuing.",
      });
      return;
    }

    dispatch(loginThunk(formData));
  };

  return (
    <>
      {/* ✅ Alert */}
      {alertData.show && (
        <CustomAlert
          type={alertData.type}
          title={alertData.title}
          message={alertData.message}
          onClose={() =>
            setAlertData((prev) => ({
              ...prev,
              show: false,
            }))
          }
        />
      )}

      <div className={styles.buyerSignupPage}>
        <div className={styles.buyerSignupContent}>
          <h1>Login</h1>
          <p>Login to continue to your account</p>

          <form
            className={styles.buyerSignupForm}
            onSubmit={handleSubmit}
          >
            {/* Email */}
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

            {/* Password */}
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

            {/* Submit */}
            <button type="submit" className={styles.signupBtn}>
              {loginLoading ? "Logging In..." : "Login"}
            </button>

            {/* Divider */}
            <div className={styles.divider}>
              <span>OR</span>
            </div>

            {/* Google Login */}
            <button
              type="button"
              className={styles.googleBtn}
              onClick={handleGoogleLogin}
            >
              <FcGoogle className={styles.googleIcon} />
              Login with Google
            </button>

            {/* Signup */}
            <p className={styles.loginText}>
              Don't have an account?{" "}
              <span onClick={() => navigate("/signup")}>
                Sign up here
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;