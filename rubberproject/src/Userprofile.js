// File: UserProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaUserAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBuilding,
  FaPhoneAlt,
  FaMailBulk,
  FaRegIdBadge,
  FaAddressCard,
  FaTruck,
  FaShoppingCart,
  FaFileInvoiceDollar,
  FaShippingFast,
  FaWallet,
  FaEdit,
  FaSave,
  FaArrowLeft,
} from "react-icons/fa";
import styles from "./UserProfile.module.css";

// Inline dashboard components (imported so we can render them in-place)
import Getorders from './Getorders.js';
import Buyreport from './Buyreport.js';
import Sellreport from './Sellreport.js';
import ShippingDetails from './Shippingdetails.js';
import GetPay from './getpay.js';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [updatedBusinessProfiles, setUpdatedBusinessProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'business' | 'dashboard'

  // Which dashboard view to show inside the dashboard panel (null => show nav list)
  const [dashboardView, setDashboardView] = useState(null); // 'orders' | 'buyreport' | 'sellreport' | 'shipments' | 'payments'

  const token = localStorage.getItem("token");

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const fetchUserData = async () => {
    if (!token) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/userdetails`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userData = response.data.user;
      const businessData = response.data.businessProfiles || [];

      setUser(userData);
      setBusinessProfiles(businessData);
      setUpdatedUser({
        name: userData.name,
        email: userData.email,
        location: userData.location || "",
      });
      setUpdatedBusinessProfiles(businessData.map((p) => ({ ...p })));
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle personal detail input
  const handleInputChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  // Handle business detail input
  const handleBusinessChange = (index, e) => {
    const { name, value } = e.target;
    const profiles = [...updatedBusinessProfiles];
    profiles[index][name] = value;
    setUpdatedBusinessProfiles(profiles);
  };

  // Save both personal + business updates
  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/userdetails/update`,
        {
          userData: updatedUser,
          businessProfiles: updatedBusinessProfiles,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response.data.updatedUser);
      setBusinessProfiles(response.data.updatedUser.businessProfiles);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <div className={styles.loader}>Loading...</div>;
  if (!user) return <div>No user data found.</div>;

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileGrid}>
        {/* Left column - avatar + tabs */}
        <aside className={styles.sidePanel}>
          <div className={styles.avatarBox}>
            <div className={styles.profileAvatar}>
              <FaUserAlt size={56} color="#fff" />
            </div>

            <h3 className={styles.sideName}>{user.name}</h3>
            <p className={styles.sideEmail}>{user.email}</p>

            <div className={styles.tabs}>
              <button
                className={`${styles.tabBtn} ${activeTab === "profile" ? styles.active : ""}`}
                onClick={() => { setActiveTab("profile"); setDashboardView(null); }}
                type="button"
              >
                Profile Details
              </button>

              <button
                className={`${styles.tabBtn} ${activeTab === "business" ? styles.active : ""}`}
                onClick={() => { setActiveTab("business"); setDashboardView(null); }}
                type="button"
              >
                Business Profiles
              </button>

            </div>

            <div className={styles.dashboardNote} />
            {/* CTA stays; but now it also opens dashboard for convenience */}
            <div className={styles.sideActions}>
              <button
                className={styles.dashboardBtn}
                onClick={() => { setActiveTab("dashboard"); setDashboardView(null); }}
                type="button"
              >
                Dashboard
              </button>
            </div>
          </div>
        </aside>

        {/* Right column - content */}
        <main className={styles.contentPanel}>
          <div className={styles.contentHeader}>
            <div className={styles.headerLeft}>
              <h2>{activeTab === "profile" ? "Profile" : activeTab === "business" ? "Business Profiles" : "Dashboard"}</h2>
              <p className={styles.muted}>
                {activeTab === "profile" ? "Manage your personal information" :
                 activeTab === "business" ? "Manage your business profiles" :
                 "Quick access to orders, reports, shipments and payments"}
              </p>
            </div>

            <div className={styles.headerActions}>
              {!editing ? (
                <button className={`${styles.editBtn} ${styles.primary}`} onClick={() => setEditing(true)} type="button">
                  <FaEdit /> Edit
                </button>
              ) : (
                <button className={`${styles.saveBtn} ${styles.primary}`} onClick={handleSaveChanges} type="button">
                  <FaSave /> Save Changes
                </button>
              )}
            </div>
          </div>

          <div className={styles.contentBody}>
            {/* Profile Section */}
            <section className={`${styles.panel} ${activeTab === "profile" ? styles.visible : styles.hidden}`}>
              <div className={styles.infoRow}>
                <label>
                  <FaUserAlt /> Name
                </label>
                {editing ? (
                  <input type="text" name="name" value={updatedUser.name} onChange={handleInputChange} />
                ) : (
                  <div className={styles.infoValue}>{user.name}</div>
                )}
              </div>

              <div className={styles.infoRow}>
                <label>
                  <FaEnvelope /> Email
                </label>
                {editing ? (
                  <input type="email" name="email" value={updatedUser.email} onChange={handleInputChange} />
                ) : (
                  <div className={styles.infoValue}>{user.email}</div>
                )}
              </div>

              <div className={styles.infoRow}>
                <label>
                  <FaMapMarkerAlt /> Location
                </label>
                {editing ? (
                  <input type="text" name="location" value={updatedUser.location} onChange={handleInputChange} />
                ) : (
                  <div className={styles.infoValue}>{user.location || "N/A"}</div>
                )}
              </div>
            </section>

            {/* Business Section */}
            <section className={`${styles.panel} ${activeTab === "business" ? styles.visible : styles.hidden}`}>
              {businessProfiles.length > 0 ? (
                businessProfiles.map((profile, index) => (
                  <div key={index} className={styles.businessCard}>
                    <div className={styles.businessHeader}>
                      <FaBuilding className={styles.icon} />
                      <h5>{profile.companyName || "Untitled Company"}</h5>
                    </div>

                    <div className={styles.businessGrid}>
                      <div className={styles.infoRow}>
                        <label>Company Name</label>
                        {editing ? (
                          <input type="text" name="companyName" value={updatedBusinessProfiles[index].companyName} onChange={(e) => handleBusinessChange(index, e)} />
                        ) : (
                          <div className={styles.infoValue}>{profile.companyName}</div>
                        )}
                      </div>

                      <div className={styles.infoRow}>
                        <label>Phone</label>
                        {editing ? (
                          <input type="text" name="phoneNumber" value={updatedBusinessProfiles[index].phoneNumber} onChange={(e) => handleBusinessChange(index, e)} />
                        ) : (
                          <div className={styles.infoValue}>{profile.phoneNumber}</div>
                        )}
                      </div>

                      <div className={styles.infoRow}>
                        <label>Email</label>
                        {editing ? (
                          <input type="email" name="email" value={updatedBusinessProfiles[index].email} onChange={(e) => handleBusinessChange(index, e)} />
                        ) : (
                          <div className={styles.infoValue}>{profile.email}</div>
                        )}
                      </div>

                      <div className={styles.infoRow}>
                        <label>GST</label>
                        {editing ? (
                          <input type="text" name="gstNumber" value={updatedBusinessProfiles[index].gstNumber} onChange={(e) => handleBusinessChange(index, e)} />
                        ) : (
                          <div className={styles.infoValue}>{profile.gstNumber}</div>
                        )}
                      </div>

                      <div className={`${styles.infoRow} ${styles.fullWidth}`}>
                        <label>Billing Address</label>
                        {editing ? (
                          <input type="text" name="billAddress" value={updatedBusinessProfiles[index].billAddress} onChange={(e) => handleBusinessChange(index, e)} />
                        ) : (
                          <div className={styles.infoValue}>{profile.billAddress}</div>
                        )}
                      </div>

                      <div className={`${styles.infoRow} ${styles.fullWidth}`}>
                        <label>Shipping Address</label>
                        {editing ? (
                          <input type="text" name="shipAddress" value={updatedBusinessProfiles[index].shipAddress} onChange={(e) => handleBusinessChange(index, e)} />
                        ) : (
                          <div className={styles.infoValue}>{profile.shipAddress}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.textMuted}>No business profiles available.</p>
              )}
            </section>

            {/* Dashboard Section - now renders components inline instead of full-page redirects */}
            <section className={`${styles.panel} ${activeTab === "dashboard" ? styles.visible : styles.hidden}`}>
              <div className={styles.navigationSection}>
                <h4 className={styles.sectionTitle}>My Dashboard</h4>

                {/* If dashboardView is null, show the nav list. Otherwise render the selected component in-place. */}
                {!dashboardView ? (
                  <div className={styles.navLinks}>
                    <button className={styles.navItem} onClick={() => setDashboardView('orders')} type="button">
                      <FaShoppingCart /> My Orders
                    </button>
                    <button className={styles.navItem} onClick={() => setDashboardView('buyreport')} type="button">
                      <FaFileInvoiceDollar /> My Buy Reports
                    </button>
                    <button className={styles.navItem} onClick={() => setDashboardView('sellreport')} type="button">
                      <FaFileInvoiceDollar /> My Sell Reports
                    </button>
                    <button className={styles.navItem} onClick={() => setDashboardView('shipments')} type="button">
                      <FaShippingFast /> My Shipments
                    </button>
                    <button className={styles.navItem} onClick={() => setDashboardView('payments')} type="button">
                      <FaWallet /> My Payments
                    </button>
                  </div>
                ) : (
                  <div className={styles.inlineView}>
                    <div className={styles.inlineHeader}>
                      <button className={styles.backBtn} onClick={() => setDashboardView(null)} type="button">
                        <FaArrowLeft /> Back
                      </button>
                    </div>

                    <div className={styles.inlineContent}>
                      {dashboardView === 'orders' && <Getorders />}
                      {dashboardView === 'buyreport' && <Buyreport />}
                      {dashboardView === 'sellreport' && <Sellreport />}
                      {dashboardView === 'shipments' && <ShippingDetails />}
                      {dashboardView === 'payments' && <GetPay />}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
