import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUserCircle,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaBuilding,
  FaPhoneAlt,
  FaIdCard,
  FaCalendarAlt,
  FaFileAlt,
  FaHome,
  FaCheckCircle,
  FaEdit,
  FaSave,
  FaUpload,
} from "react-icons/fa";

import axios from "axios";
import CustomAlert from "../../components/alert/CustomAlert";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileThunk } from "../../redux/slices/profileThunk";
import styles from "../../styles/Buyer/BuyerProfile.module.css"; 

function TransporterProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    location: "",
    phoneNumber: "",
    billingAddress: "",
    shippingAddress: "",
  });

  // Keep track of newly selected documents
  const [newGstFile, setNewGstFile] = useState(null);
  const [newPanFile, setNewPanFile] = useState(null);

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

  const getProfileImage = () => {
    if (!user?.profileImage) return "";
    return user.profileImage;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64 = await convertToBase64(file);
      if (type === "gst") {
        setNewGstFile(base64);
      } else if (type === "pan") {
        setNewPanFile(base64);
      }
    } catch (error) {
      console.log("File conversion error:", error);
      setAlert({
        show: true,
        type: "error",
        title: "File Error",
        message: "Failed to process selected file.",
      });
    }
  };

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

  // Dedicated function triggered as soon as they select a file to instantly save it if missing
  const handleDirectFileUpload = async (base64String, documentType) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Construct payload to match backend schema processing parser requirements
      const updatePayload = {};
      if (documentType === "gst") {
        updatePayload.gstCertificate = { file: base64String };
      } else if (documentType === "pan") {
        updatePayload.panCertificate = { file: base64String };
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/user/update-profile`,
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        await dispatch(fetchProfileThunk());
        if (documentType === "gst") setNewGstFile(null);
        if (documentType === "pan") setNewPanFile(null);
        
        setAlert({
          show: true,
          type: "success",
          title: "Document Saved",
          message: `${documentType.toUpperCase()} Certificate uploaded successfully.`,
        });
      }
    } catch (error) {
      console.log("Document Upload Error:", error);
      setAlert({
        show: true,
        type: "error",
        title: "Upload Failed",
        message: error?.response?.data?.message || "Failed to upload document",
      });
    } finally {
      setLoading(false);
    }
  };

  // Automatically trigger API save when a local file selection state catches a base64 conversion
  useEffect(() => {
    if (newGstFile) {
      handleDirectFileUpload(newGstFile, "gst");
    }
  }, [newGstFile]);

  useEffect(() => {
    if (newPanFile) {
      handleDirectFileUpload(newPanFile, "pan");
    }
  }, [newPanFile]);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/user/update-profile`,
        {
          fullName: formData.fullName,
          location: formData.location,
          phoneNumber: formData.phoneNumber,
          billingAddress: formData.billingAddress,
          shippingAddress: formData.shippingAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        await dispatch(fetchProfileThunk());
        setEditMode(false);
        setAlert({
          show: true,
          type: "success",
          title: "Profile Updated",
          message: "Profile details updated successfully",
        });
      }
    } catch (error) {
      console.log("Update Profile Error:", error);
      setAlert({
        show: true,
        type: "error",
        title: "Update Failed",
        message: error?.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  // Safe Extraction helper that maps both formatted API structures and direct DB buffer variants
  const getDocumentUrl = (certificateObj) => {
    if (!certificateObj) return null;
    
    // Pattern 1: Checked if preformatted as base64 data string URI from backend controller map
    if (certificateObj.file && typeof certificateObj.file === "string") {
      return certificateObj.file;
    }
    
    // Pattern 2: Process direct raw Mongoose nested buffer arrays safely using chunk mapping
    if (certificateObj.data) {
      let base64String = "";
      const bufferTarget = certificateObj.data.data ? certificateObj.data.data : certificateObj.data;
      
      if (Array.isArray(bufferTarget) || bufferTarget instanceof Uint8Array) {
        const uint8 = new Uint8Array(bufferTarget);
        let binary = "";
        for (let i = 0; i < uint8.length; i++) {
          binary += String.fromCharCode(uint8[i]);
        }
        base64String = btoa(binary);
      } else if (typeof bufferTarget === "string") {
        base64String = bufferTarget;
      }
      
      return `data:${certificateObj.contentType || "application/pdf"};base64,${base64String}`;
    }
    
    return null;
  };

  const openDocument = (certificateObj) => {
    try {
      const documentUrl = getDocumentUrl(certificateObj);
      if (!documentUrl) throw new Error("Invalid document object format");

      const parts = documentUrl.split(",");
      const mimeType = parts[0].split(":")[1].split(";")[0];
      const byteCharacters = atob(parts[1]);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 2000);
    } catch (error) {
      console.log("Document Open Error:", error);
      setAlert({
        show: true,
        type: "error",
        title: "Document Error",
        message: "Failed to open document",
      });
    }
  };

  // Helper validation predicate for UI check checks
  const hasDocument = (certificateObj) => {
    if (!certificateObj) return false;
    return !!(certificateObj.file || certificateObj.data);
  };

  return (
    <div className={styles.profilePage}>
      {alert.show && (
        <CustomAlert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
        />
      )}
      <div className={styles.profileContainer}>
        
        {/* HERO SECTION */}
        <div className={styles.heroSection}>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <div className={styles.profileLeft}>
              <div className={styles.profileImageWrapper}>
                {getProfileImage() ? (
                  <img
                    src={getProfileImage()}
                    alt={user?.fullName || "Profile"}
                    className={styles.profileImage}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={styles.profileInitials}>
                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </div>

              <div className={styles.profileInfo}>
                <h1>{businessProfile.companyName || user?.fullName}</h1>
                <p>{user?.email || "-"}</p>
                <div className={styles.badges}>
                  <span className={styles.roleBadge}>{user?.role}</span>
                  {user?.isVerified && <span className={styles.verifiedBadge}>Verified</span>}
                </div>
              </div>
            </div>

            {!editMode ? (
              <button className={styles.editBtn} onClick={() => setEditMode(true)}>
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button className={styles.editBtn} onClick={handleUpdateProfile} disabled={loading}>
                  <FaSave /> {loading ? "Saving..." : "Save Profile"}
                </button>
                <button className={styles.cancelBtn} onClick={handleCancelEdit}>Cancel</button>
              </div>
            )}
          </div>
        </div>

        {/* ACCOUNT INFORMATION */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <FaUserCircle />
            <h2>Account Information</h2>
          </div>
          <div className={styles.grid}>
            <div className={styles.card}>
              <span>Full Name</span>
              {editMode ? (
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
              ) : (
                <h4>{user?.fullName || "-"}</h4>
              )}
              <FaUserCircle className={styles.cardIcon} />
            </div>

            <div className={styles.card}>
              <span>Email Address</span>
              <h4>{user?.email || "-"}</h4>
              <FaEnvelope className={styles.cardIcon} />
            </div>

            <div className={styles.card}>
              <span>Location</span>
              {editMode ? (
                <input type="text" name="location" value={formData.location} onChange={handleChange} />
              ) : (
                <h4>{user?.location || "Not Added"}</h4>
              )}
              <FaMapMarkerAlt className={styles.cardIcon} />
            </div>

            <div className={styles.card}>
              <span>Auth Provider</span>
              <h4>{user?.authProvider || "manual"}</h4>
              <FaShieldAlt className={styles.cardIcon} />
            </div>

            <div className={styles.card}>
              <span>Account Status</span>
              <h4>{user?.isVerified ? "Active" : "Pending"}</h4>
              <FaCheckCircle className={styles.cardIcon} />
            </div>

            <div className={styles.card}>
              <span>Account Created</span>
              <h4>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</h4>
              <FaCalendarAlt className={styles.cardIcon} />
            </div>
          </div>
        </div>

        {/* BUSINESS INFORMATION */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <FaBuilding />
            <h2>Business Information</h2>
          </div>

          {!user?.businessProfileCompleted ? (
            <div className={styles.noBusinessProfileBox}>
              <div className={styles.noBusinessProfileIcon}>
                <FaBuilding />
              </div>
              <h3 className={styles.noBusinessProfileTitle}>No Business Profile Added</h3>
              <p className={styles.noBusinessProfileText}>
                Complete your business profile to unlock shipping management, fleet routing options, document verification, and all marketplace transport features.
              </p>
              <button onClick={() => navigate("/business-profile")} className={styles.completeProfileBtn}>
                Complete Business Profile
              </button>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                <div className={styles.card}>
                  <span>Company Name</span>
                  <h4>{businessProfile.companyName}</h4>
                  <FaBuilding className={styles.cardIcon} />
                </div>

                <div className={styles.card}>
                  <span>Phone Number</span>
                  {editMode ? (
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                  ) : (
                    <h4>{businessProfile.phoneNumber}</h4>
                  )}
                  <FaPhoneAlt className={styles.cardIcon} />
                </div>

                <div className={styles.card}>
                  <span>GST Number</span>
                  <h4>{businessProfile.gstNumber}</h4>
                  <FaIdCard className={styles.cardIcon} />
                </div>

                <div className={styles.card}>
                  <span>PAN Number</span>
                  <h4>{businessProfile.panNumber}</h4>
                  <FaIdCard className={styles.cardIcon} />
                </div>

                <div className={styles.card}>
                  <span>Billing Address</span>
                  {editMode ? (
                    <textarea name="billingAddress" value={formData.billingAddress} onChange={handleChange} />
                  ) : (
                    <h4>{businessProfile.billingAddress}</h4>
                  )}
                  <FaHome className={styles.cardIcon} />
                </div>

                <div className={styles.card}>
                  <span>Shipping Address</span>
                  {editMode ? (
                    <textarea name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} />
                  ) : (
                    <h4>{businessProfile.shippingAddress}</h4>
                  )}
                  <FaHome className={styles.cardIcon} />
                </div>
              </div>

              {/* DYNAMIC DOCUMENT VERIFICATION BLOCK */}
              <div className={styles.section} style={{ marginTop: "30px" }}>
                <div className={styles.sectionTitle}>
                  <FaFileAlt />
                  <h2>Uploaded Documents</h2>
                </div>

                <div className={styles.grid}>
                  
                  {/* GST CARD CONTAINER */}
                  <div className={styles.documentCard}>
                    <div>
                      <h4>GST Certificate</h4>
                      <p>{hasDocument(businessProfile.gstCertificate) ? "Protected Document" : "Missing Document"}</p>
                    </div>
                    {hasDocument(businessProfile.gstCertificate) ? (
                      <button
                        type="button"
                        className={styles.viewDocumentBtn}
                        onClick={() => openDocument(businessProfile.gstCertificate)}
                      >
                        View
                      </button>
                    ) : (
                      <label className={styles.viewDocumentBtn} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <FaUpload /> {loading ? "Uploading..." : "Upload"}
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          style={{ display: "none" }}
                          disabled={loading}
                          onChange={(e) => handleFileChange(e, "gst")}
                        />
                      </label>
                    )}
                  </div>

                  {/* PAN CARD CONTAINER */}
                  <div className={styles.documentCard}>
                    <div>
                      <h4>PAN Certificate</h4>
                      <p>{hasDocument(businessProfile.panCertificate) ? "Protected Document" : "Missing Document"}</p>
                    </div>
                    {hasDocument(businessProfile.panCertificate) ? (
                      <button
                        type="button"
                        className={styles.viewDocumentBtn}
                        onClick={() => openDocument(businessProfile.panCertificate)}
                      >
                        View
                      </button>
                    ) : (
                      <label className={styles.viewDocumentBtn} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <FaUpload /> {loading ? "Uploading..." : "Upload"}
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          style={{ display: "none" }}
                          disabled={loading}
                          onChange={(e) => handleFileChange(e, "pan")}
                        />
                      </label>
                    )}
                  </div>

                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default TransporterProfile;