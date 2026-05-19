// src/pages/admin/AdminUsers.js

import React, { useEffect, useState } from "react";
import styles from "../../styles/Admin/AdminUsers.module.css";
import AdminBuyerCard from "../../components/admin/AdminBuyerCard";
import AdminSellerCard from "../../components/admin/AdminSellerCard";
import AdminAdminCard from "../../components/admin/AdminAdminCard"; // Importing your new component

function AdminUsers() {
  const [activeTab, setActiveTab] = useState("buyers");
  const [buyers, setBuyers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [admins, setAdmins] = useState([]); // State array to manage current admin accounts
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsersAndAdminProfile();
  }, []);

  const fetchUsersAndAdminProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch both user directories and your admin profile simultaneously in parallel execution
      const [usersRes, profileRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/api/user/admin/all-users`, { headers }),
        fetch(`${process.env.REACT_APP_API_URL}/api/user/my-profile`, { headers })
      ]);

      const usersData = await usersRes.json();
      const profileData = await profileRes.json();

      // Hydrate Buyers and Sellers
      if (usersData.success) {
        setBuyers(usersData.buyers || []);
        setSellers(usersData.sellers || []);
      }

      // Hydrate Admin panel dataset safely using the target personal profile item
      if (profileData.success && profileData.user) {
        setAdmins([profileData.user]); 
      } else if (profileData.success && profileData.profile) {
        setAdmins([profileData.profile]); // Fallback check depending on your target getMyProfile schema key name
      }
    } catch (error) {
      console.log("Fetch Complete Users compilation package Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.adminUsersWrapper}>
      <div className={styles.adminUsersHeader}>
        <h1 className={styles.adminUsersTitle}>Users Management</h1>
        <p className={styles.adminUsersSubtitle}>
          View platform administrators, registered buyers, and active global sellers
        </p>
      </div>

      <div className={styles.adminUsersTabsContainer}>
        <button
          className={`${styles.adminUsersTabButton} ${
            activeTab === "admins" ? styles.adminUsersActiveTab : ""
          }`}
          onClick={() => setActiveTab("admins")}
        >
          Admins ({admins.length})
        </button>

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
        <div className={styles.adminUsersEmptyState}>Loading users directory entries...</div>
      ) : (
        /* CRITICAL FIX: Completely separate styles.adminUsersGrid out when activeTab is "admins".
          This stops the CSS Grid grid-template-columns rule from forcing an empty space on the right side.
        */
        <div 
          className={
            activeTab === "admins" 
              ? styles.centerGridItems 
              : styles.adminUsersGrid
          }
        >
          {activeTab === "admins" ? (
            admins.length > 0 ? (
              admins.map((admin) => (
                /* Max width wrapper applied to prevent stretching across full flex view width */
                <div key={admin._id || "admin-root"} style={{ width: "100%", maxWidth: "560px" }}>
                  <AdminAdminCard user={admin} />
                </div>
              ))
            ) : (
              <div className={styles.adminUsersEmptyState}>No administrator profiles resolved</div>
            )
          ) : activeTab === "buyers" ? (
            buyers.length > 0 ? (
              buyers.map((buyer) => (
                <AdminBuyerCard key={buyer._id} user={buyer} />
              ))
            ) : (
              <div className={styles.adminUsersEmptyState}>No buyers found inside database documentation</div>
            )
          ) : sellers.length > 0 ? (
            sellers.map((seller) => (
              <AdminSellerCard key={seller._id} user={seller} />
            ))
          ) : (
            <div className={styles.adminUsersEmptyState}>No platform sellers found inside database documentation</div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminUsers;