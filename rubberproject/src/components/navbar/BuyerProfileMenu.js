import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";

import styles from "../../styles/Navbar/RoleNavbar.module.css";

function BuyerProfileMenu({
  user,
}) {

  const profileRef = useRef();

  const [profileOpen, setProfileOpen] =
    useState(false);


  /* =========================
      CLOSE DROPDOWN
  ========================== */

  useEffect(() => {

    const handleClickOutside = (
      event
    ) => {

      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
      ) {

        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);


  return (

    <div
      className={
        styles.profileWrapper
      }
      ref={profileRef}
    >

      <button
        className={
          styles.profileBtn
        }
        onClick={() =>
          setProfileOpen(
            !profileOpen
          )
        }
      >

        <div
          className={
            styles.userAvatar
          }
        >
          <FaUserCircle />
        </div>

        <div
          className={
            styles.userInfo
          }
        >

          <h4>
            Hi,{" "}
            {
              user?.name?.split(
                " "
              )[0]
            }
          </h4>

          <span>
            {user.role}
          </span>

        </div>

        <FaChevronDown
          className={`${
            profileOpen
              ? styles.rotateProfileArrow
              : ""
          }`}
        />

      </button>


      {/* DROPDOWN */}

      {profileOpen && (

        <div
          className={
            styles.profileDropdown
          }
        >

          <Link
            to="/buyer-profile"
            className={
              styles.profileDropdownItem
            }
          >
            View Profile
          </Link>

          <Link
            to="/buyer-orders"
            className={
              styles.profileDropdownItem
            }
          >
            My Orders
          </Link>

          <Link
            to="/buyer-guide"
            className={
              styles.profileDropdownItem
            }
          >
            Buyer Guide
          </Link>

        </div>
      )}

    </div>
  );
}

export default BuyerProfileMenu;