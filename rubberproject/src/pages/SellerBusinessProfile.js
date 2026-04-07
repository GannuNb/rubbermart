import React, { useEffect, useState } from "react";
import styles from "../styles/Buyerbusinessprofile.module.css"; // reuse same CSS
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSellerBusinessProfileThunk } from "../redux/slices/sellerBusinessProfileThunk";

function SellerBusinessProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { seller } = useSelector((state) => state.auth);

  const {
    createBusinessProfileLoading,
    createBusinessProfileError,
    createBusinessProfileSuccessMessage,
  } = useSelector((state) => state.sellerBusinessProfile);

  // 🔒 Protect route
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/seller-signup");
    }
  }, [navigate]);

  // ✅ Redirect after success
  useEffect(() => {
    if (createBusinessProfileSuccessMessage) {
      navigate("/");
    }
  }, [createBusinessProfileSuccessMessage, navigate]);

  const [formData, setFormData] = useState({
    companyName: "",
    phoneNumber: "",
    email: seller?.email || "",
    gstNumber: "",
    panNumber: "",
    billingAddress: "",
    shippingAddress: "",
    sameAsBillingAddress: false,
    gstCertificate: null,
    panCertificate: null,
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "sameAsBillingAddress") {
        setFormData((prev) => ({
          ...prev,
          sameAsBillingAddress: checked,
          shippingAddress: checked ? prev.billingAddress : "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "billingAddress" && prev.sameAsBillingAddress
          ? { shippingAddress: value }
          : {}),
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("Please select files less than 1 MB");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      alert("Please agree to the Terms and Conditions");
      return;
    }

    const submitData = new FormData();

    submitData.append("companyName", formData.companyName);
    submitData.append("phoneNumber", formData.phoneNumber);
    submitData.append("email", formData.email);
    submitData.append("gstNumber", formData.gstNumber);
    submitData.append("panNumber", formData.panNumber);
    submitData.append("billingAddress", formData.billingAddress);
    submitData.append("shippingAddress", formData.shippingAddress);
    submitData.append("sameAsBillingAddress", formData.sameAsBillingAddress);

    if (formData.gstCertificate) {
      submitData.append("gstCertificate", formData.gstCertificate);
    }

    if (formData.panCertificate) {
      submitData.append("panCertificate", formData.panCertificate);
    }

    dispatch(createSellerBusinessProfileThunk(submitData));
  };

  return (
    <div className={styles.businessProfilePage}>
      <div className={styles.businessProfileContainer}>
        <h1>Create Business Profile</h1>
        <p>Complete your details to start selling</p>

        <form onSubmit={handleSubmit} className={styles.businessProfileForm}>
          
          <div className={styles.formGroup}>
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>GST Number</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>PAN Number</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Billing Address</label>
            <textarea
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleChange}
            />
          </div>

          <div className={styles.checkboxRow}>
            <input
              type="checkbox"
              name="sameAsBillingAddress"
              checked={formData.sameAsBillingAddress}
              onChange={handleChange}
            />
            <label>Same as Billing Address</label>
          </div>

          <div className={styles.formGroup}>
            <label>Shipping Address</label>
            <textarea
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              disabled={formData.sameAsBillingAddress}
            />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>GST Certificate</label>
              <input
                type="file"
                name="gstCertificate"
                onChange={handleFileChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>PAN Certificate</label>
              <input
                type="file"
                name="panCertificate"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className={styles.checkboxRow}>
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            <label>I agree to Terms & Conditions</label>
          </div>

          {createBusinessProfileError && (
            <p className={styles.errorText}>
              {createBusinessProfileError}
            </p>
          )}

          {createBusinessProfileSuccessMessage && (
            <p className={styles.successText}>
              {createBusinessProfileSuccessMessage}
            </p>
          )}

          <button type="submit" className={styles.submitBtn}>
            {createBusinessProfileLoading
              ? "Creating..."
              : "Create Business Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SellerBusinessProfile;