import React, { useEffect, useState } from "react";
import styles from "../styles/Buyerbusinessprofile.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBusinessProfileThunk } from "../redux/slices/businessProfileThunk";

function BusinessProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const {
    createBusinessProfileLoading,
    createBusinessProfileError,
    createBusinessProfileSuccessMessage,
  } = useSelector((state) => state.businessProfile);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signup");
    }
  }, [navigate]);

  useEffect(() => {
    if (createBusinessProfileSuccessMessage) {
      navigate("/");
    }
  }, [createBusinessProfileSuccessMessage, navigate]);

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
    panCertificate: null,
    agreeTerms: false,
  });

  const interestedProductsList = [
    "Baled Tyres PCR",
    "Baled Tyres TBR",
    "Three Piece PCR",
    "Three Piece TBR",
    "Shreds",
    "Mulch PCR",
    "Rubber Granules/crumb",
    "Pyro Oil",
    "Pyro Steel",
    "Rubber Crum Steel",
  ];

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
    submitData.append(
      "sameAsBillingAddress",
      formData.sameAsBillingAddress
    );

    if (user?.role === "buyer") {
      submitData.append(
        "interestedProducts",
        JSON.stringify(formData.interestedProducts)
      );
    }

    if (formData.gstCertificate) {
      submitData.append("gstCertificate", formData.gstCertificate);
    }

    if (formData.panCertificate) {
      submitData.append("panCertificate", formData.panCertificate);
    }

    dispatch(createBusinessProfileThunk(submitData));
  };

  return (
    <div className={styles.businessProfilePage}>
      <div className={styles.businessProfileContainer}>
        <h1>
          {user?.role === "seller"
            ? "Create Seller Business Profile"
            : "Create Buyer Business Profile"}
        </h1>

        <p>
          Complete your business details to continue using Rubber Scrap Mart.
        </p>

        <form onSubmit={handleSubmit} className={styles.businessProfileForm}>
          <div className={styles.formGroup}>
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
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
                placeholder="Enter phone number"
              />
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
            <label>Shipping Details</label>
            <textarea
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              placeholder="Enter shipping address"
              disabled={formData.sameAsBillingAddress}
            />
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
            </div>

            <div className={styles.formGroup}>
              <label>Upload PAN Certificate</label>
              <input
                type="file"
                name="panCertificate"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {user?.role === "buyer" && (
            <div className={styles.formGroup}>
              <label>Interested Products</label>

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

            <p>
              By Creating Business Profile, you agree to our Terms and
              Conditions, including data privacy and business conduct.
            </p>

            <button type="button" className={styles.viewMoreBtn}>
              View More
            </button>
          </div>

          {createBusinessProfileSuccessMessage && (
            <p className={styles.successText}>
              {createBusinessProfileSuccessMessage}
            </p>
          )}

          {createBusinessProfileError && (
            <p className={styles.errorText}>
              {createBusinessProfileError}
            </p>
          )}

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