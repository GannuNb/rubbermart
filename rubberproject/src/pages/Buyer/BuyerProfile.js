import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileThunk } from "../../redux/slices/profileThunk";
import styles from "../../styles/Buyer/BuyerProfile.module.css";

function BuyerProfile() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProfileThunk());
  }, [dispatch]);

  const businessProfile = user?.businessProfile || {};
  const addresses = user?.addresses || [];

  const getProfileImage = () => {
    if (!user?.profileImage) return "";

    if (user.profileImage.includes("googleusercontent.com")) {
      return user.profileImage;
    }

    return user.profileImage;
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContainer}>
        <div className={styles.headerSection}>
          <div className={styles.profileImageWrapper}>
            {getProfileImage() ? (
              <>
                <img
                  src={getProfileImage()}
                  alt={user?.fullName || "Profile"}
                  className={styles.profileImage}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = "none";

                    const fallback =
                      e.target.parentElement.querySelector(
                        `.${styles.profileInitials}`
                      );

                    if (fallback) {
                      fallback.style.display = "flex";
                    }
                  }}
                />

                <div
                  className={styles.profileInitials}
                  style={{ display: "none" }}
                >
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </>
            ) : (
              <div className={styles.profileInitials}>
                {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          <div className={styles.headerContent}>
            <h1>{user?.fullName || "-"}</h1>
            <p>{user?.email || "-"}</p>

            <div className={styles.badges}>
              <span className={styles.roleBadge}>
                {user?.role || "Buyer"}
              </span>

              {user?.isVerified && (
                <span className={styles.verifiedBadge}>Verified</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Account Information</h2>

          <div className={styles.grid}>
            <div className={styles.card}>
              <label>Full Name</label>
              <p>{user?.fullName || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>Email</label>
              <p>{user?.email || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>Location</label>
              <p>{user?.location || "Not Added"}</p>
            </div>

            <div className={styles.card}>
              <label>Auth Provider</label>
              <p>{user?.authProvider || "manual"}</p>
            </div>

            <div className={styles.card}>
              <label>Business Profile Completed</label>
              <p>
                {user?.businessProfileCompleted ? "Completed" : "Pending"}
              </p>
            </div>

            <div className={styles.card}>
              <label>Account Created</label>
              <p>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Business Information</h2>

          <div className={styles.grid}>
            <div className={styles.card}>
              <label>Company ID</label>
              <p>{businessProfile.companyId || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>Company Name</label>
              <p>{businessProfile.companyName || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>Phone Number</label>
              <p>{businessProfile.phoneNumber || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>Business Email</label>
              <p>{businessProfile.email || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>GST Number</label>
              <p>{businessProfile.gstNumber || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>PAN Number</label>
              <p>{businessProfile.panNumber || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>Billing Address</label>
              <p>{businessProfile.billingAddress || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>Shipping Address</label>
              <p>{businessProfile.shippingAddress || "-"}</p>
            </div>

            <div className={styles.card}>
              <label>Same As Billing Address</label>
              <p>{businessProfile.sameAsBillingAddress ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Interested Products</h2>

          <div className={styles.productsWrapper}>
            {businessProfile.interestedProducts?.length > 0 ? (
              businessProfile.interestedProducts.map((product, index) => (
                <span key={index} className={styles.productTag}>
                  {product}
                </span>
              ))
            ) : (
              <p className={styles.emptyText}>
                No interested products added
              </p>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Saved Addresses</h2>

          {addresses.length > 0 ? (
            <div className={styles.addressGrid}>
              {addresses.map((address, index) => (
                <div key={index} className={styles.addressCard}>
                  <p>
                    <strong>Name:</strong> {address.fullName || "-"}
                  </p>

                  <p>
                    <strong>Mobile:</strong> {address.mobileNumber || "-"}
                  </p>

                  <p>
                    <strong>Flat / House:</strong>{" "}
                    {address.flatHouse || "-"}
                  </p>

                  <p>
                    <strong>Area / Street:</strong>{" "}
                    {address.areaStreet || "-"}
                  </p>

                  <p>
                    <strong>Landmark:</strong> {address.landmark || "-"}
                  </p>

                  <p>
                    <strong>City:</strong> {address.city || "-"}
                  </p>

                  <p>
                    <strong>State:</strong> {address.state || "-"}
                  </p>

                  <p>
                    <strong>Pincode:</strong> {address.pincode || "-"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>No saved addresses found</p>
          )}
        </div>

        {(businessProfile.gstCertificate?.file ||
          businessProfile.panCertificate?.file) && (
          <div className={styles.section}>
            <h2>Uploaded Documents</h2>

            <div className={styles.grid}>
              {businessProfile.gstCertificate?.file && (
                <div className={styles.card}>
                  <label>GST Certificate</label>
                  <a
                    href={businessProfile.gstCertificate.file}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View GST Certificate
                  </a>
                </div>
              )}

              {businessProfile.panCertificate?.file && (
                <div className={styles.card}>
                  <label>PAN Certificate</label>
                  <a
                    href={businessProfile.panCertificate.file}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View PAN Certificate
                  </a>
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