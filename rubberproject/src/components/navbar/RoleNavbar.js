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
  FaUsers,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

import { logoutUser } from "../../redux/slices/authSlice";
import styles from "../../styles/Components/RoleNavbar.module.css";

function RoleNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // 🔐 Auto logout on token expiry
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

  return (
    <nav className={styles.navbar}>
      {/* LOGO */}
      <div className={styles.logo}>
        <Link
          to={
            user
              ? user.role === "admin"
                ? "/admin-dashboard"
                : user.role === "seller"
                ? "/seller-dashboard"
                : "/home"
              : "/"
          }
        >
          Rubber Scrap Mart
        </Link>
      </div>

      <div className={styles.navLinks}>
        {/* NOT LOGGED IN */}
        {!user ? (
          <>
            <Link
              to="/"
              className={`${styles.normalLink} ${
                location.pathname === "/" ? styles.active : ""
              }`}
            >
              <FaHome />
              <span>Home</span>
            </Link>

            <Link
              to="/about"
              className={`${styles.normalLink} ${
                location.pathname === "/about" ? styles.active : ""
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
        ) : user.role === "admin" ? (
          <>
            <Link
              to="/admin-dashboard"
              className={`${styles.normalLink} ${
                location.pathname === "/admin-dashboard"
                  ? styles.active
                  : ""
              }`}
            >
              <FaTachometerAlt />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/admin-approve-products"
              className={`${styles.normalLink} ${
                location.pathname === "/admin-approve-products"
                  ? styles.active
                  : ""
              }`}
            >
              <FaBoxOpen />
              <span>Approve Products</span>
            </Link>

            <Link
              to="/admin-products"
              className={`${styles.normalLink} ${
                location.pathname === "/admin-products"
                  ? styles.active
                  : ""
              }`}
            >
              <FaBoxOpen />
              <span>Products</span>
            </Link>

            <Link
              to="/admin-users"
              className={`${styles.normalLink} ${
                location.pathname === "/admin-users" ? styles.active : ""
              }`}
            >
              <FaUsers />
              <span>Users</span>
            </Link>

            <button className={styles.logoutBtn} onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </>
        ) : user.role === "seller" ? (
          <>
            <Link
              to="/seller-dashboard"
              className={`${styles.normalLink} ${
                location.pathname === "/seller-dashboard"
                  ? styles.active
                  : ""
              }`}
            >
              <FaTachometerAlt />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/seller-add-products"
              className={`${styles.normalLink} ${
                location.pathname === "/seller-add-products"
                  ? styles.active
                  : ""
              }`}
            >
              <FaBoxOpen />
              <span>Add Products</span>
            </Link>

            <Link
              to="/seller-products"
              className={`${styles.normalLink} ${
                location.pathname === "/seller-products"
                  ? styles.active
                  : ""
              }`}
            >
              <FaBoxOpen />
              <span>Manage Products</span>
            </Link>

            <Link
              to="/seller-profile"
              className={`${styles.normalLink} ${
                location.pathname === "/seller-profile"
                  ? styles.active
                  : ""
              }`}
            >
              <FaUser />
              <span>Profile</span>
            </Link>

            <button className={styles.logoutBtn} onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/home"
              className={`${styles.normalLink} ${
                location.pathname === "/home" ? styles.active : ""
              }`}
            >
              <FaHome />
              <span>Home</span>
            </Link>

            <Link
              to="/about"
              className={`${styles.normalLink} ${
                location.pathname === "/about" ? styles.active : ""
              }`}
            >
              <FaInfoCircle />
              <span>About</span>
            </Link>

            <button className={styles.logoutBtn} onClick={handleLogout}>
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