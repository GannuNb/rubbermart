// src/components/navbar/RoleNavbar.js
// FINAL corrected version (important fix: pass location prop)

import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

import { logoutUser } from "../../redux/slices/authSlice";
import styles from "../../styles/Components/RoleNavbar.module.css";

import GuestNavbar from "./GuestNavbar";
import BuyerNavbar from "./BuyerNavbar";
import SellerNavbar from "./SellerNavbar";
import AdminNavbar from "./AdminNavbar";

function RoleNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // Auto logout on token expiry
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

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const getLogoPath = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin-dashboard";
    if (user.role === "seller") return "/seller-dashboard";
    return "/home";
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to={getLogoPath()}>
          Rubber Scrap Mart
        </Link>
      </div>

      <div className={styles.navLinks}>
        {!user ? (
          <GuestNavbar />
        ) : user.role === "admin" ? (
          <AdminNavbar
            handleLogout={handleLogout}
            location={location}
          />
        ) : user.role === "seller" ? (
          <SellerNavbar
            handleLogout={handleLogout}
            location={location}
          />
        ) : (
          <BuyerNavbar
            handleLogout={handleLogout}
            location={location}
          />
        )}
      </div>
    </nav>
  );
}

export default RoleNavbar;