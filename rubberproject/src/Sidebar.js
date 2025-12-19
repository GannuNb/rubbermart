import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import styles from "./Sidebar.module.css";
import logorsm from "./images/rsm_logo.png"
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        Mulch: "/MulchPCR",
        Shreds: "/shreds",
        "Baled tyres pcr": "/BaledTyresPcr",
        "Three piece pcr": "/ThreePiecePcr",
        "Baled tyres tbr": "/BaledTyresTbr",
        "Three piece tbr": "/ThreePieceTbr",
        "Rubbergranules": "/RubberGranules/Crum",
      };
    } else if (selectedCategory === "tyresteelscrap") {
      filteredRoutes = {
        "Rubber crum steel": "/RubberCrumsteel",
        "Pyro steel": "/PyroSteel",
      };
    } else if (selectedCategory === "pyrooil") {
      filteredRoutes = {
        "Pyro oil": "/PyroOil",
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
      if (decoded.exp < currentTime) handleLogout();
    }
  };

  useEffect(() => {
    checkTokenExpiry();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  const isDesktop = window.innerWidth >= 1024;

  return (
    <header>
      {/* Top Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-light fixed-top shadow-sm"
        style={{
          zIndex: 1030,
          borderBottom: "1px solid #ddd",
          backgroundColor: isMobile ? "#ffffffff" : "#fff",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
          gap:"1%"
        }}
      >

        <div
          style={{
            width: "100%",
            textAlign: "center",
            paddingBottom: isMobile ? "0.5rem" : "0",
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "space-between" : "left",
          }}
        >
          <Link to="/">
            <img className={styles.rsmlogo} src={logorsm} alt="Rubber Scrap Mart"/>
          </Link>


          {isMobile && (
<div
  className="d-flex align-items-center gap-2 text-primary"
  style={{ paddingRight: isTablet ? "16rem" : "10%" }}
>
  <Link to="/Productspage">
    <i className="fas fa-cart-plus"></i>
  </Link>

  <Link to="/Sell">
    <i className="fas fa-dollar-sign"></i>
  </Link>

  {user ? (
    <Link to="/userprofile">
      <i className="fas fa-user-circle"></i>
    </Link>
  ) : (
    <Link to="/login">
      <i className="fas fa-user"></i>
    </Link>
  )}

  {user && (
    <button
      onClick={handleLogout}
      style={{
        background: "transparent",
        border: "none",
        color: "#0d6efd", // bootstrap blue
        cursor: "pointer",
      }}
    >
      <i className="fas fa-sign-out-alt"></i>
    </button>
  )}
</div>

          )}
        </div>

        {/* Search + Icons */}
        <div
          className="d-flex align-items-center w-100" // removed px-3
          ref={searchRef}
          style={{
            flexDirection: "row",
            paddingLeft: isTablet ? "16rem" : "1rem", // fallback for non-tablet
            paddingRight: "1rem",
          }}
        >
          <select
            className="form-select me-2"
            style={{
              width: "30%",
              border: "1.2px solid rgb(33, 89, 172)",
              borderRadius: "50px",
              padding: "0.4rem 0.8rem",
              marginLeft: !isMobile ? "-42%" : "0",
            }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="tyrescrap">Tyre Scrap</option>
            <option value="tyresteelscrap">Tyre Steel Scrap</option>
            <option value="pyrooil">Pyro Oil</option>
          </select>

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
              className="btn"
              style={{
                position: "absolute",
                top: "50%",
                right: "5px",
                transform: "translateY(-50%)",
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
              <i className="fas fa-search" style={{ color: "black" }}></i>
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

      {/* Horizontal Sidebar */}
      {isDesktop && (
        <div
          className="horizontal-bar"
          style={{
            marginTop: "100px",
            backgroundColor: "rgb(33, 150, 243)",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "25px",
            height: "60px",
            borderBottom: "1px solid #ddd",
          }}
        >
          {/* Desktop Links */}
          <Link to="/" className="sidebar-link" style={{ color: "#fff" }}>
            <i className="fas fa-home me-2"></i> Home
          </Link>
          <Link to="/AboutUsPage" className="sidebar-link" style={{ color: "#fff" }}>
            <i className="fas fa-info-circle me-2"></i> About Us
          </Link>
          <Link to="/BusinessProfile" className="sidebar-link" style={{ color: "#fff" }}>
            <i className="fas fa-briefcase me-2"></i> Business Profile
          </Link>
          <Link to="/Productspage" className="sidebar-link fw-bold" style={{ color: "rgb(26, 232, 73)" }}>
            <i className="fas fa-box-open me-2"></i> Buy
          </Link>
          <Link to="/Sell" className="sidebar-link fw-bold" style={{ color: "rgb(254, 192, 102)" }}>
            <i className="fas fa-dollar-sign me-2"></i> SELL
          </Link>
          <Link to="/ShippingDetails" className="sidebar-link" style={{ color: "#fff" }}>
            <i className="fas fa-shipping-fast me-2"></i> Shippings
          </Link>
          <Link to="/Buyreport" className="sidebar-link" style={{ color: "#fff" }}>
            <i className="fas fa-file-alt me-2"></i> Buy Reports
          </Link>
          <Link to="/Sellerreport" className="sidebar-link" style={{ color: "#fff" }}>
            <i className="fas fa-file-alt me-2"></i> Sell Reports
          </Link>
          <Link to="/Contact" className="sidebar-link" style={{ color: "#fff" }}>
            <i className="fas fa-envelope me-2"></i> Contact
          </Link>
          <Link to="/Getorders" className="sidebar-link" style={{ color: "#fff" }}>
            <i className="fas fa-shopping-cart me-2"></i> Orders
          </Link>
          <Link to="/getpay" className="sidebar-link" style={{ color: "#fff" }}>
            <i className="fas fa-wallet me-2"></i> Payments
          </Link>
        </div>
      )}

      {/* Tablet Horizontal Bar */}
      {isTablet && (
        <div
          className="horizontal-bar"
          style={{
            marginTop: "17%",
            backgroundColor: "rgb(33, 150, 243)",
            padding: "10px 20px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px 25px",
            borderBottom: "1px solid #ddd",
            color: "#fff",
          }}
        >
          {/* Tablet Links */}
          <Link to="/" style={{ color: "#fff", display: "flex", alignItems: "center" }}>
            <i className="fas fa-home me-2"></i> Home
          </Link>
          <Link to="/AboutUsPage" style={{ color: "#fff", display: "flex", alignItems: "center" }}>
            <i className="fas fa-info-circle me-2"></i> About Us
          </Link>
          <Link to="/BusinessProfile" style={{ color: "#fff", display: "flex", alignItems: "center" }}>
            <i className="fas fa-briefcase me-2"></i> Business Profile
          </Link>
          <Link to="/Productspage" style={{ color: "rgb(26, 232, 73)", display: "flex", alignItems: "center" }}>
            <i className="fas fa-box-open me-2 fw-bold"></i> BUY
          </Link>
          <Link to="/Sell" style={{ color: "rgb(254, 192, 102)", display: "flex", alignItems: "center" }}>
            <i className="fas fa-dollar-sign me-2 fw-bold"></i> SELL
          </Link>
          <Link to="/ShippingDetails" style={{ color: "#fff", display: "flex", alignItems: "center" }}>
            <i className="fas fa-shipping-fast me-2"></i> Shippings
          </Link>
          <Link to="/Buyreport" style={{ color: "#fff", display: "flex", alignItems: "center" }}>
            <i className="fas fa-file-alt me-2"></i> Buy Reports
          </Link>
          <Link to="/Sellerreport" style={{ color: "#fff", display: "flex", alignItems: "center" }}>
            <i className="fas fa-file-alt me-2"></i> Sell Reports
          </Link>
          <Link to="/Contact" style={{ color: "#fff", display: "flex", alignItems: "center" }}>
            <i className="fas fa-envelope me-2"></i> Contact
          </Link>
          <Link to="/Getorders" style={{ color: "#fff", display: "flex", alignItems: "center" }}>
            <i className="fas fa-shopping-cart me-2"></i> Orders
          </Link>
          <Link to="/getpay" style={{ color: "#fff", display: "flex", alignItems: "center" }}>
            <i className="fas fa-wallet me-2"></i> Payments
          </Link>
        </div>
      )}

      {/* Mobile Sidebar */}
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
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 1040,
            }}
          ></div>
          <div
            className="mobile-sidebar"
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "80%",
              height: "100%",
              backgroundColor: "rgb(33, 150, 243)",
              zIndex: 1050,
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <button
              className="btn-close mb-3"
              onClick={closeSidebar}
              style={{ alignSelf: "flex-end" }}
            ></button>
           <Link to="/" style={{ color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
      <i className="fas fa-home"></i> Home
    </Link>

    <Link to="/AboutUsPage" style={{ color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
      <i className="fas fa-info-circle"></i> About Us
    </Link>

    <Link to="/BusinessProfile" style={{ color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
      <i className="fas fa-briefcase"></i> Business Profile
    </Link>

    <Link to="/Productspage" style={{ color: "rgb(26, 232, 73)", display: "flex", alignItems: "center", gap: "6px" }}>
      <i className="fas fa-box-open fw-bold"></i> BUY
    </Link>

    <Link to="/Sell" style={{ color: "rgb(254, 192, 102)", display: "flex", alignItems: "center", gap: "6px" }}>
      <i className="fas fa-dollar-sign fw-bold"></i> SELL
    </Link>

    <Link to="/ShippingDetails" style={{ color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
      <i className="fas fa-shipping-fast"></i> Shippings
    </Link>

    <Link to="/Buyreport" style={{ color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
      <i className="fas fa-file-alt"></i> Buy Reports
    </Link>

    <Link to="/Sellerreport" style={{ color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
      <i className="fas fa-file-alt"></i> Sell Reports
    </Link>

    <Link to="/Contact" style={{ color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
      <i className="fas fa-envelope"></i> Contact
    </Link>

    <Link to="/Getorders" style={{ color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
      <i className="fas fa-shopping-cart"></i> Orders
    </Link>

    <Link to="/getpay" style={{ color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
      <i className="fas fa-wallet"></i> Payments
    </Link>
          </div>
        </>
      )}
    </header>
  );
}

export default Sidebar;
