// src/components/RoleNavbar.js

import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaSignInAlt,
  FaSignOutAlt,
  FaHome,
  FaInfoCircle,
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingBag,
  FaUser,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

import { logoutUser } from "../redux/slices/authSlice";
import styles from "../styles/RoleNavbar.module.css";

function RoleNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

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

      const logoutTimer = setTimeout(() => {
        dispatch(logoutUser());
        navigate("/login");
      }, timeLeft);

      return () => clearTimeout(logoutTimer);
    } catch (error) {
      dispatch(logoutUser());
      navigate("/login");
    }
  }, [dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/common-home");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link
          to={
            user
              ? user.role === "seller"
                ? "/seller-dashboard"
                : "/"
              : "/common-home"
          }
        >
          Rubber Scrap Mart
        </Link>
      </div>

      <div className={styles.navLinks}>
        {!user ? (
          <>
            <Link
              to="/common-home"
              className={`${styles.normalLink} ${
                location.pathname === "/common-home"
                  ? styles.active
                  : ""
              }`}
            >
              <FaHome />
              <span>Home</span>
            </Link>

            <Link
              to="/about"
              className={`${styles.normalLink} ${
                location.pathname === "/about"
                  ? styles.active
                  : ""
              }`}
            >
              <FaInfoCircle />
              <span>About</span>
            </Link>

            <Link to="/signup" className={styles.authBtn}>
              <FaUserPlus />
              <span>Signup</span>
            </Link>

            <Link to="/login" className={styles.authBtn}>
              <FaSignInAlt />
              <span>Login</span>
            </Link>
          </>
        ) : user.role === "seller" ? (
          <>
            <Link
              to="/seller-dashboard"
              className={styles.normalLink}
            >
              <FaTachometerAlt />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/seller-add-products"
              className={styles.normalLink}
            >
              <FaBoxOpen />
              <span> Add Products</span>
            </Link>

            <Link
              to="/seller-products"
              className={styles.normalLink}
            >
              <FaBoxOpen />
              <span> Manage Products</span>
            </Link>

            <Link
              to="/seller-orders"
              className={styles.normalLink}
            >
              <FaShoppingBag />
              <span>Orders</span>
            </Link>

            <Link
              to="/seller-profile"
              className={styles.normalLink}
            >
              <FaUser />
              <span>Profile</span>
            </Link>

            <button
              className={styles.logoutBtn}
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/" className={styles.normalLink}>
              <FaHome />
              <span>Home</span>
            </Link>

            <Link to="/about" className={styles.normalLink}>
              <FaInfoCircle />
              <span>About</span>
            </Link>

            <button
              className={styles.logoutBtn}
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default RoleNavbar;