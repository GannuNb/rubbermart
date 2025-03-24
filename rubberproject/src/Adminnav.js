import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import logo from "./images/logo.png"; // Uncomment this if you want to use the logo
import "./Adminnav.css";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate for redirection
import { jwtDecode } from "jwt-decode";


function Adminnav() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);
  const navigate = useNavigate(); // Hook to redirect after logout

  // Check if the user is authenticated (token exists in localStorage)
  const isAuthenticated = localStorage.getItem("admin_token") !== null;

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("admin_token"); // Remove the token from localStorage
    window.location.reload(); // Reload the page to reset the state
    navigate("/admin"); // Redirect to the admin page (or any other page you want)
  };

  // Automatically logout if the token doesn't exist or if expired
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    
    if (!token) {
      handleLogout(); // If no token, automatically log out
      return;
    }

    // Decode the token to get its expiration
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds

      // If the token is expired, log the user out
      if (decodedToken.exp < currentTime) {
        handleLogout(); // Token has expired, automatically log out
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      handleLogout(); // If there's an error decoding the token, log out
    }
  }, []); // Run this effect only once when the component mounts

  const toggleNavbar = () => {
    setIsNavbarCollapsed(!isNavbarCollapsed);
  };

  return (
    <>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light p-2">
          <div className="container">
            <Link
              className="navbar-brand"
              to="/"
              onClick={() => setIsNavbarCollapsed(true)}
            >
              {/* <img
                style={{ width: "100%" }}
                className="logo"
                src={logo}
                alt="LG Industry Logo"
              /> */}
              <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#000" }}>
                Rubberscrapmart
              </span>
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              onClick={toggleNavbar}
              aria-controls="navbarNav"
              aria-expanded={!isNavbarCollapsed}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className={`collapse navbar-collapse ${isNavbarCollapsed ? "" : "show"}`}
              id="navbarNav"
            >
              <ul className="navbar-nav ms-auto">
                {/* Nav Items */}
                <li className="nav-item mx-2">
                  <Link
                    to="/Adminshipping"
                    className="nav-link nav-hover"
                    onClick={() => setIsNavbarCollapsed(true)}
                  >
                    <b>Orders Shipping</b>
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link
                    className="nav-link nav-hover"
                    to="/Uploaded"
                    onClick={() => setIsNavbarCollapsed(true)}
                  >
                    <b>Uploaded Scrap</b>
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link
                    className="nav-link nav-hover"
                    to="/adminpayment"
                    onClick={() => setIsNavbarCollapsed(true)}
                  >
                    <b>Payments</b>
                  </Link>
                </li>
                {/* Conditional rendering of the Logout button */}
                {isAuthenticated && (
                  <li className="nav-item mx-2">
                    <button
                      className="btn nav-hover"
                      onClick={handleLogout}
                      style={{ backgroundColor: "rgb(26, 122, 245)", color: "white" }} // Example with custom color
                    >
                      Logout
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Adminnav;
