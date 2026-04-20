import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProductThunk } from "../../redux/slices/sellerProductThunk";
import addstyles from "../../styles/Seller/SellerAddProduct.module.css";
import CustomAlert from "../../components/alert/CustomAlert";

import { resetProductState } from "../../redux/slices/sellerProductSlice";

function SellerAddproduct() {
  const dispatch = useDispatch();

  const {
    addProductLoading,
    addProductError,
    addProductSuccess,
  } = useSelector((state) => state.sellerProduct);

  const [alertData, setAlertData] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

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

  useEffect(() => {
    if (addProductSuccess) {
      setAlertData({
        show: true,
        type: "success",
        title: "Product Added",
        message: addProductSuccess,
      });

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

  useEffect(() => {
    if (addProductError) {
      setAlertData({
        show: true,
        type: "error",
        title: "Failed to Add Product",
        message: addProductError,
      });
    }
  }, [addProductError]);
useEffect(() => {
  return () => {
    dispatch(resetProductState());
  };
}, [dispatch]);

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
      setFormData((prev) => ({
        ...prev,
        hsnCode: value,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 3) {
      setAlertData({
        show: true,
        type: "warning",
        title: "Too Many Images",
        message: "You can upload a maximum of 3 images only.",
      });
      return;
    }

    setImages(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.category ||
      !formData.application ||
      !formData.quantity ||
      !formData.loadingLocation ||
      !formData.countryOfOrigin ||
      !formData.pricePerMT ||
      !formData.hsnCode
    ) {
      setAlertData({
        show: true,
        type: "warning",
        title: "Missing Fields",
        message: "Please fill all required fields before submitting.",
      });
      return;
    }

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    images.forEach((img) => {
      data.append("images", img);
    });

    dispatch(addProductThunk(data));
  };

  return (
    <>
      {alertData.show && (
        <CustomAlert
          type={alertData.type}
          title={alertData.title}
          message={alertData.message}
          onClose={() =>
            setAlertData((prev) => ({
              ...prev,
              show: false,
            }))
          }
        />
      )}

      <div className={addstyles.container}>
        <h2 className={addstyles.heading}>Add Product</h2>

        <form onSubmit={handleSubmit}>
          <div className={addstyles.formGroup}>
            <select
              name="category"
              onChange={handleChange}
              className={addstyles.select}
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

          <div className={addstyles.formGroup}>
            <select
              name="application"
              onChange={handleChange}
              className={addstyles.select}
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

          <div className={addstyles.formGroup}>
            <input
              type="number"
              name="quantity"
              placeholder="Quantity In MT"
              onChange={handleChange}
              className={addstyles.input}
              required
              value={formData.quantity}
            />

            <select
              name="loadingLocation"
              onChange={handleChange}
              className={addstyles.select}
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

          <div className={addstyles.formGroup}>
            <input
              type="text"
              name="countryOfOrigin"
              placeholder="Country of Origin"
              onChange={handleChange}
              className={addstyles.input}
              required
              value={formData.countryOfOrigin}
            />

            <input
              type="number"
              name="pricePerMT"
              placeholder="Price per MT"
              onChange={handleChange}
              className={addstyles.input}
              required
              value={formData.pricePerMT}
            />
          </div>

          <div className={addstyles.formGroup}>
            <input
              type="text"
              name="hsnCode"
              placeholder="HSN Code"
              onChange={handleChange}
              className={addstyles.input}
              value={formData.hsnCode}
            />
          </div>

          <div className={addstyles.formGroup}>
            <label htmlFor="images" className={addstyles.fileLabel}>
              Select up to 3 images
            </label>

            <input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className={addstyles.fileInput}
            />
          </div>

          <div className={`${addstyles.formGroup} ${addstyles.fullWidth}`}>
            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              className={addstyles.textarea}
              value={formData.description}
            />
          </div>

          <button
            type="submit"
            className={addstyles.button}
            disabled={addProductLoading}
          >
            {addProductLoading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>
    </>
  );
}

export default SellerAddproduct;