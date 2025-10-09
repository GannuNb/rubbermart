import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import styles from "./Sidebar.module.css"; // CSS module import

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !event.target.closest(`.${styles.iconBtnProfile}`)
      ) {
        setSuggestions([]);
        setSelectedCategory("");
        setSearchQuery("");
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
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
        setBusinessProfiles(response.data.businessProfiles);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [location]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let filteredRoutes = { ...routes };
    if (selectedCategory === "tyrescrap") {
      filteredRoutes = {
        mulch: "/MulchPCR",
        shreds: "/shreds",
        "baled tyres pcr": "/BaledTyresPcr",
        "three piece pcr": "/ThreePiecePcr",
        "baled tyres tbr": "/BaledTyresTbr",
        "three piece tbr": "/ThreePieceTbr",
        rubbergranules: "/RubberGranules/Crum",
      };
    } else if (selectedCategory === "tyresteelscrap") {
      filteredRoutes = {
        "rubber crum steel": "/RubberCrumsteel",
        "pyro steel": "/PyroSteel",
      };
    } else if (selectedCategory === "pyrooil") {
      filteredRoutes = {
        "pyro oil": "/PyroOil",
      };
    }

    if (selectedCategory || searchQuery) {
      const filtered = Object.entries(filteredRoutes)
        .filter(([key]) =>
          key.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(([key, route]) => ({ key, route }));
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, selectedCategory]);

  const handleSuggestionClick = (route) => {
    navigate(route);
    setSearchQuery("");
    setSuggestions([]);
    setSelectedCategory("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const checkTokenExpiry = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    checkTokenExpiry();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <header>
      {/* Top Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-light fixed-top shadow-sm py-4"
        style={{
          zIndex: 1030,
          borderBottom: "1px solid #ddd",
          backgroundColor: isMobile ? "#2196f3" : "#fff",
          flexDirection: isMobile ? "column" : "row", // mobile 2-row
          alignItems: isMobile ? "stretch" : "center",
        }}
      >
        <div
          style={{
            width: "100%",
            textAlign: isMobile ? "center" : "center",
            paddingBottom: isMobile ? "0.5rem" : "0",
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "space-between" : "center", // Mobile: space between text & icons
          }}
        >
          <Link
            className="navbar-brand"
            to="/"
            style={{
              paddingRight: !isMobile ? "30%" : "0", // Desktop unchanged
              color: isMobile ? "#fff" : "#000",
              fontWeight: "bold",
              fontSize: "1.2rem",
              paddingLeft: "10%",
            }}
          >
            Rubber scrapmart
          </Link>

          {/* Mobile Icons */}
          {isMobile && (
            <div
              className="d-flex align-items-center gap-2"
              style={{ paddingRight: "10%" }}
            >              <Link to="/Productspage">
                <i className="fas fa-cart-plus text-white"></i>
              </Link>
              <Link to="/Sell">
                <i className="fas fa-dollar-sign text-white"></i>
              </Link>
              {user ? (
                <Link to="/userprofile">
                  <i className="fas fa-user-circle text-white"></i>
                </Link>
              ) : (
                <Link to="/login">
                  <i className="fas fa-user text-white"></i>
                </Link>
              )}
              {user && (
                <button
                  onClick={handleLogout}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              )}
            </div>
          )}
        </div>


        {/* Row 2: Search + Icons */}
        <div
          className="d-flex align-items-center w-100 px-3"
          ref={searchRef}
          style={{ flexDirection: "row" }}
        >
          {/* Category Select */}
          <select
            className="form-select me-2"
            style={{
              width: "30%",
              border: "1.2px solid rgb(33, 89, 172)",
              borderRadius: "50px",
              padding: "0.4rem 0.8rem",
              marginLeft: !isMobile ? "-42%" : "0", // Apply only on desktop
            }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="tyrescrap">Tyre Scrap</option>
            <option value="tyresteelscrap">Tyre Steel Scrap</option>
            <option value="pyrooil">Pyro Oil</option>
          </select>


          {/* Input + Button */}
          <div style={{ position: "relative", width: "70%" }}>
            <input
              type="search"
              className="form-control"
              placeholder="Search Products"
              style={{
                width: "100%",
                border: "1.2px solid rgb(33, 89, 172)",
                borderRadius: "50px",
                padding: "0.45rem 2.5rem 0.45rem 0.75rem",
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              className="btn text-white"
              style={{
                position: "absolute",
                top: "50%",
                right: "5px",
                transform: "translateY(-50%)",
                backgroundColor: "#2159ac",
                borderRadius: "50px",
                width: "35px",
                height: "35px",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                if (suggestions.length > 0)
                  handleSuggestionClick(suggestions[0].route);
              }}
            >
              <i className="fas fa-search"></i>
            </button>

            {suggestions.length > 0 && (
              <ul
                className="suggestions-list position-absolute"
                style={{
                  top: "100%",
                  left: 0,
                  width: "100%",
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  zIndex: 1050,
                  maxHeight: "250px",
                  overflowY: "auto",
                }}
              >
                {suggestions.map((item) => (
                  <li
                    key={item.route}
                    onClick={() => handleSuggestionClick(item.route)}
                    style={{ padding: "8px 12px", cursor: "pointer" }}
                  >
                    {item.key}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Icons */}
          <div className="d-flex align-items-center ms-2">
            {isMobile && (
              <button className="menu-toggle" onClick={toggleSidebar}>
                <i className="fas fa-bars" style={{ color: "#fff" }}></i>
              </button>
            )}

            {!isMobile && (
              <>
                <Link to="/Productspage" className="me-2">
                  <button
                    className={`${styles.iconBtn} ${styles.iconBtnBuy}`}
                    title="Buy"
                  >
                    <i className="fas fa-cart-plus"></i>
                  </button>
                </Link>
                <Link to="/Sell" className="me-2">
                  <button
                    className={`${styles.iconBtn} ${styles.iconBtnSell}`}
                    title="Sell"
                  >
                    <i className="fas fa-dollar-sign"></i>
                  </button>
                </Link>
                {user && (
                  <div className="me-2 position-relative">
                    <button
                      className={`${styles.iconBtn} ${styles.iconBtnProfile}`}
                      title="Profile"
                      onClick={() => navigate("/userprofile")}
                    >
                      <i className="fas fa-user-circle"></i>
                    </button>
                  </div>
                )}
                {!localStorage.getItem("token") ? (
                  <Link to="/login" className="me-2">
                    <button
                      className={`${styles.iconBtn} ${styles.iconBtnLogin}`}
                      title="Login / Signup"
                    >
                      <i className="fas fa-user"></i>
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={handleLogout}
                    className={`${styles.iconBtn} ${styles.iconBtnLogout}`}
                    title="Logout"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Horizontal Sidebar (Desktop) */}
      {!isMobile && (
        <div
          id="sidebarMenu"
          className="shadow-sm d-flex align-items-center justify-content-start px-4"
          style={{
            position: "absolute",
            top: "14%",
            left: 0,
            right: 0,
            height: "60px",
            overflowX: "auto",
            whiteSpace: "nowrap",
            zIndex: 1020,
            borderBottom: "1px solid #ddd",
            backgroundColor: "rgb(33, 150, 243)", // blue color
          }}
        >

          <Link
            to="/"
            className="mx-3 text-white fw-semi text-decoration-none"
          >
            <i className="fas fa-home me-2"></i>Home
          </Link>
          <Link
            to="/AboutUsPage"
            className="mx-3 text-white fw-semi text-decoration-none"
          >
            <i className="fas fa-info-circle me-2"></i>About Us
          </Link>
          <Link
            to="/BusinessProfile"
            className="mx-3 text-white fw-semi text-decoration-none"
          >
            <i className="fas fa-briefcase me-2"></i>Business Profile
          </Link>
          <Link
            to="/Productspage"
            className="mx-3 text-white fw-semi text-decoration-none"
          >
            <i className="fas fa-box-open me-2"></i>Buy
          </Link>
          <Link
            to="/Sell"
            className="mx-3 text-white fw-semi text-decoration-none"
          >
            <i className="fas fa-dollar-sign me-2"></i>Sell
          </Link>
          <Link
            to="/ShippingDetails"
            className="mx-3 text-white fw-semi text-decoration-none"
          >
            <i className="fas fa-shipping-fast me-2"></i>Shippings
          </Link>
          <Link
            to="/Buyreport"
            className="mx-3 text-white fw-semi text-decoration-none"
          >
            <i className="fas fa-file-alt me-2"></i>Buy Reports
          </Link>
          <Link
            to="/Sellerreport"
            className="mx-3 text-white fw-semi text-decoration-none"
          >
            <i className="fas fa-file-alt me-2"></i>Sell Reports
          </Link>
          <Link
            to="/Contact"
            className="mx-3 text-white fw-semi text-decoration-none"
          >
            <i className="fas fa-envelope me-2"></i>Contact
          </Link>
          <Link
            to="/Getorders"
            className="mx-3 text-white fw-semi text-decoration-none"
          >
            <i className="fas fa-shopping-cart me-2"></i>Orders
          </Link>
          <Link
            to="/getpay"
            className="mx-3 text-white fw-semi text-decoration-none"
          >
            <i className="fas fa-wallet me-2"></i>Payments
          </Link>
        </div>
      )}

      {/* Mobile Sidebar Dropdown */}
      {isMobile && sidebarOpen && (
        <>
          <div
            className="mobile-overlay"
            onClick={closeSidebar}
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1040,
            }}
          />
          <div
            id="sidebarMenu"
            className="d-flex flex-column shadow-sm"
            style={{
              position: "absolute",
              top: "56px",
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              zIndex: 1050,
              borderBottom: "1px solid #ddd",
              transition: "max-height 0.4s ease",
            }}
          >
            <Link
              to="/"
              onClick={closeSidebar}
              className="p-3 border-bottom text-dark text-decoration-none"
            >
              <i className="fas fa-home me-2"></i> Home
            </Link>
            <Link
              to="/AboutUsPage"
              onClick={closeSidebar}
              className="p-3 border-bottom text-dark text-decoration-none"
            >
              <i className="fas fa-info-circle me-2"></i> About Us
            </Link>
            <Link
              to="/BusinessProfile"
              onClick={closeSidebar}
              className="p-3 border-bottom text-dark text-decoration-none"
            >
              <i className="fas fa-briefcase me-2"></i> Business Profile
            </Link>
            <Link
              to="/Productspage"
              onClick={closeSidebar}
              className="p-3 border-bottom text-dark text-decoration-none"
            >
              <i className="fas fa-box-open me-2"></i> Buy
            </Link>
            <Link
              to="/Sell"
              onClick={closeSidebar}
              className="p-3 border-bottom text-dark text-decoration-none"
            >
              <i className="fas fa-dollar-sign me-2"></i> Sell
            </Link>
            <Link
              to="/ShippingDetails"
              onClick={closeSidebar}
              className="p-3 border-bottom text-dark text-decoration-none"
            >
              <i className="fas fa-shipping-fast me-2"></i> Shipping
            </Link>
            <Link
              to="/Buyreport"
              onClick={closeSidebar}
              className="p-3 border-bottom text-dark text-decoration-none"
            >
              <i className="fas fa-file-alt me-2"></i> Reports
            </Link>
            <Link
              to="/Contact"
              onClick={closeSidebar}
              className="p-3 border-bottom text-dark text-decoration-none"
            >
              <i className="fas fa-envelope me-2"></i> Contact Us
            </Link>
            <Link
              to="/Getorders"
              onClick={closeSidebar}
              className="p-3 border-bottom text-dark text-decoration-none"
            >
              <i className="fas fa-shopping-cart me-2"></i> Orders
            </Link>
            <Link
              to="/getpay"
              onClick={closeSidebar}
              className="p-3 border-bottom text-dark text-decoration-none"
            >
              <i className="fas fa-wallet me-2"></i> Payment History
            </Link>
          </div>
        </>
      )}
    </header>
  );
}

export default Sidebar;
