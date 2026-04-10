// src/pages/Login.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Buyersignup.module.css";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk, googleLoginThunk } from "../redux/slices/authThunk";
import CustomAlert from "../components/CustomAlert";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loginLoading, loginError, loginSuccessMessage, user } = useSelector(
    (state) => state.auth,
  );

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
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`,
        );

        const userData = await response.json();

        dispatch(
          googleLoginThunk({
            email: userData.email,
          }),
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

    dispatch(
      loginThunk({
        email: formData.email,
        password: formData.password,
      }),
    );
  };

  return (
    <>
      {alertData.show && (
        <CustomAlert
          type={alertData.type}
          title={alertData.title}
          message={alertData.message}
          onClose={() => {
            setAlertData((prev) => ({
              ...prev,
              show: false,
            }));

            if (alertData.type === "success") {
              if (user?.role === "admin") {
                navigate("/admin-dashboard");
              } else if (user?.role === "seller") {
                navigate("/seller-dashboard");
              } else {
                navigate("/");
              }
            }
          }}
        />
      )}

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
              <span onClick={() => navigate("/signup")}>Sign up here</span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
