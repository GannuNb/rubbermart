import React, { useEffect, useState } from "react";

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
} from "react-icons/fa";

import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

import { fetchProfileThunk } from "../../redux/slices/profileThunk";

import styles from "../../styles/Buyer/BuyerProfile.module.css";

const productOptions = [
  "Baled Tyres PCR",
  "Baled Tyres TBR",
  "Three Piece PCR",
  "Three Piece TBR",
  "Shreds",
  "Mulch PCR",
  "Rubber Granules/crumb",
  "Pyro Oil",
  "Pyro Steel",
  "Rubber Crumb Steel",
];

function BuyerProfile() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const [editMode, setEditMode] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    location: "",
    phoneNumber: "",
    billingAddress: "",
    shippingAddress: "",
    interestedProducts: [],
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

        interestedProducts: user?.businessProfile?.interestedProducts || [],
      });
    }
  }, [user]);

  const businessProfile = user?.businessProfile || {};

  const addresses = user?.addresses || [];

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

  const handleProductCheckbox = (product) => {
    const exists = formData.interestedProducts.includes(product);

    if (exists) {
      setFormData({
        ...formData,
        interestedProducts: formData.interestedProducts.filter(
          (item) => item !== product,
        ),
      });
    } else {
      setFormData({
        ...formData,
        interestedProducts: [...formData.interestedProducts, product],
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

      interestedProducts: user?.businessProfile?.interestedProducts || [],
    });
  };

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
          interestedProducts: formData.interestedProducts,
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

        alert("Profile updated successfully");
      }
    } catch (error) {
      console.log("Update Profile Error:", error);

      alert(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const openDocument = (base64File) => {
    try {
      const byteCharacters = atob(base64File.split(",")[1]);

      const mimeType = base64File.split(",")[0].split(":")[1].split(";")[0];

      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], {
        type: mimeType,
      });

      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (error) {
      console.log("Document Open Error:", error);

      alert("Failed to open document");
    }
  };

  return (
    <div className={styles.profilePage}>
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
                <h1>{user?.fullName || "Buyer"}</h1>

                <p>{user?.email || "-"}</p>

                <div className={styles.badges}>
                  <span className={styles.roleBadge}>{user?.role}</span>

                  {user?.isVerified && (
                    <span className={styles.verifiedBadge}>Verified</span>
                  )}
                </div>
              </div>
            </div>

            {!editMode ? (
              <button
                className={styles.editBtn}
                onClick={() => setEditMode(true)}
              >
                <FaEdit />
                Edit Profile
              </button>
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  className={styles.editBtn}
                  onClick={handleUpdateProfile}
                  disabled={loading}
                >
                  <FaSave />

                  {loading ? "Saving..." : "Save Profile"}
                </button>

                <button className={styles.cancelBtn} onClick={handleCancelEdit}>
                  Cancel
                </button>
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
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
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
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
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

              <h4>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "-"}
              </h4>

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

          <div className={styles.grid}>
            <div className={styles.card}>
              <span>Company Name</span>

              <h4>{businessProfile.companyName}</h4>

              <FaBuilding className={styles.cardIcon} />
            </div>

            <div className={styles.card}>
              <span>Phone Number</span>

              {editMode ? (
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
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
                <textarea
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleChange}
                />
              ) : (
                <h4>{businessProfile.billingAddress}</h4>
              )}

              <FaHome className={styles.cardIcon} />
            </div>

            <div className={styles.card}>
              <span>Shipping Address</span>

              {editMode ? (
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                />
              ) : (
                <h4>{businessProfile.shippingAddress}</h4>
              )}

              <FaHome className={styles.cardIcon} />
            </div>
          </div>
        </div>

        {/* INTERESTED PRODUCTS */}

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <FaFileAlt />
            <h2>Interested Products</h2>
          </div>

          {editMode ? (
            <div className={styles.checkboxGrid}>
              {productOptions.map((product) => (
                <label key={product} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.interestedProducts.includes(product)}
                    onChange={() => handleProductCheckbox(product)}
                  />

                  <span>{product}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className={styles.productsWrapper}>
              {businessProfile.interestedProducts?.length > 0 ? (
                businessProfile.interestedProducts.map((product, index) => (
                  <span key={index} className={styles.productTag}>
                    {product}
                  </span>
                ))
              ) : (
                <p className={styles.emptyText}>No interested products added</p>
              )}
            </div>
          )}
        </div>

        {/* SAVED ADDRESSES */}

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <FaMapMarkerAlt />
            <h2>Saved Addresses</h2>
          </div>

          {addresses.length > 0 ? (
            <div className={styles.addressGrid}>
              {addresses.map((address, index) => (
                <div key={index} className={styles.addressCard}>
                  <div className={styles.addressTop}>
                    <FaHome />

                    <h3>{address.fullName || "Address"}</h3>
                  </div>

                  <p>
                    {address.flatHouse}, {address.areaStreet}
                  </p>

                  <p>{address.landmark}</p>

                  <p>
                    {address.city}, {address.state}
                  </p>

                  <p>{address.pincode}</p>

                  <span>Mobile: {address.mobileNumber}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>No saved addresses found</p>
          )}
        </div>

        {/* DOCUMENTS */}

        {(businessProfile.gstCertificate?.file ||
          businessProfile.panCertificate?.file) && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <FaFileAlt />
              <h2>Uploaded Documents</h2>
            </div>

            <div className={styles.grid}>
              {businessProfile.gstCertificate?.file && (
                <div className={styles.documentCard}>
                  <div>
                    <h4>GST Certificate</h4>

                    <p>Protected Document</p>
                  </div>

                  <button
                    type="button"
                    className={styles.viewDocumentBtn}
                    onClick={() =>
                      openDocument(businessProfile.gstCertificate.file)
                    }
                  >
                    View
                  </button>
                </div>
              )}

              {businessProfile.panCertificate?.file && (
                <div className={styles.documentCard}>
                  <div>
                    <h4>PAN Certificate</h4>

                    <p>Protected Document</p>
                  </div>

                  <button
                    type="button"
                    className={styles.viewDocumentBtn}
                    onClick={() =>
                      openDocument(businessProfile.panCertificate.file)
                    }
                  >
                    View
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyerProfile;
