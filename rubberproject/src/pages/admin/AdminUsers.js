import React, { useEffect, useState } from "react";
import styles from "../../styles/Admin/AdminUsers.module.css";
import AdminBuyerCard from "../../components/admin/AdminBuyerCard";
import AdminSellerCard from "../../components/admin/AdminSellerCard";
import AdminAdminCard from "../../components/admin/AdminAdminCard";

function AdminUsers() {
  const [activeTab, setActiveTab] = useState("buyers");
  const [usersList, setUsersList] = useState([]); // ONLY contains the 4 visible items
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // TRUE BACKEND PAGINATION DRIVER STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Holds global total numbers to display across all tab badges immediately
  const [tabCounts, setTabCounts] = useState({
    admins: 0,
    buyers: 0,
    sellers: 0,
    transporters: 0,
  });
  const itemsPerPage = 4;

  // 1. Fetch single admin profile summary
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/user/my-profile`,
          { headers },
        );
        const profileData = await res.json();

        if (profileData.success) {
          if (profileData.user) setAdmins([profileData.user]);
          else if (profileData.profile) setAdmins([profileData.profile]);
        }
      } catch (error) {
        console.log("Fetch Admin Profile Error:", error);
      }
    };
    fetchAdminProfile();
  }, []);

  // 2. Fetch network slices dynamically when tab or page index changes
  useEffect(() => {
    if (activeTab === "admins") {
      setLoading(false);
      return;
    }

    const fetchPaginatedUsersFromServer = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        // Pass the target role, active page index, and strict display limit to backend
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/user/admin/all-users?role=${activeTab}&page=${currentPage}&limit=${itemsPerPage}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();

        if (data.success) {
          setUsersList(data.users || []); // Save ONLY the 4 records returned
          setTotalPages(data.totalPages || 1);

          // Sync all tab labels with current database counts instantly
          if (data.globalCounts) {
            setTabCounts(data.globalCounts);
          }
        } else {
          setUsersList([]);
        }
      } catch (error) {
        console.log("Fetch Paginated Users Error:", error);
        setUsersList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaginatedUsersFromServer();
  }, [activeTab, currentPage]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setCurrentPage(1); // Reset page selection back to 1 on tab switch
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.adminUsersWrapper}>
      <div className={styles.adminUsersHeader}>
        <h1 className={styles.adminUsersTitle}>Users Management</h1>
        <p className={styles.adminUsersSubtitle}>
          View platform administrators, registered buyers, and active sellers
        </p>
      </div>

      {/* Tab counts update immediately without needing a tab click */}
      <div className={styles.adminUsersTabsContainer}>
        <button
          className={`${styles.adminUsersTabButton} ${activeTab === "admins" ? styles.adminUsersActiveTab : ""}`}
          onClick={() => handleTabChange("admins")}
        >
          Admins ({tabCounts.admins || admins.length})
        </button>

        <button
          className={`${styles.adminUsersTabButton} ${activeTab === "buyers" ? styles.adminUsersActiveTab : ""}`}
          onClick={() => handleTabChange("buyers")}
        >
          Buyers ({tabCounts.buyers})
        </button>

        <button
          className={`${styles.adminUsersTabButton} ${activeTab === "sellers" ? styles.adminUsersActiveTab : ""}`}
          onClick={() => handleTabChange("sellers")}
        >
          Sellers ({tabCounts.sellers})
        </button>

        <button
          className={`${styles.adminUsersTabButton} ${
            activeTab === "transporters" ? styles.adminUsersActiveTab : ""
          }`}
          onClick={() => handleTabChange("transporters")}
        >
          Transporters ({tabCounts.transporters})
        </button>
      </div>

      {loading ? (
        <div className={styles.adminUsersEmptyState}>
          Loading users directory entries...
        </div>
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
              admins.length > 0 ? (
                admins.map((admin) => (
                  <div
                    key={admin._id || "admin-root"}
                    style={{ width: "100%", maxWidth: "560px" }}
                  >
                    <AdminAdminCard user={admin} />
                  </div>
                ))
              ) : (
                <div className={styles.adminUsersEmptyState}>
                  No administrator profiles resolved
                </div>
              )
            ) : activeTab === "buyers" ? (
              usersList.length > 0 ? (
                usersList.map((buyer) => (
                  <AdminBuyerCard key={buyer._id} user={buyer} />
                ))
              ) : (
                <div className={styles.adminUsersEmptyState}>
                  No buyers found inside database documentation
                </div>
              )
            ) : activeTab === "sellers" ? (
              usersList.length > 0 ? (
                usersList.map((seller) => (
                  <AdminSellerCard key={seller._id} user={seller} />
                ))
              ) : (
                <div className={styles.adminUsersEmptyState}>
                  No platform sellers found inside database documentation
                </div>
              )
            ) : usersList.length > 0 ? (
              usersList.map((transporter) => (
                <AdminSellerCard key={transporter._id} user={transporter} />
              ))
            ) : (
              <div className={styles.adminUsersEmptyState}>
                No transporters found inside database
              </div>
            )}
          </div>

          {/* SERVER-SIDE CONTROL FOOTER */}
          {activeTab !== "admins" && (
            <div className={styles.paginationWrapper}>
              <button
                className={styles.pageArrowButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo; Previous
              </button>

              <div className={styles.pageNumbersGrid}>
                {(() => {
                  let startPage = Math.max(1, currentPage);
                  if (currentPage === totalPages && totalPages > 1) {
                    startPage = Math.max(1, currentPage - 1);
                  }

                  const endPage = Math.min(totalPages, startPage + 1);
                  const pageNumbers = [];

                  for (let i = startPage; i <= endPage; i++) {
                    pageNumbers.push(
                      <button
                        key={i}
                        className={`${styles.pageNumberPill} ${currentPage === i ? styles.activePageNumberPill : ""}`}
                        onClick={() => handlePageChange(i)}
                      >
                        {i}
                      </button>,
                    );
                  }
                  return pageNumbers;
                })()}
              </div>

              <button
                className={styles.pageArrowButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages <= 1}
              >
                Next &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminUsers;
