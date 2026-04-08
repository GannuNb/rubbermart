import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import styles from "../styles/RoleNavbar.module.css";

function RoleNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">Rubber Scrap Mart</Link>
      </div>

      <div className={styles.navLinks}>
        {!user ? (
          <>
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
            <Link to="/seller-dashboard">Dashboard</Link>
            <Link to="/seller-products">Products</Link>
            <Link to="/seller-orders">Orders</Link>
            <Link to="/seller-profile">Profile</Link>

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
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>

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