// src/pages/admin/AdminUsers.js

import React, { useEffect, useState } from "react";
import styles from "../../styles/Admin/AdminUsers.module.css";
import AdminBuyerCard from "../../components/admin/AdminBuyerCard";
import AdminSellerCard from "../../components/admin/AdminSellerCard";
import AdminAdminCard from "../../components/admin/AdminAdminCard"; 

function AdminUsers() {
  const [activeTab, setActiveTab] = useState("buyers");
  const [buyers, setBuyers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [admins, setAdmins] = useState([]); 
  const [loading, setLoading] = useState(true);

  // PAGINATION ENGINE STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchUsersAndAdminProfile();
  }, []);

  // Reset pagination sequence to page 1 whenever user switches views
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const fetchUsersAndAdminProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, profileRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/api/user/admin/all-users`, { headers }),
        fetch(`${process.env.REACT_APP_API_URL}/api/user/my-profile`, { headers })
      ]);

      const usersData = await usersRes.json();
      const profileData = await profileRes.json();

      if (usersData.success) {
        setBuyers(usersData.buyers || []);
        setSellers(usersData.sellers || []);
      }

      if (profileData.success && profileData.user) {
        setAdmins([profileData.user]); 
      } else if (profileData.success && profileData.profile) {
        setAdmins([profileData.profile]); 
      }
    } catch (error) {
      console.log("Fetch Complete Users compilation package Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // PAGINATION CONTROLLERS ENGINE Math
  const getCurrentDataset = () => {
    if (activeTab === "admins") return admins;
    if (activeTab === "buyers") return buyers;
    return sellers;
  };

  const currentDataset = getCurrentDataset();
  // Ensure totalPages is at least 1 so page 1 button displays even if the array is empty
  const totalPages = Math.ceil(currentDataset.length / itemsPerPage) || 1;
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentDataset.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        <>
          <div 
            className={
              activeTab === "admins" 
                ? styles.centerGridItems 
                : styles.adminUsersGrid
            }
          >
            {activeTab === "admins" ? (
              currentItems.length > 0 ? (
                currentItems.map((admin) => (
                  <div key={admin._id || "admin-root"} style={{ width: "100%", maxWidth: "560px" }}>
                    <AdminAdminCard user={admin} />
                  </div>
                ))
              ) : (
                <div className={styles.adminUsersEmptyState}>No administrator profiles resolved</div>
              )
            ) : activeTab === "buyers" ? (
              currentItems.length > 0 ? (
                currentItems.map((buyer) => (
                  <AdminBuyerCard key={buyer._id} user={buyer} />
                ))
              ) : (
                <div className={styles.adminUsersEmptyState}>No buyers found inside database documentation</div>
              )
            ) : currentItems.length > 0 ? (
              currentItems.map((seller) => (
                <AdminSellerCard key={seller._id} user={seller} />
              ))
            ) : (
              <div className={styles.adminUsersEmptyState}>No platform sellers found inside database documentation</div>
            )}
          </div>

          {/* ALWAYS VISIBLE PAGINATION CONTROL FOOTER */}
          <div className={styles.paginationWrapper}>
            <button 
              className={styles.pageArrowButton}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo; Previous
            </button>
            
            <div className={styles.pageNumbersGrid}>
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    className={`${styles.pageNumberPill} ${currentPage === pageNum ? styles.activePageNumberPill : ""}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button 
              className={styles.pageArrowButton}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next &raquo;
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminUsers;