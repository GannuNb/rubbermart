// src/components/navbar/BuyerProfileMenu.js
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import styles from "../../styles/Navbar/BuyerProfileMenu.module.css";

function BuyerProfileMenu({ user }) {
  const profileRef = useRef();
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
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

        <FaChevronDown className={`${styles.chevron} ${profileOpen ? styles.rotateProfileArrow : ""}`} />
      </button>

      {profileOpen && (
        <div className={styles.profileDropdown}>
          <Link to="/buyer-profile" className={styles.profileDropdownItem} onClick={() => setProfileOpen(false)}>
            View Profile
          </Link>
          <Link to="/buyer-orders" className={styles.profileDropdownItem} onClick={() => setProfileOpen(false)}>
            My Orders
          </Link>
          <Link to="/buyer-guide" className={styles.profileDropdownItem} onClick={() => setProfileOpen(false)}>
            Buyer Guide
          </Link>
        </div>
      )}
    </div>
  );
}

export default BuyerProfileMenu;