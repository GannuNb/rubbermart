import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    geolocation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

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

    if (json.success) {
      navigate("/login");
    } else {
      alert("Please use correct credentials to signup");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="setter">
    <div className="signup-page">
      {/* Left Info Section */}
      <div className="signup-left">
        <h2>Looks like you're new here!</h2>
        <p>
          Sign up to get started — create your account, manage your business
          profile, and explore exclusive benefits.
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
          alt="Signup illustration"
          className="signup-illustration"
        />
      </div>

      {/* Right Form Section */}
      <div className="signup-right">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h3 className="form-heading">Create Account</h3>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={credentials.name}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location (optional)</label>
            <input
              type="text"
              name="geolocation"
              value={credentials.geolocation}
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={credentials.password}
                onChange={onChange}
                required
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "🙉" : "🙈"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={credentials.confirmPassword}
                onChange={onChange}
                required
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "🙉" : "🙈"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Sign Up
          </button>

          <Link to="/login" className="btn-secondary">
            Already a user? Log In
          </Link>
        </form>
      </div>
    </div>
    </div>
  );
}
