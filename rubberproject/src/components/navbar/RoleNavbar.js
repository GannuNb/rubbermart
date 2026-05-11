// src/components/navbar/RoleNavbar.js

import React, { useEffect, useState, useRef } from "react";

import { Link, useNavigate, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { jwtDecode } from "jwt-decode";

import {
  FaBars,
  FaTimes,
  FaSearch,
  FaUserPlus,
  FaSignInAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

import { logoutUser } from "../../redux/slices/authSlice";

import styles from "../../styles/Navbar/RoleNavbar.module.css";

import GuestNavbar from "./GuestNavbar";
import BuyerNavbar from "./BuyerNavbar";
import SellerNavbar from "./SellerNavbar";
import AdminNavbar from "./AdminNavbar";

function RoleNavbar() {
  const navigate = useNavigate();

  const location = useLocation();

  const dispatch = useDispatch();

  const dropdownRef = useRef();

  const profileRef = useRef();

  const searchRef = useRef();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [categoryOpen, setCategoryOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const [searchText, setSearchText] = useState("");

  const { user } = useSelector((state) => state.auth);

  /* =========================
      SEARCH DATA
  ========================== */

  const searchSuggestions = [
    // CATEGORY
    "Tyre Scrap",
    "Pyro Oil",
    "Tyre Steel Scrap",

    // TYRE SCRAP
    "Baled Tyres PCR",
    "Baled Tyres TBR",
    "Three Piece PCR",
    "Three Piece TBR",
    "Shredds",
    "Mulch PCR",
    "Rubber Granules/Crum",

    // PYRO
    "Pyro Steel",

    // STEEL
    "Rubber Crum Steel",
  ];

  /* =========================
      FILTER SUGGESTIONS
  ========================== */

  const filteredSuggestions =
    searchText.trim() === ""
      ? []
      : searchSuggestions.filter((item) =>
          item.toLowerCase().includes(searchText.toLowerCase()),
        );

  /* =========================
      AUTO LOGOUT
  ========================== */

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      const expiryTime = decoded.exp * 1000;

      const currentTime = Date.now();

      const timeLeft = expiryTime - currentTime;

      if (timeLeft <= 0) {
        dispatch(logoutUser());

        navigate("/login");

        return;
      }

      const timer = setTimeout(() => {
        dispatch(logoutUser());

        navigate("/login");
      }, timeLeft);

      return () => clearTimeout(timer);
    } catch (err) {
      dispatch(logoutUser());

      navigate("/login");
    }
  }, [dispatch, navigate]);

  /* =========================
      CLOSE DROPDOWNS
  ========================== */

  useEffect(() => {
    const handleClickOutside = (event) => {
      // CATEGORY
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }

      // PROFILE
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      // SEARCH
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchText("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================
      LOGOUT
  ========================== */

  const handleLogout = () => {
    dispatch(logoutUser());

    navigate("/");
  };

  /* =========================
      SEARCH NAVIGATION
  ========================== */

  const handleSearch = (value) => {
    if (!value.trim()) return;

    navigate(`/our-products?search=${encodeURIComponent(value)}`);

    setSearchText("");
  };

  /* =========================
      LOGO PATH
  ========================== */

  const getLogoPath = () => {
    if (!user) return "/";

    if (user.role === "admin") {
      return "/admin-dashboard";
    }

    if (user.role === "seller") {
      return "/seller-dashboard";
    }

    return "/home";
  };

  /* =========================
      DASHBOARD USER
  ========================== */

  const isDashboardUser =
    user && (user.role === "seller" || user.role === "admin");

  return (
    <header className={styles.navbarWrapper}>
      {/* =========================
          TOP NAVBAR
      ========================== */}

      <div className={styles.topNavbar}>
        {/* MOBILE MENU */}

        <button
          className={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* =========================
            LOGO
        ========================== */}

        <div className={styles.logoSection}>
          <Link to={getLogoPath()} className={styles.logoLink}>
            <img
              src="/rsm_logo.png"
              alt="Rubber Scrap Mart"
              className={styles.logoImage}
            />
          </Link>
        </div>

        {/* =========================
            DASHBOARD NAVBAR
        ========================== */}

        {isDashboardUser && (
          <div className={styles.dashboardNavbarWrapper}>
            {user.role === "seller" ? (
              <SellerNavbar location={location} />
            ) : (
              <AdminNavbar location={location} />
            )}
          </div>
        )}

        {/* =========================
            RIGHT SECTION
        ========================== */}

        <div className={styles.rightSection}>
          {/* =========================
              SEARCH
          ========================== */}

          {(!user || user.role === "buyer") && (
            <div className={styles.searchWrapper}>
              {/* CATEGORY */}

              <div className={styles.categoryWrapper} ref={dropdownRef}>
                <div
                  className={styles.categoryBox}
                  onClick={() => setCategoryOpen(!categoryOpen)}
                >
                  <div className={styles.categoryLeft}>
                    <span className={styles.menuIcon}>☰</span>

                    <span className={styles.categoryText}>All Categories</span>
                  </div>

                  <span
                    className={`${styles.dropdownIcon} ${
                      categoryOpen ? styles.rotateArrow : ""
                    }`}
                  >
                    ❯
                  </span>
                </div>

                {/* CATEGORY DROPDOWN */}

                {categoryOpen && (
                  <div className={styles.categoryDropdown}>
                    <Link to="/our-products" className={styles.dropdownItem}>
                      All Categories
                    </Link>

                    <Link
                      to="/our-products?category=Tyre%20Scrap"
                      className={styles.dropdownItem}
                    >
                      Tyre Scrap
                    </Link>

                    <Link
                      to="/our-products?category=Pyro%20Oil"
                      className={styles.dropdownItem}
                    >
                      Pyro Oil
                    </Link>

                    <Link
                      to="/our-products?category=Tyre%20Steel%20Scrap"
                      className={styles.dropdownItem}
                    >
                      Tyre Steel Scrap
                    </Link>
                  </div>
                )}
              </div>

              {/* =========================
                  SEARCH BOX
              ========================== */}

              <div className={styles.searchSection} ref={searchRef}>
                <div className={styles.searchInputWrapper}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className={styles.searchInput}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch(searchText);
                      }
                    }}
                  />

                  {/* =========================
                      SEARCH SUGGESTIONS
                  ========================== */}

                  {filteredSuggestions.length > 0 && (
                    <div className={styles.searchSuggestions}>
                      {filteredSuggestions.map((item, index) => (
                        <div
                          key={index}
                          className={styles.searchSuggestionItem}
                          onClick={() => handleSearch(item)}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SEARCH BUTTON */}

                <button
                  className={styles.searchBtn}
                  onClick={() => handleSearch(searchText)}
                >
                  <FaSearch />
                </button>
              </div>
            </div>
          )}

          {/* =========================
              RIGHT ACTIONS
          ========================== */}

          <div className={styles.actionSection}>
            {/* GUEST */}

            {!user ? (
              <>
                <Link to="/seller-signup" className={styles.sellerBtn}>
                  <FaUserPlus />
                  Become a Seller
                </Link>

                <Link to="/login" className={styles.loginBtn}>
                  <FaSignInAlt />
                  Login
                </Link>

                <Link to="/signup" className={styles.signupBtn}>
                  <FaUserPlus />
                  Sign Up
                </Link>
              </>
            ) : (
              <div className={styles.topUserSection}>
                {/* PROFILE */}

                <div className={styles.profileWrapper} ref={profileRef}>
                  <button
                    className={styles.profileBtn}
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <div className={styles.userAvatar}>
                      <FaUserCircle />
                    </div>

                    <div className={styles.userInfo}>
                      <h4>Hi, {user?.name?.split(" ")[0]}</h4>

                      <span>{user.role}</span>
                    </div>

                    <FaChevronDown
                      className={`${
                        profileOpen ? styles.rotateProfileArrow : ""
                      }`}
                    />
                  </button>

                  {/* PROFILE DROPDOWN */}

                  {profileOpen && (
                    <div className={styles.profileDropdown}>
                      {/* BUYER */}

                      {user.role === "buyer" && (
                        <>
                          <Link
                            to="/buyer-profile"
                            className={styles.profileDropdownItem}
                          >
                            View Profile
                          </Link>

                          <Link
                            to="/buyer-orders"
                            className={styles.profileDropdownItem}
                          >
                            My Orders
                          </Link>

                          <Link
                            to="/buyer-guide"
                            className={styles.profileDropdownItem}
                          >
                            Buyer Guide
                          </Link>
                        </>
                      )}

                      {/* SELLER */}

                      {user.role === "seller" && (
                        <>
                          <Link
                            to="/seller-profile"
                            className={styles.profileDropdownItem}
                          >
                            Seller Profile
                          </Link>

                          <Link
                            to="/seller-products"
                            className={styles.profileDropdownItem}
                          >
                            My Products
                          </Link>

                          <Link
                            to="/seller-orders"
                            className={styles.profileDropdownItem}
                          >
                            Orders
                          </Link>
                        </>
                      )}

                      {/* ADMIN */}

                      {user.role === "admin" && (
                        <>
                          <Link
                            to="/admin-dashboard"
                            className={styles.profileDropdownItem}
                          >
                            Dashboard
                          </Link>

                          <Link
                            to="/manage-users"
                            className={styles.profileDropdownItem}
                          >
                            Manage Users
                          </Link>

                          <Link
                            to="/manage-products"
                            className={styles.profileDropdownItem}
                          >
                            Manage Products
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* LOGOUT */}

                <button className={styles.topLogoutBtn} onClick={handleLogout}>
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================
          BOTTOM NAVBAR
      ========================== */}

      {(!user || user.role === "buyer") && (
        <div
          className={`${styles.bottomNavbar} ${
            mobileMenuOpen ? styles.mobileMenuOpen : ""
          }`}
        >
          {!user ? (
            <GuestNavbar location={location} />
          ) : (
            <BuyerNavbar location={location} />
          )}
        </div>
      )}
    </header>
  );
}

export default RoleNavbar;
