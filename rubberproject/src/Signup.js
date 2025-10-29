import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Signup.module.css";

export default function Signup() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    geolocation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // ✅ Ripple effect logic
  const handleRipple = (e) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const ripple = document.createElement("span");
    ripple.className = styles["click-ripple"];

    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    wrapper.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (credentials.password !== credentials.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/createuser`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email.toLowerCase(),
          password: credentials.password,
          location: credentials.geolocation,
        }),
      }
    );

    const json = await response.json();
    console.log(json);

    if (json.success) navigate("/login");
    else alert("Please use correct credentials to signup");
  };

  const onChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div
      ref={wrapperRef}
      className={styles["signup-page-wrapper"]}
      onClick={handleRipple} // ✅ Click trigger
    >
      <div className={styles["signup-page"]}>
        {/* Left Info Section */}
        <div className={styles["signup-left"]}>
          <h2>Looks like you're new here!</h2>
          <p>
            Sign up to get started — create your account, manage your business
            profile, and explore exclusive benefits.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
            alt="Signup illustration"
            className={styles["signup-illustration"]}
          />
        </div>

        {/* Right Form Section */}
        <div className={styles["signup-right"]}>
          <form className={styles["signup-form"]} onSubmit={handleSubmit}>
            <h3 className={styles["form-heading"]}>Create Account</h3>

            <div className={styles["form-group"]}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={credentials.name}
                onChange={onChange}
                required
              />
            </div>

            <div className={styles["form-group"]}>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={onChange}
                required
              />
            </div>

            <div className={styles["form-group"]}>
              <label>Location (optional)</label>
              <input
                type="text"
                name="geolocation"
                value={credentials.geolocation}
                onChange={onChange}
              />
            </div>

            <div className={styles["form-group"]}>
              <label>Password</label>
              <div className={styles["input-wrapper"]}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={onChange}
                  required
                />
                <button
                  type="button"
                  className={styles["toggle-btn"]}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "🙉" : "🙈"}
                </button>
              </div>
            </div>

            <div className={styles["form-group"]}>
              <label>Confirm Password</label>
              <div className={styles["input-wrapper"]}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={credentials.confirmPassword}
                  onChange={onChange}
                  required
                />
                <button
                  type="button"
                  className={styles["toggle-btn"]}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "🙉" : "🙈"}
                </button>
              </div>
            </div>

            <button type="submit" className={styles["btn-primary"]}>
              Sign Up
            </button>

            <Link to="/login" className={styles["btn-secondary"]}>
              Already a user? Log In
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
