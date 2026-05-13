import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaBars, FaTimes } from "react-icons/fa";
import { logoutUser } from "../../redux/slices/authSlice";
import styles from "../../styles/Navbar/RoleNavbar.module.css";
import dashboardStyles from "../../styles/Navbar/NavbarDashboard.module.css";
import GuestNavbar from "./GuestNavbar";
import BuyerNavbar from "./BuyerNavbar";
import SellerNavbar from "./SellerNavbar";
import AdminNavbar from "./AdminNavbar";
import NavbarSearch from "./NavbarSearch";
import BuyerProfileMenu from "./BuyerProfileMenu";
import GuestActions from "./GuestActions";
import UserProfileCard from "./UserProfileCard";
import LogoutButton from "./LogoutButton";
import NavbarContainer from "./NavbarContainer";
import NavbarLogo from "./NavbarLogo";
import useNavbarRole from "../../hooks/useNavbarRole";
import useAutoLogout from "../../hooks/useAutoLogout";

function RoleNavbar() {

  const navigate = useNavigate();

  const location = useLocation();

  const dispatch = useDispatch();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const { user } = useSelector(
    (state) => state.auth
  );

  /* =========================
      AUTO LOGOUT
  ========================== */

  useAutoLogout();

  /* =========================
      ROLE HOOK
  ========================== */

  const {

    isGuest,

    isBuyer,

    isSeller,

    isDashboardUser,

    getLogoPath,

  } = useNavbarRole(user);

  /* =========================
      LOGOUT
  ========================== */

  const handleLogout = () => {

    dispatch(logoutUser());

    navigate("/");
  };

  return (

    <header className={styles.navbarWrapper}>

      {/* =========================
          TOP NAVBAR
      ========================== */}

      <NavbarContainer>

        {/* MOBILE MENU */}

        <button
          className={styles.mobileMenuBtn}
          onClick={() =>
            setMobileMenuOpen(
              !mobileMenuOpen
            )
          }
        >

          {mobileMenuOpen
            ? <FaTimes />
            : <FaBars />
          }

        </button>


        {/* =========================
            LOGO
        ========================== */}

        <NavbarLogo
          logoPath={getLogoPath()}
        />


        {/* =========================
            SEARCH
        ========================== */}

        {(isGuest || isBuyer) && (

          <NavbarSearch />

        )}


        {/* =========================
            DASHBOARD SPACER
        ========================== */}

        {isDashboardUser && (

          <div
            className={
              dashboardStyles.dashboardSpacer
            }
          />

        )}


        {/* =========================
            SELLER / ADMIN NAVBAR
        ========================== */}

        {isDashboardUser && (

          <div
            className={
              dashboardStyles.dashboardNavbarWrapper
            }
          >

            {isSeller ? (

              <SellerNavbar
                location={location}
              />

            ) : (

              <AdminNavbar
                location={location}
              />

            )}

          </div>

        )}


        {/* =========================
            RIGHT SECTION
        ========================== */}

        <div className={styles.rightSection}>


          {/* =========================
              ACTION SECTION
          ========================== */}

          <div className={styles.actionSection}>


            {/* GUEST */}

            {isGuest ? (

              <GuestActions />

            ) : (

              <div
                className={
                  styles.topUserSection
                }
              >

                {/* BUYER */}

                {isBuyer ? (

                  <BuyerProfileMenu
                    user={user}
                  />

                ) : (

                  <UserProfileCard
                    user={user}
                  />

                )}


                {/* LOGOUT */}

                <LogoutButton
                  onLogout={
                    handleLogout
                  }
                />

              </div>
            )}

          </div>

        </div>

      </NavbarContainer>


      {/* =========================
          BOTTOM NAVBAR
      ========================== */}

      {(isGuest || isBuyer) && (

        <div
          className={`${styles.bottomNavbar} ${
            mobileMenuOpen
              ? styles.mobileMenuOpen
              : ""
          }`}
        >

          {isGuest ? (

            <GuestNavbar
              location={location}
            />

          ) : (

            <BuyerNavbar
              location={location}
            />

          )}

        </div>

      )}

    </header>
  );
}

export default RoleNavbar;