import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { logoutUser } from "../../redux/slices/authSlice";

import styles from "../../styles/Navbar/RoleNavbar.module.css";

// Sub-components
import GuestNavbar from "./GuestNavbar";
import BuyerNavbar from "./BuyerNavbar";
import SellerNavbar from "./SellerNavbar";
import AdminNavbar from "./AdminNavbar";
import NavbarSearch from "./NavbarSearch";
import BuyerProfileMenu from "./BuyerProfileMenu";
import GuestActions from "./GuestActions";
import UserProfileCard from "./UserProfileCard";
import LogoutButton from "./LogoutButton";
import NavbarLogo from "./NavbarLogo";

import useNavbarRole from "../../hooks/useNavbarRole";
import useAutoLogout from "../../hooks/useAutoLogout";

function RoleNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useAutoLogout();
  const { isGuest, isBuyer, isSeller, isDashboardUser, getLogoPath } = useNavbarRole(user);

  // Auto-close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <header className={styles.navbarWrapper}>
      {/* --- TOP BAR (Logo, Search, Profile) --- */}
      <div className={styles.topNavbar}>
        <div className={styles.navInner}>
          <div className={styles.headerMainRow}>
            
            {/* LEFT: Mobile Toggle + Logo */}
            <div className={styles.leftSection}>
              <button 
                className={styles.mobileMenuBtn} 
                onClick={() => setMobileMenuOpen(true)}
              >
                <FaBars />
              </button>
              <NavbarLogo logoPath={getLogoPath()} />
            </div>

            {/* MIDDLE: Laptop Search (Hidden on Mobile) */}
            {(isGuest || isBuyer) && (
              <div className={styles.desktopSearchBox}>
                <NavbarSearch />
              </div>
            )}

            {/* RIGHT: User Context & Actions */}
            <div className={styles.rightSection}>
              {/* Dashboard links for Admin/Seller on Desktop */}
              <div className={styles.desktopDashboardLinks}>
                {isSeller && <SellerNavbar location={location} />}
                {user?.role === 'admin' && <AdminNavbar location={location} />}
              </div>

              {!isGuest ? (
                <div className={styles.userActionsGroup}>
                  {/* Separate Greeting Pill */}
                  <div className={styles.userGreetingPill}>
                    <FaUserCircle className={styles.userIcon} />
                    <span className={styles.greetingText}>
                      Hi, {
                        user?.role === 'admin' ? 'Admin' : 
                        user?.role === 'seller' ? 'Seller' : 
                        user?.role === 'buyer' ? 'Buyer' : 
                        user?.name?.split(' ')[0]
                      }
                    </span>
                  </div>
                  {/* Separate Logout Button for Laptops */}
                  <div className={styles.desktopLogoutContainer}>
                    <LogoutButton onLogout={handleLogout} />
                  </div>
                </div>
              ) : (
                <div className={styles.desktopGuestActions}>
                  <GuestActions />
                </div>
              )}
            </div>
          </div>

          {/* MOBILE ONLY: Search Bar Row 2 */}
          {(isGuest || isBuyer) && !mobileMenuOpen && (
            <div className={styles.mobileSearchRow}>
              <NavbarSearch />
            </div>
          )}
        </div>
      </div>

      {/* --- BOTTOM NAV: Navigation Links (Laptops Only) --- */}
      {(isGuest || isBuyer) && (
        <nav className={styles.bottomNavbarDesktop}>
          <div className={styles.bottomInner}>
            {isGuest ? <GuestNavbar location={location} /> : <BuyerNavbar location={location} />}
          </div>
        </nav>
      )}

      {/* --- MOBILE FULLSCREEN OVERLAY --- */}
      <div className={`${styles.mobileOverlay} ${mobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
        <div className={styles.overlayHeader}>
          <button className={styles.closeBtn} onClick={() => setMobileMenuOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.mobileMenuContent}>
          {/* Mobile Profile Display */}
          {!isGuest && (
            <div className={styles.mobileProfileCard}>
               {isBuyer ? <BuyerProfileMenu user={user} /> : <UserProfileCard user={user} />}
            </div>
          )}

          {/* Mobile Vertical Navigation */}
          <nav className={styles.mobileVerticalNav}>
            {isDashboardUser ? (
              isSeller ? <SellerNavbar location={location} /> : <AdminNavbar location={location} />
            ) : (
              isGuest ? <GuestNavbar location={location} /> : <BuyerNavbar location={location} />
            )}
          </nav>

          {/* Mobile Action Footer */}
          <div className={styles.mobileActionFooter}>
            {isGuest ? <GuestActions /> : <LogoutButton onLogout={handleLogout} />}
          </div>
        </div>
      </div>
    </header>
  );
}

export default RoleNavbar;