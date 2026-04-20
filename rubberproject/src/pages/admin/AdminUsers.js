// src/pages/admin/AdminUsers.js

import React, { useEffect, useState } from "react";
import styles from "../../styles/Admin/AdminUsers.module.css";
import AdminBuyerCard from "../../components/admin/AdminBuyerCard";
import AdminSellerCard from "../../components/admin/AdminSellerCard";

function AdminUsers() {
  const [activeTab, setActiveTab] = useState("buyers");
  const [buyers, setBuyers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/admin/all-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setBuyers(data.buyers || []);
        setSellers(data.sellers || []);
      }
    } catch (error) {
      console.log("Fetch Users Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.adminUsersWrapper}>
      <div className={styles.adminUsersHeader}>
        <h1 className={styles.adminUsersTitle}>Users Management</h1>
        <p className={styles.adminUsersSubtitle}>
          View buyers and sellers registered on the platform
        </p>
      </div>

      <div className={styles.adminUsersTabsContainer}>
        <button
          className={`${styles.adminUsersTabButton} ${
            activeTab === "buyers" ? styles.adminUsersActiveTab : ""
          }`}
          onClick={() => setActiveTab("buyers")}
        >
          Buyers ({buyers.length})
        </button>

        <button
          className={`${styles.adminUsersTabButton} ${
            activeTab === "sellers" ? styles.adminUsersActiveTab : ""
          }`}
          onClick={() => setActiveTab("sellers")}
        >
          Sellers ({sellers.length})
        </button>
      </div>

      {loading ? (
        <div className={styles.adminUsersEmptyState}>Loading users...</div>
      ) : (
        <div className={styles.adminUsersGrid}>
          {activeTab === "buyers" ? (
            buyers.length > 0 ? (
              buyers.map((buyer) => (
                <AdminBuyerCard key={buyer._id} user={buyer} />
              ))
            ) : (
              <div className={styles.adminUsersEmptyState}>
                No buyers found
              </div>
            )
          ) : sellers.length > 0 ? (
            sellers.map((seller) => (
              <AdminSellerCard key={seller._id} user={seller} />
            ))
          ) : (
            <div className={styles.adminUsersEmptyState}>
              No sellers found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminUsers;