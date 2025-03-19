import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import logo from "./images/logo.png";
import "./Sidebar.css";
import axios from "axios";

import { Dropdown } from "react-bootstrap";
function Sidebar() {
  const navigate = useNavigate();
  const [isGettingStartedOpen, setIsGettingStartedOpen] = useState(false);
  const [isTyreScrapOpen, setIsTyreScrapOpen] = useState(false);
  const [isTyreSteelScrapOpen, setIsTyreSteelScrapOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Get the current route location

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/userdetails`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data.user);
        setBusinessProfiles(response.data.businessProfiles); // Set business profiles
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };

    handleResize(); // Check on initial load
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const routes = {
    mulch: "/MulchPCR",
    shreds: "/shreds",
    "baled tyres pcr": "/BaledTyresPcr",
    "three piece pcr": "/ThreePiecePcr",
    "baled tyres tbr": "/BaledTyresTbr",
    "three piece tbr": "/ThreePieceTbr",
    rubbergranules: "/RubberGranules/Crum",
    crum: "/RubberGranules/Crum",
    "rubber crum steel": "/RubberCrumsteel",
    "pyro steel": "/PyroSteel",
    "pyro oil": "/PyroOil",
  };

  const [isPyroOilOpen, setIsPyroOilOpen] = useState(false);
  const togglePyroOil = () => setIsPyroOilOpen(!isPyroOilOpen);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filteredSuggestions = Object.entries(routes)
        .filter(([key]) => key.toLowerCase().includes(query))
        .map(([key, route]) => ({ key, route }));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (route) => {
    navigate(route);
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload(); // This will refresh the page after navigating to the login page
  };

  const toggleGettingStarted = () => {
    setIsGettingStartedOpen(!isGettingStartedOpen);
  };

  const toggleTyreScrap = () => {
    setIsTyreScrapOpen(!isTyreScrapOpen);
  };

  const toggleTyreSteelScrap = () => {
    setIsTyreSteelScrapOpen(!isTyreSteelScrapOpen);
  };

  const toggleReports = () => {
    setIsReportsOpen(!isReportsOpen);
  };
  const checkTokenExpiry = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      if (decoded.exp < currentTime) {
        handleLogout(); // Logout if token is expired
      }
    }
  };

  useEffect(() => {
    checkTokenExpiry(); // Check token expiry on component mount
  }, []);
  const closeSidebar = () => {
    const sidebarMenu = document.getElementById("sidebarMenu");
    if (sidebarMenu && window.innerWidth < 992) {
      sidebarMenu.classList.remove("show");
    }
  };

  return (
    <header>
      {/* Sidebar Navigation */}
      <nav
        id="sidebarMenu"
        className="collapse d-lg-block sidebar bg-white mt-4"
      >
        <div className="position-sticky">
          {loading ? (
            <div className="p-3 mb-3 bg-light">
              <p className="text-muted">Loading company information...</p>
            </div>
          ) : !localStorage.getItem("token") ? (
            <div className="p-3 mb-3 bg-light">
              <p className="text-muted">
                Please login to view business profile.
              </p>
            </div>
          ) : businessProfiles.length > 0 ? (
            <div className="p-3 mb-3 bg-light">
              <h6 className="text-muted">
                <strong>Company Name:</strong> {businessProfiles[0].companyName}
              </h6>
              <h6 className="text-muted">
                <strong>Company ID:</strong> {businessProfiles[0].profileId}
              </h6>
            </div>
          ) : (
            <div className="p-3 mb-3 bg-light">
              <Link
                to="/BusinessProfile"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <p className="text-muted">Please create a business profile.</p>
              </Link>
            </div>
          )}
          <div className="list-group list-group-flush mx-3 mt-4">
            {/* Home Link */}
            <Link
              to="/"
              className="list-group-item list-group-item-action py-2 ripple"
              aria-current="true"
              onClick={closeSidebar}
            >
              <i className="fas fa-home fa-fw me-3"></i>
              <span>Home</span>
            </Link>

            <Link
              to="/AboutUsPage"
              className="list-group-item list-group-item-action py-2 ripple"
              onClick={closeSidebar}
            >
              <i className="fas fa-info-circle fa-fw me-3"></i>
              <span>About Us</span>
            </Link>

            {/* Business Profile Link */}
            <Link
              to="/BusinessProfile"
              className="list-group-item list-group-item-action py-2 ripple"
              onClick={closeSidebar}
            >
              <i className="fas fa-briefcase fa-fw me-3"></i>
              <span>Business Profile</span>
            </Link>

            {/* Products Section */}
            <div
              className={`list-group-item list-group-item-action py-2 ripple ${
                isGettingStartedOpen ? "active" : ""
              }`}
              onClick={toggleGettingStarted}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center">
                <i className="fas fa-box-open fa-fw me-3"></i>{" "}
                {/* Updated Product Icon */}
                <span>Buy</span>
                <i
                  className={`fas fa-angle-down ms-auto rotate-icon ${
                    isGettingStartedOpen ? "rotate-180" : ""
                  }`}
                ></i>
              </div>
            </div>
            {isGettingStartedOpen && (
              <div className="list-group list-group-flush ">
                {/* Tyre Scrap Section */}
                <div
                  className={`list-group-item list-group-item-action py-2 ripple ${
                    isTyreScrapOpen ? "active" : ""
                  }`}
                  onClick={toggleTyreScrap}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center">
                    <span className="text-primary">Tyre Scrap</span>
                    <i
                      className={`fas fa-angle-down ms-auto rotate-icon ${
                        isTyreScrapOpen ? "rotate-180" : ""
                      } text-primary`}
                    ></i>
                  </div>
                </div>
                {isTyreScrapOpen && (
                  <div className="list-group list-group-flush ">
                    <Link
                      className="list-group-item list-group-item-action py-2 ripple"
                      to="/MulchPCR"
                      onClick={closeSidebar}
                    >
                      Mulch pcr
                    </Link>
                    <Link
                      className="list-group-item list-group-item-action py-2 ripple"
                      to="/BaledTyresPcr"
                      onClick={closeSidebar}
                    >
                      Baled Tyres PCR
                    </Link>

                    <Link
                      className="list-group-item list-group-item-action py-2 ripple"
                      to="/ThreePiecePcr"
                      onClick={closeSidebar}
                    >
                      Three Piece PCR
                    </Link>
                    <Link
                      className="list-group-item list-group-item-action py-2 ripple"
                      to="/BaledTyresTbr"
                      onClick={closeSidebar}
                    >
                      Baled Tyres TBR
                    </Link>
                    <Link
                      className="list-group-item list-group-item-action py-2 ripple"
                      to="/ThreePieceTbr"
                      onClick={closeSidebar}
                    >
                      Three Piece TBR
                    </Link>
                    <Link
                      className="list-group-item list-group-item-action py-2 ripple"
                      to="/RubberGranules/Crum"
                      onClick={closeSidebar}
                    >
                      Rubber Granules/Crum
                    </Link>
                    <Link
                      className="list-group-item list-group-item-action py-2 ripple"
                      to="/shreds"
                      onClick={closeSidebar}
                    >
                      shreds
                    </Link>
                  </div>
                )}

                {/* Pyro Oil Section */}
                <div
                  className={`list-group-item list-group-item-action py-2 ripple ${
                    isPyroOilOpen ? "active" : ""
                  }`}
                  onClick={togglePyroOil}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center">
                    <span className="text-primary">Pyro Oil</span>
                    <i
                      className={`fas fa-angle-down ms-auto rotate-icon ${
                        isPyroOilOpen ? "rotate-180" : ""
                      }text-primary`}
                    ></i>
                  </div>
                </div>
                {isPyroOilOpen && (
                  <div className="list-group list-group-flush">
                    <Link
                      className="list-group-item list-group-item-action py-2 ripple"
                      to="/pyrooil"
                      onClick={closeSidebar}
                    >
                      Pyro oil{" "}
                    </Link>
                  </div>
                )}

                {/* Tyre Steel Scrap Section */}
                <div
                  className={`list-group-item list-group-item-action py-2 ripple ${
                    isTyreSteelScrapOpen ? "active" : ""
                  }`}
                  onClick={toggleTyreSteelScrap}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center">
                    <span className="text-primary">Tyre Steel Scrap</span>
                    <i
                      className={`fas fa-angle-down ms-auto rotate-icon ${
                        isTyreSteelScrapOpen ? "rotate-180" : ""
                      }text-primary`}
                    ></i>
                  </div>
                </div>
                {isTyreSteelScrapOpen && (
                  <div className="list-group list-group-flush ">
                    <Link
                      className="list-group-item list-group-item-action py-2 ripple"
                      to="/RubberCrumsteel"
                      onClick={closeSidebar}
                    >
                      Rubber Crum Steel
                    </Link>
                    <Link
                      className="list-group-item list-group-item-action py-2 ripple"
                      to="/PyroSteel"
                      onClick={closeSidebar}
                    >
                      Pyro Steel
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Sell Link */}
            <Link
              to="/Sell"
              className="list-group-item list-group-item-action py-2 ripple"
              onClick={closeSidebar}
            >
              <i className="fas fa-dollar-sign fa-fw me-3"></i>
              <span>Sell</span>
            </Link>

            {/* Shipping Details */}
            <Link
              to="/ShippingDetails"
              className="list-group-item list-group-item-action py-2 ripple"
              onClick={closeSidebar}
            >
              <i className="fas fa-shipping-fast fa-fw me-3"></i>
              <span>Shipping Details</span>
            </Link>

            {/* Reports Section */}
            <div
              className={`list-group-item list-group-item-action py-2 ripple ${
                isReportsOpen ? "active" : ""
              }`}
              onClick={toggleReports}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center">
                <i className="fas fa-file-alt fa-fw me-3"></i>
                <span>Reports</span>
                <i
                  className={`fas fa-angle-down ms-auto rotate-icon ${
                    isReportsOpen ? "rotate-180" : ""
                  }`}
                ></i>
              </div>
            </div>
            {isReportsOpen && (
              <div className="list-group list-group-flush ">
                <Link
                  className="list-group-item list-group-item-action py-2 ripple"
                  to="/Buyreport"
                  onClick={closeSidebar}
                >
                  Buy Reports
                </Link>
                <Link
                  className="list-group-item list-group-item-action py-2 ripple"
                  to="/Sellerreport"
                  onClick={closeSidebar}
                >
                  Sell Reports
                </Link>
              </div>
            )}

            {/* Contact Us Link */}
            <Link
              to="/Contact"
              className="list-group-item list-group-item-action py-2 ripple"
              onClick={closeSidebar}
            >
              <i className="fas fa-envelope fa-fw me-3"></i>
              <span>Contact Us</span>
            </Link>

            {/* Orders Link */}
            <Link
              to="/Getorders"
              className="list-group-item list-group-item-action py-2 ripple"
              onClick={closeSidebar}
            >
              <i className="fas fa-shopping-cart fa-fw me-3"></i>
              <span>Orders</span>
            </Link>

            <Link
              to="/getpay"
              className="list-group-item list-group-item-action py-2 ripple"
              onClick={closeSidebar}
            >
              <i className="fas fa-wallet fa-fw me-3"></i>
              <span>Payment History</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Top Navbar */}
      <nav
        id="main-navbar"
        className="navbar navbar-expand-lg navbar-light bg-white fixed-top tpheight ftop"
      >
        <div className="container-fluid">
          {/* Sidebar Toggle Button */}
          <button
            className="navbar-toggler threetop"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* <Link className="navbar-brand" to="/">
            <div className="logoset">
              <img src={logo} alt="Logo" />
            </div>
          </Link> */}

          <Link className="navbar-brand mx-1" to="/">
            <div className="logoset ">
              {/* Brand Text instead of Logo */}
              <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#000" }}>
                Rubber <br />
                scrapmart
              </span>
            </div>
          </Link>


          {/* Search Form */}
          <div
            className="position-relative d-inline-block w-100 px-2 px-md-3 dis"
            style={{ width: "100%" }}
          >
            <form
              className="d-flex align-items-center input-group my-auto justify-content-end w-100 dis"
              onSubmit={(e) => e.preventDefault()}
              style={{ width: "100%" }} // Ensure form takes up full width of the parent
            >
              <input
                type="search"
                className="form-control rounded"
                placeholder="Search Products"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                  flexGrow: 1, // Allows the input to take up available space
                  minWidth: "0", // Prevents shrinking
                  width: "100%", // Makes the input 100% of the form width
                  maxWidth: "600px", // Prevents the search input from becoming too large
                  marginRight: "250px", // Creates a small gap between the search bar and the next element (Buy/Sell button)
                }}
              />
            </form>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <ul
                className="list-unstyled position-absolute bg-white border border-secondary rounded"
                style={{
                  top: "calc(100% + 5px)", // Position just below the search bar
                  left: 0,
                  width: "70%",
                  zIndex: 1000,
                }}
              >
                {suggestions.map(({ key, route }) => (
                  <li
                    key={route}
                    className="p-2 border-bottom"
                    onClick={() => handleSuggestionClick(route)}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    {key}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="btstop">
            <Link to="/Productspage">
              <button
                className="bttop"
                style={{ color: "black", fontWeight: 530 }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgb(25, 187, 219)";
                  e.target.style.transform = " rgb(78, 195, 219)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgb(78, 195, 219)";
                  e.target.style.transform = "scale(1)";
                }}
              >
                BUY
              </button>
            </Link>
            <Link to="/Sell">
              <button
                className="bttop"
                style={{ color: "black", fontWeight: 530 }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "navyblue";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#12a0e6";
                  e.target.style.transform = "scale(1)";
                }}
              >
                SELL
              </button>
            </Link>
          </div>

          {/* Social Icons and User Actions */}
          <ul className="navbar-nav ms-auto d-flex flex-row align-items-center dis">
            {/* Social Icons */}
            <li className="nav-item">
              <Link
                className="nav-link me-3 me-lg-0"
                to="https://www.youtube.com/@Rubberscrapmart"
              >
                <i className="fab fa-youtube" style={{ color: "#FF0000" }}></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link me-3 me-lg-0"
                to="https://x.com/Rubberscrapmart"
              >
                <i className="fab fa-twitter" style={{ color: "#1DA1F2" }}></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link me-3 me-lg-0"
                to="https://www.facebook.com/profile.php?id=61574102936310"
              >
                <i className="fab fa-facebook" style={{ color: "#1877F2" }}></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link me-3 me-lg-0"
                to="https://www.instagram.com/rubberscrapmart/ "
              >
                <i
                  className="fab fa-instagram"
                  style={{ color: "#E4405F" }}
                ></i>
              </Link>
            </li>
          </ul>

          <div className="logodis">
            {!localStorage.getItem("token") ? (
              <Link
                to="/login"
                className="btn btn-primary btn-sm px-3 text-nowrap custom-btn"
              >
                {isMobile || window.innerWidth < 768 ? (
                  <i className="fas fa-user-circle custom-icon"></i> // Icon for mobile and small tablets
                ) : (
                  "Login/Signup"
                )}
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="btn btn-outline-success ms-3 logout-button"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span className="logout-text">Logout</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Sidebar;
