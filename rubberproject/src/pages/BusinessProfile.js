import React, { useEffect, useState } from "react";
import styles from "../styles/Buyer/Buyerbusinessprofile.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBusinessProfileThunk } from "../redux/slices/businessProfileThunk";
import CustomAlert from "../components/alert/CustomAlert";
import { logoutUser } from "../redux/slices/authSlice";
import { resetBusinessProfileState } from "../redux/slices/businessProfileSlice";

function BusinessProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const {
    createBusinessProfileLoading,
    createBusinessProfileError,
    createBusinessProfileSuccessMessage,
  } = useSelector((state) => state.businessProfile);

  const [alertData, setAlertData] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  // Track field-specific inline validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signup");
    }
  }, [navigate]);

  useEffect(() => {
    if (createBusinessProfileSuccessMessage) {
      setAlertData({
        show: true,
        type: "success",
        title: "Profile Created",
        message: createBusinessProfileSuccessMessage,
      });
    }
  }, [createBusinessProfileSuccessMessage]);

  useEffect(() => {
    if (createBusinessProfileError) {
      setAlertData({
        show: true,
        type: "error",
        title: "Profile Creation Failed",
        message: createBusinessProfileError,
      });
    }
  }, [createBusinessProfileError]);

  const [formData, setFormData] = useState({
    companyName: "",
    phoneNumber: "",
    email: user?.email || "",
    gstNumber: "",
    panNumber: "",
    billingAddress: "",
    shippingAddress: "",
    sameAsBillingAddress: false,
    interestedProducts: [],
    gstCertificate: null,
    panCertificate: null, // Optional
    agreeTerms: false,
  });

  const interestedProductsList = [
    "Baled Tyres PCR",
    "Baled Tyres TBR",
    "Three Piece PCR",
    "Three Piece TBR",
    "Shreds",
    "PCR Mulch",
    "Rubber Granules/crumb",
    "Pyro Oil",
    "Pyro Steel",
    "Rubber Crumb Steel",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Clear field-specific error as user starts modifying it
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (type === "checkbox") {
      if (name === "sameAsBillingAddress") {
        setFormData((prev) => ({
          ...prev,
          sameAsBillingAddress: checked,
          shippingAddress: checked ? prev.billingAddress : "",
        }));
        // If syncing addresses, clear shippingAddress error if it exists
        if (checked && errors.shippingAddress) {
          setErrors((prev) => ({ ...prev, shippingAddress: "" }));
        }
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

  const handleInterestedProductChange = (product) => {
    setFormData((prev) => ({
      ...prev,
      interestedProducts: prev.interestedProducts.includes(product)
        ? prev.interestedProducts.filter((item) => item !== product)
        : [...prev.interestedProducts, product],
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    if (file.size > 1024 * 1024) {
      setAlertData({
        show: true,
        type: "warning",
        title: "File Too Large",
        message: "Please select files less than 1 MB.",
      });

      e.target.value = null; // Reset html file slot
      setFormData((prev) => ({ ...prev, [name]: null }));
      setErrors((prev) => ({ ...prev, [name]: "File must be less than 1 MB" }));
      return;
    }

    // Clear file errors on valid selection
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = {};

    // Validate mandatory textual fields
    if (!formData.companyName.trim()) validationErrors.companyName = "Company name is required";
    if (!formData.phoneNumber.trim()) validationErrors.phoneNumber = "Phone number is required";
    if (!formData.email.trim()) validationErrors.email = "Email is required";
    if (!formData.gstNumber.trim()) validationErrors.gstNumber = "GST number is required";
    if (!formData.panNumber.trim()) validationErrors.panNumber = "PAN number is required";
    if (!formData.billingAddress.trim()) validationErrors.billingAddress = "Billing address is required";
    if (!formData.sameAsBillingAddress && !formData.shippingAddress.trim()) {
      validationErrors.shippingAddress = "Shipping address is required";
    }

    // Validate mandatory file fields (PAN certificate validation removed here)
    if (!formData.gstCertificate) validationErrors.gstCertificate = "GST certificate is required (Max 1 MB)";

    // Validate Terms checkbox
    if (!formData.agreeTerms) validationErrors.agreeTerms = "You must agree to the Terms and Conditions";

    // If any mandatory error exists, update error state and halt submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      setAlertData({
        show: true,
        type: "warning",
        title: "Action Required",
        message: "Some mandatory fields are missing or invalid. Please check your details and try again.",
      });
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

    if (user?.role === "buyer") {
      submitData.append(
        "interestedProducts",
        JSON.stringify(formData.interestedProducts),
      );
    }

    submitData.append("gstCertificate", formData.gstCertificate);
    
    // Append PAN certificate if it exists, otherwise send empty/null value smoothly
    if (formData.panCertificate) {
      submitData.append("panCertificate", formData.panCertificate);
    }

    dispatch(createBusinessProfileThunk(submitData));
  };

  // Helper styling object for standard red error texts
  const errorTextStyles = {
    color: "#dc3545",
    fontSize: "12px",
    marginTop: "4px",
    display: "block",
    fontWeight: "500"
  };

  return (
    <div className={styles.businessProfilePage}>
      {alertData.show && (
        <CustomAlert
          type={alertData.type}
          title={alertData.title}
          message={alertData.message}
          onClose={() => {
            setAlertData((prev) => ({
              ...prev,
              show: false,
            }));

            if (alertData.type === "success") {
              dispatch(resetBusinessProfileState());
              dispatch(logoutUser());
              navigate("/login");
            }
          }}
        />
      )}
      <div className={styles.businessProfileContainer}>
        <h1>
          {user?.role === "seller"
            ? "Create Seller Business Profile"
            : "Create Buyer Business Profile"}
        </h1>

        <p>
          Complete your business details to continue using Rubber Scrap Mart.
        </p>

        <form onSubmit={handleSubmit} className={styles.businessProfileForm} noValidate>
          <div className={styles.formGroup}>
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
            />
            {errors.companyName && <span style={errorTextStyles}>{errors.companyName}</span>}
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
              {errors.phoneNumber && <span style={errorTextStyles}>{errors.phoneNumber}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
              {errors.email && <span style={errorTextStyles}>{errors.email}</span>}
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
                placeholder="Enter GST number"
              />
              {errors.gstNumber && <span style={errorTextStyles}>{errors.gstNumber}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>PAN Number</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="Enter PAN number"
              />
              {errors.panNumber && <span style={errorTextStyles}>{errors.panNumber}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Bill to Address</label>
            <textarea
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleChange}
              placeholder="Enter billing address"
            />
            {errors.billingAddress && <span style={errorTextStyles}>{errors.billingAddress}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Shipping Details</label>
            <div className={styles.checkboxRow}>
              <input
                type="checkbox"
                id="sameAsBillingAddress"
                name="sameAsBillingAddress"
                checked={formData.sameAsBillingAddress}
                onChange={handleChange}
                className={styles.checkboxInput}
              />
              <label htmlFor="sameAsBillingAddress" className={styles.checkboxLabel}>
                Same as Billing Address
              </label>
            </div>
            <textarea
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              placeholder="Enter shipping address"
              disabled={formData.sameAsBillingAddress}
            />
            {errors.shippingAddress && <span style={errorTextStyles}>{errors.shippingAddress}</span>}
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Upload GST Certificate</label>
              <input
                type="file"
                name="gstCertificate"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
              />
              {errors.gstCertificate && <span style={errorTextStyles}>{errors.gstCertificate}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Upload PAN Certificate <span style={{ color: "#64748b", fontSize: "12px", fontWeight: "normal" }}>(Optional)</span></label>
              <input
                type="file"
                name="panCertificate"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
              />
              {errors.panCertificate && <span style={errorTextStyles}>{errors.panCertificate}</span>}
            </div>
          </div>

          {user?.role === "buyer" && (
            <div className={styles.formGroup}>
              <label>Interested Products <span style={{ color: "#64748b", fontSize: "12px", fontWeight: "normal" }}>(Optional)</span></label>
              <div className={styles.productsGrid}>
                {interestedProductsList.map((product) => (
                  <div key={product} className={styles.productCheckbox}>
                    <input
                      type="checkbox"
                      checked={formData.interestedProducts.includes(product)}
                      onChange={() => handleInterestedProductChange(product)}
                    />
                    <span>{product}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.termsBox}>
            <div className={styles.checkboxRow}>
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <label>I agree to the Terms and Conditions</label>
            </div>
            {errors.agreeTerms && <span style={errorTextStyles}>{errors.agreeTerms}</span>}

            <p>
              By Creating Business Profile, you agree to our Terms and
              Conditions, including data privacy and business conduct.
            </p>

            <button
              type="button"
              className={styles.viewMoreBtn}
              onClick={() => window.open("/termsandconditions", "_blank", "noopener,noreferrer")}
            >
              View More
            </button>
          </div>

          <button type="submit" className={styles.submitBtn}>
            {createBusinessProfileLoading
              ? "Creating Profile..."
              : user?.role === "seller"
                ? "Create Seller Profile"
                : "Create Buyer Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BusinessProfile;