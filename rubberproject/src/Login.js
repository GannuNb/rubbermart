import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const json = await response.json();

      if (json.success) {
        localStorage.setItem("userEmail", credentials.email);
        localStorage.setItem("token", json.authToken);

        const profileResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/business-profile`,
          {
            headers: { Authorization: `Bearer ${json.authToken}` },
          }
        );

        const profileData = await profileResponse.json();
        const hasBusinessProfile = profileData.profileExists;

        navigate(hasBusinessProfile ? "/" : "/BusinessProfile");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("An error occurred during login:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="login-page-wrapper">
    <div className="setter">
      <div className="login-page">
        <div className="login-left">
          <h2>Login</h2>
          <p>
            Get access to your Orders, Wishlist and Recommendations.
            Manage your business profile easily and stay connected!
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/906/906343.png"
            alt="Login illustration"
            className="login-illustration"
          />
        </div>

        <div className="login-right">
          <form className="login-form" onSubmit={handleSubmit}>
            <h3 className="form-heading">Welcome Back</h3>

            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={onChange}
                required
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

            {error && <div className="error-text">{error}</div>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Loading..." : "Submit"}
            </button>

            <Link to="/signup" className="btn-secondary">
              New User
            </Link>

            <div className="forgot-link">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}
