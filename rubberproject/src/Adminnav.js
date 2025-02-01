import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import logo from "./images/logo.png";
import "./Adminnav.css";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate for redirection

function Adminnav() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);
  const navigate = useNavigate(); // Hook to redirect after logout

  const toggleNavbar = () => {
    setIsNavbarCollapsed(!isNavbarCollapsed);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("admin_token"); // Remove the token from localStorage
    navigate("/admin"); // Redirect to admin page (or any other page you want)
  };

  // Check if user is authenticated (token exists)
  const isAuthenticated = localStorage.getItem("admin_token") !== null;

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
              <img
                style={{ width: "100%" }}
                className="logo"
                src={logo}
                alt="LG Industry Logo"
              />
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
              className={`collapse navbar-collapse ${
                isNavbarCollapsed ? "" : "show"
              }`}
              id="navbarNav"
            >
              <ul className="navbar-nav ms-auto">
                <li className="nav-item mx-2">
                  <Link
                    to="/Admin"
                    className="nav-link nav-hover"
                    onClick={() => setIsNavbarCollapsed(true)}
                  >
                    <b>Scrap Items</b>
                  </Link>
                </li>
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
