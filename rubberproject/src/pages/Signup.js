import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import signupstyles from "../styles/Buyersignup.module.css";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { signupThunk, googleSignupThunk } from "../redux/slices/authThunk";
import CustomAlert from "../components/CustomAlert";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { signupLoading, signupError, signupSuccessMessage } = useSelector(
    (state) => state.auth,
  );

  const [role, setRole] = useState("buyer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [alertData, setAlertData] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (signupSuccessMessage) {
      setAlertData({
        show: true,
        type: "success",
        title: "Signup Successful",
        message: signupSuccessMessage,
      });
    }
  }, [signupSuccessMessage]);

  useEffect(() => {
    if (signupError) {
      setAlertData({
        show: true,
        type: "error",
        title: "Signup Failed",
        message: signupError,
      });
    }
  }, [signupError]);

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
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`,
        );

        const userData = await response.json();

        dispatch(
          googleSignupThunk({
            fullName: userData.name,
            email: userData.email,
            profileImage: userData.picture,
            role,
          }),
        );
      } catch (error) {
        setAlertData({
          show: true,
          type: "error",
          title: "Google Signup Failed",
          message: "Something went wrong while signing up with Google.",
        });
      }
    },

    onError: () => {
      setAlertData({
        show: true,
        type: "error",
        title: "Google Signup Failed",
        message: "Unable to continue with Google signup.",
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      setAlertData({
        show: true,
        type: "warning",
        title: "Required Fields",
        message: "Please fill all required fields before continuing.",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlertData({
        show: true,
        type: "error",
        title: "Password Mismatch",
        message: "Password and confirm password do not match.",
      });
      return;
    }

    dispatch(
      signupThunk({
        ...formData,
        role,
      }),
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
              navigate("/business-profile");
            }
          }}
        />
      )}

      <div className={signupstyles.buyerSignupPage}>
        <div className={signupstyles.buyerSignupContent}>
          <h1>Sign Up</h1>
          <p>Create your account to continue</p>

          <form
            className={signupstyles.buyerSignupForm}
            onSubmit={handleSubmit}
          >
            <div className={signupstyles.inputGroup}>
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className={signupstyles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="newuser@gmail.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={signupstyles.inputGroup}>
              <label>Location (optional)</label>
              <input
                type="text"
                name="location"
                placeholder="e.g., Hyderabad, Telangana"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className={signupstyles.inputGroup}>
              <label>Password</label>

              <div className={signupstyles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <span
                  className={signupstyles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>

            <div className={signupstyles.inputGroup}>
              <label>Confirm Password</label>

              <div className={signupstyles.passwordWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

                <span
                  className={signupstyles.eyeIcon}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>

            <button type="submit" className={signupstyles.signupBtn}>
              {signupLoading
                ? role === "seller"
                  ? "Signing Up as Seller..."
                  : "Signing Up..."
                : role === "seller"
                  ? "Sign Up as Seller"
                  : "Sign Up"}
            </button>

            <div className={signupstyles.divider}>
              <span>OR</span>
            </div>

            <button
              type="button"
              className={signupstyles.googleBtn}
              onClick={() => handleGoogleSignup()}
            >
              <FcGoogle className={signupstyles.googleIcon} />
              Sign Up with Google
            </button>

            <p className={signupstyles.loginText}>
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Login here</span>
            </p>

            <button
              type="button"
              className={signupstyles.sellerBtn}
              onClick={() => setRole(role === "buyer" ? "seller" : "buyer")}
            >
              <HiOutlineBuildingStorefront
                className={signupstyles.sellerIcon}
              />
              {role === "buyer" ? "Sign Up as a Seller" : "Continue as Buyer"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
