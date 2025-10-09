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
  FaAddressCard,
  FaTruck,
  FaRegIdBadge,
  FaShoppingCart,
  FaFileInvoiceDollar,
  FaShippingFast,
  FaWallet,
  FaArrowDown, // arrow pointing down
} from "react-icons/fa";
import "./UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/userdetails`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data.user);
        setBusinessProfiles(response.data.businessProfiles);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const scrollToDashboard = () => {
    const section = document.getElementById("dashboard-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!user) return <div>No user data found.</div>;

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <div className="profile-card">
          {/* --- Header --- */}
          <div className="profile-header">
            <div className="profile-avatar">
              <FaUserAlt size={60} color="#fff" />
            </div>
            <h3>{user.name}</h3>
          </div>

          <div className="profile-body">
            {/* --- Personal Details --- */}
            <div className="personal-section">
              <div className="section-header">
                <h4 className="section-title">Personal Details</h4>
                <button className="dashboard-btn" onClick={scrollToDashboard}>
                  Go to Dashboard <FaArrowDown />
                </button>
              </div>
              <div className="info-item">
                <FaEnvelope /> Email: <span>{user.email}</span>
              </div>
              <div className="info-item">
                <FaMapMarkerAlt /> Location: <span>{user.location || "N/A"}</span>
              </div>
            </div>

            {/* --- Business Details --- */}
            <div className="business-section">
              <h4 className="section-title">Business Profiles</h4>
              {businessProfiles.length > 0 ? (
                businessProfiles.map((profile, index) => (
                  <div key={index} className="business-card">
                    <div className="business-header">
                      <FaBuilding className="icon" />
                      <h5>{profile.companyName}</h5>
                    </div>
                    <div className="business-details">
                      <p><FaPhoneAlt /> {profile.phoneNumber}</p>
                      <p><FaMailBulk /> {profile.email}</p>
                      <p><FaRegIdBadge /> GST: {profile.gstNumber}</p>
                      <p><FaAddressCard /> Billing: {profile.billAddress}</p>
                      <p><FaTruck /> Shipping: {profile.shipAddress}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No business profiles available.</p>
              )}
            </div>

{/* --- Dashboard Section --- */}
<div id="dashboard-section" className="navigation-section">
  <h4 className="section-title">My Dashboard</h4>
  <div className="nav-links">
    <Link to="/Getorders" className="nav-item">
      <FaShoppingCart /> My Orders
    </Link>
    <Link to="/Buyreport" className="nav-item">
      <FaFileInvoiceDollar /> My Buy Reports
    </Link>
    <Link to="/Sellerreport" className="nav-item">
      <FaFileInvoiceDollar /> My Sell Reports
    </Link>
    <Link to="/ShippingDetails" className="nav-item">
      <FaShippingFast /> My Shipments
    </Link>
    <Link to="/getpay" className="nav-item">
      <FaWallet /> My Payments
    </Link>
  </div>
</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
