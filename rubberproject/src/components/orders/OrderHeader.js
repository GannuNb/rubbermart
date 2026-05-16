import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "../../styles/Buyer/BuyerOrders.module.css";

import { fetchProfileThunk } from "../../redux/slices/profileThunk";

function OrderHeader() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(fetchProfileThunk());
    }
  }, [dispatch, user]);

  const getProfileImage = () => {
    if (!user?.profileImage) return "";

    return user.profileImage;
  };

  const getInitial = () => {
    return user?.fullName?.charAt(0)?.toUpperCase() || "U";
  };

  return (
    <div className={styles.topHeaderCard}>
      <div className={styles.pageTitleSection}>
        <h1>My Orders</h1>
      </div>

      <div className={styles.profileIcon}>
        {getProfileImage() ? (
          <img
            src={getProfileImage()}
            alt={user?.fullName || "Profile"}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={styles.profileFallback}>
            {getInitial()}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHeader;