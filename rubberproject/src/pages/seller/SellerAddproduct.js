import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProductThunk } from "../../redux/slices/sellerProductThunk";
import styles from "../../styles/SellerAddProduct.module.css";

function SellerAddproduct() {
  const dispatch = useDispatch();

  const { addProductLoading, addProductError, addProductSuccess } = useSelector(
    (state) => state.sellerProduct
  );

  const [formData, setFormData] = useState({
    category: "",
    application: "",
    quantity: "",
    loadingLocation: "",
    countryOfOrigin: "",
    pricePerMT: "",
    hsnCode: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [manualHsnEdit, setManualHsnEdit] = useState(false);

  const categoryOptions = ["Tyre Scrap", "Pyro Oil", "Tyre Steel Scrap"];
  const applicationOptions = {
    "Tyre Scrap": [
      "Baled Tyres PCR",
      "Baled Tyres TBR",
      "Three Piece PCR",
      "Three Piece TBR",
      "Shredds",
      "Mulch PCR",
      "Rubber Granules/Crum",
    ],
    "Pyro Oil": ["Pyro Oil"],
    "Tyre Steel Scrap": ["Pyro Steel", "Rubber Crum Steel"],
  };

  const hsnCodeMap = {
    "Baled Tyres PCR": "40040000",
    "Baled Tyres TBR": "40040000",
    "Three Piece PCR": "40040000",
    "Three Piece TBR": "40040000",
    "Shredds": "40040000",
    "Mulch PCR": "40040000",
    "Rubber Granules/Crum": "40040000",
    "Pyro Oil": "27101990",
    "Pyro Steel": "72042900",
    "Rubber Crum Steel": "72042900",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value,
        application: "",
        hsnCode: "",
      }));
      setManualHsnEdit(false);
      return;
    }

    if (name === "application") {
      if (!value) {
        setFormData((prev) => ({
          ...prev,
          application: "",
          hsnCode: "",
        }));
        setManualHsnEdit(false);
      } else {
        setFormData((prev) => ({
          ...prev,
          application: value,
          hsnCode: manualHsnEdit ? prev.hsnCode : hsnCodeMap[value] || "",
        }));
      }
      return;
    }

    if (name === "hsnCode") {
      setManualHsnEdit(true);
      setFormData((prev) => ({ ...prev, hsnCode: value }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert("Max 3 images allowed");
      return;
    }
    setImages(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    images.forEach((img) => data.append("images", img));

    dispatch(addProductThunk(data));
  };

  // Reset form after successful submission
  useEffect(() => {
    if (addProductSuccess) {
      setFormData({
        category: "",
        application: "",
        quantity: "",
        loadingLocation: "",
        countryOfOrigin: "",
        pricePerMT: "",
        hsnCode: "",
        description: "",
      });
      setImages([]);
      setManualHsnEdit(false);
    }
  }, [addProductSuccess]);

  return (
    <div className={styles.container}>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Category */}
        <div className={styles.formGroup}>
          <select
            name="category"
            onChange={handleChange}
            className={styles.select}
            required
            value={formData.category}
          >
            <option value="">Category</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Application */}
        <div className={styles.formGroup}>
          <select
            name="application"
            onChange={handleChange}
            className={styles.select}
            required
            value={formData.application}
            disabled={!formData.category}
          >
            <option value="">Application</option>
            {applicationOptions[formData.category]?.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity & Loading Location */}
        <div className={styles.formGroup}>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity In MT"
            onChange={handleChange}
            className={styles.input}
            required
            value={formData.quantity}
          />
          <select
            name="loadingLocation"
            onChange={handleChange}
            className={styles.select}
            required
            value={formData.loadingLocation}
          >
            <option value="">Loading Location</option>
            {["Ex Chennai", "Ex Mundra", "Ex Nhavasheva"].map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Country & Price */}
        <div className={styles.formGroup}>
          <input
            type="text"
            name="countryOfOrigin"
            placeholder="Country of Origin"
            onChange={handleChange}
            className={styles.input}
            required
            value={formData.countryOfOrigin}
          />
          <input
            type="number"
            name="pricePerMT"
            placeholder="Price per MT"
            onChange={handleChange}
            className={styles.input}
            required
            value={formData.pricePerMT}
          />
        </div>

        {/* HSN */}
        <div className={styles.formGroup}>
          <input
            type="text"
            name="hsnCode"
            placeholder="HSN Code"
            onChange={handleChange}
            className={styles.input}
            value={formData.hsnCode}
          />
        </div>

        {/* Images */}
        <div className={styles.formGroup}>
          <label htmlFor="images" className={styles.fileLabel}>
            Select up to 3 images
          </label>
          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
          />
        </div>

        {/* Description */}
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className={styles.textarea}
            value={formData.description}
          />
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={addProductLoading}
        >
          {addProductLoading ? "Uploading..." : "Add Product"}
        </button>

        {addProductError && (
          <p className={styles.message} style={{ color: "red" }}>
            {addProductError}
          </p>
        )}
        {addProductSuccess && (
          <p className={styles.message} style={{ color: "green" }}>
            {addProductSuccess}
          </p>
        )}
      </form>
    </div>
  );
}

export default SellerAddproduct;