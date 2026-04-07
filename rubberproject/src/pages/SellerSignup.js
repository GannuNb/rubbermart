import React, { useState, useEffect } from "react";
import styles from "../styles/Sellersignup.module.css";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineUser } from "react-icons/hi2";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import {
    signupSellerThunk,
    googleSignupSellerThunk,
} from "../redux/slices/authThunk";
import { useNavigate } from "react-router-dom";

function SellerSignup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        sellerSignupLoading,
        sellerSignupError,
        sellerSignupSuccessMessage,
    } = useSelector((state) => state.auth);

    useEffect(() => {
        if (sellerSignupSuccessMessage) {
            navigate("/seller-business-profile");
        }
    }, [sellerSignupSuccessMessage, navigate]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    // ✅ Google Signup
    const handleGoogleSignup = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await fetch(
                    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
                );

                const userData = await response.json();

                dispatch(
                    googleSignupSellerThunk({
                        fullName: userData.name,
                        email: userData.email,
                        profileImage: userData.picture,
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

    // ✅ Submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.password) {
            alert("Please fill all required fields");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        dispatch(signupSellerThunk(formData));

        setFormData({
            fullName: "",
            email: "",
            location: "",
            password: "",
            confirmPassword: "",
        });
    };

    return (
        <div className={styles.sellerSignupPage}>
            <div className={styles.sellerSignupContent}>
                <h1>Sign Up</h1>
                <p>Create your seller account to continue</p>

                <form className={styles.sellerSignupForm} onSubmit={handleSubmit}>

                    {/* Full Name */}
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

                    {/* Location */}
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

                    {/* Confirm Password */}
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

                    {/* Messages */}
                    {sellerSignupSuccessMessage && (
                        <p className={styles.successText}>
                            {sellerSignupSuccessMessage}
                        </p>
                    )}

                    {sellerSignupError && (
                        <p className={styles.errorText}>
                            {sellerSignupError}
                        </p>
                    )}

                    {/* Submit */}
                    <button type="submit" className={styles.signupBtn}>
                        {sellerSignupLoading ? "Signing Up..." : "Sign Up"}
                    </button>

                    {/* Divider */}
                    <div className={styles.divider}>
                        <span>OR</span>
                    </div>

                    {/* Google */}
                    <button
                        type="button"
                        className={styles.googleBtn}
                        onClick={() => handleGoogleSignup()}
                    >
                        <FcGoogle className={styles.googleIcon} />
                        Sign Up with Google
                    </button>

                    {/* Login */}
                    <p className={styles.loginText}>
                        Already have an account? <span>Login here</span>
                    </p>

                    {/* Switch to Buyer */}
                    <button
                        type="button"
                        className={styles.buyerBtn}
                        onClick={() => navigate("/buyer-signup")}
                    >
                        <HiOutlineUser className={styles.buyerIcon} />
                        Sign Up as a Buyer
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SellerSignup;