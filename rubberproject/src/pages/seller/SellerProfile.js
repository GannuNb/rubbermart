import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaUserCircle, FaEnvelope, FaMapMarkerAlt, FaShieldAlt, 
  FaBuilding, FaPhoneAlt, FaIdCard, FaCalendarAlt, FaFileAlt, 
  FaCheckCircle, FaEdit, FaSave, FaTimes, FaHome 
} from "react-icons/fa";
import { fetchProfileThunk } from "../../redux/slices/profileThunk";
import CustomAlert from "../../components/alert/CustomAlert";
import styles from "../../styles/Buyer/BuyerProfile.module.css"; 

function SellerProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", title: "", message: "" });
  
  const [formData, setFormData] = useState({
    fullName: "",
    location: "",
    phoneNumber: "",
    billingAddress: "",
    shippingAddress: "",
  });

  useEffect(() => {
    dispatch(fetchProfileThunk());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user?.fullName || "",
        location: user?.location || "",
        phoneNumber: user?.businessProfile?.phoneNumber || "",
        billingAddress: user?.businessProfile?.billingAddress || "",
        shippingAddress: user?.businessProfile?.shippingAddress || "",
      });
    }
  }, [user]);

  const businessProfile = user?.businessProfile || {};

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData({
      fullName: user?.fullName || "",
      location: user?.location || "",
      phoneNumber: user?.businessProfile?.phoneNumber || "",
      billingAddress: user?.businessProfile?.billingAddress || "",
      shippingAddress: user?.businessProfile?.shippingAddress || "",
    });
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/user/update-profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        await dispatch(fetchProfileThunk());
        setEditMode(false);
        setAlert({ show: true, type: "success", title: "Profile Updated", message: "Profile updated successfully" });
      }
    } catch (error) {
      setAlert({ show: true, type: "error", title: "Update Failed", message: error?.response?.data?.message || "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  const openDocument = (base64File) => {
    try {
      const byteCharacters = atob(base64File.split(",")[1]);
      const mimeType = base64File.split(",")[0].split(":")[1].split(";")[0];
      const byteNumbers = new Uint8Array(byteCharacters.split("").map(char => char.charCodeAt(0)));
      const blob = new Blob([byteNumbers], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (error) {
      setAlert({ show: true, type: "error", title: "Document Error", message: "Failed to open document" });
    }
  };

  return (
    <div className={styles.profilePage}>
      {alert.show && <CustomAlert {...alert} onClose={() => setAlert({ ...alert, show: false })} />}
      
      <div className={styles.profileContainer}>
        {/* HERO SECTION */}
        <div className={styles.heroSection}>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <div className={styles.profileLeft}>
              <div className={styles.profileImageWrapper}>
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.fullName} className={styles.profileImage} referrerPolicy="no-referrer" />
                ) : (
                  <div className={styles.profileInitials}>{user?.fullName?.charAt(0)?.toUpperCase()}</div>
                )}
              </div>
              <div className={styles.profileInfo}>
                <h1>{businessProfile.companyName || user?.fullName}</h1>
                <p>{user?.email || "-"}</p>
                <div className={styles.badges}>
                  <span className={styles.roleBadge}>{user?.role?.toUpperCase()}</span>
                  {user?.isVerified && <span className={styles.verifiedBadge}>Verified</span>}
                </div>
              </div>
            </div>
            {/* Top Action Toggle */}
            {!editMode ? (
              <button className={styles.editBtn} onClick={() => setEditMode(true)}><FaEdit /> Edit Profile</button>
            ) : (
              <div style={{ display: "flex", gap: "12px" }}>
                <button className={styles.editBtn} onClick={handleUpdateProfile} disabled={loading}><FaSave /> {loading ? "Saving..." : "Save"}</button>
                <button className={styles.cancelBtn} onClick={handleCancelEdit}><FaTimes /> Cancel</button>
              </div>
            )}
          </div>
        </div>

        {/* ACCOUNT INFORMATION */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}><FaUserCircle /><h2>Account Information</h2></div>
          <div className={styles.grid}>
            <div className={styles.card}><span>Full Name</span>{editMode ? <input name="fullName" value={formData.fullName} onChange={handleChange} /> : <h4>{user?.fullName || "-"}</h4>}<FaUserCircle className={styles.cardIcon} /></div>
            <div className={styles.card}><span>Email Address</span><h4>{user?.email || "-"}</h4><FaEnvelope className={styles.cardIcon} /></div>
            <div className={styles.card}><span>Location</span>{editMode ? <input name="location" value={formData.location} onChange={handleChange} /> : <h4>{user?.location || "Not Added"}</h4>}<FaMapMarkerAlt className={styles.cardIcon} /></div>
            <div className={styles.card}><span>Auth Provider</span><h4>{user?.authProvider || "manual"}</h4><FaShieldAlt className={styles.cardIcon} /></div>
            <div className={styles.card}><span>Account Status</span><h4>{user?.isVerified ? "Active" : "Pending"}</h4><FaCheckCircle className={styles.cardIcon} /></div>
            <div className={styles.card}><span>Account Created</span><h4>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</h4><FaCalendarAlt className={styles.cardIcon} /></div>
          </div>
        </div>

        {/* BUSINESS INFORMATION */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}><FaBuilding /><h2>Business Information</h2></div>
          {!user?.businessProfileCompleted ? (
            <div className={styles.noBusinessProfileBox}>
              <div className={styles.noBusinessProfileIcon}><FaBuilding /></div>
              <h3>No Business Profile Added</h3>
              <button onClick={() => navigate("/business-profile")} className={styles.completeProfileBtn}>Complete Business Profile</button>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                <div className={styles.card}><span>Company Name</span><h4>{businessProfile.companyName || "-"}</h4><FaBuilding className={styles.cardIcon}/></div>
                <div className={styles.card}><span>Phone Number</span>{editMode ? <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} /> : <h4>{businessProfile.phoneNumber || "-"}</h4>}<FaPhoneAlt className={styles.cardIcon}/></div>
                <div className={styles.card}><span>GST Number</span><h4>{businessProfile.gstNumber || "-"}</h4><FaIdCard className={styles.cardIcon}/></div>
                <div className={styles.card}><span>PAN Number</span><h4>{businessProfile.panNumber || "-"}</h4><FaIdCard className={styles.cardIcon}/></div>
                <div className={styles.card}><span>Billing Address</span>{editMode ? <textarea name="billingAddress" value={formData.billingAddress} onChange={handleChange}/> : <h4>{businessProfile.billingAddress || "-"}</h4>}<FaHome className={styles.cardIcon}/></div>
                <div className={styles.card}><span>Shipping Address</span>{editMode ? <textarea name="shippingAddress" value={formData.shippingAddress} onChange={handleChange}/> : <h4>{businessProfile.shippingAddress || "-"}</h4>}<FaHome className={styles.cardIcon}/></div>
              </div>

              {/* DOCUMENTS */}
              {(businessProfile.gstCertificate?.file || businessProfile.panCertificate?.file) && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}><FaFileAlt /><h2>Uploaded Documents</h2></div>
                  <div className={styles.grid}>
                    {businessProfile.gstCertificate?.file && (
                      <div className={styles.documentCard}>
                        <div><h4>GST Certificate</h4><p>Protected Document</p></div>
                        <button className={styles.viewDocumentBtn} onClick={() => openDocument(businessProfile.gstCertificate.file)}>View</button>
                      </div>
                    )}
                    {businessProfile.panCertificate?.file && (
                      <div className={styles.documentCard}>
                        <div><h4>PAN Certificate</h4><p>Protected Document</p></div>
                        <button className={styles.viewDocumentBtn} onClick={() => openDocument(businessProfile.panCertificate.file)}>View</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerProfile;