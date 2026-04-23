import React from "react";
import styles from "../../styles/Buyer/BuyerOrders.module.css";

function OrderHeader() {
  return (
    <div className={styles.topHeaderCard}>
      <div className={styles.pageTitleSection}>
        <div className={styles.orderIconBox}>
          <img src="/logo192.png" alt="orders" />
        </div>
        <h1>My Orders</h1>
      </div>

      <div className={styles.profileIcon}>
        <img
          src="https://i.pravatar.cc/100?img=32"
          alt="profile"
        />
      </div>
    </div>
  );
}

export default OrderHeader;