// src/pages/SellerProductsBySeller.js

import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { updateOrderItems } from "../../redux/slices/orderSummarySlice";

import styles from "../../styles/Seller/SellerProductsBySeller.module.css";

function SellerProductsBySeller() {
  const { sellerId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  /*
  =========================================
  REDUX DATA
  =========================================
  */

  const { sellerName, orderItems: existingOrderItems } = useSelector(
    (state) => state.orderSummary,
  );

  /*
  =========================================
  STATES
  =========================================
  */

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedQuantities, setSelectedQuantities] = useState({});

  /*
  =========================================
  FETCH PRODUCTS
  =========================================
  */

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/buyer-products/products?sellerId=${sellerId}`,
        );

        const data = await response.json();

        if (response.ok) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.log("Fetch Seller Products Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProducts();
  }, [sellerId]);

  /*
  =========================================
  QUANTITY CHANGE
  =========================================
  */

  const handleQuantityChange = (productId, value) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  /*
  =========================================
  ADD PRODUCT
  =========================================
  */

  const handleAddProduct = (product) => {
    const quantity = Number(selectedQuantities[product._id]);

    if (!quantity || quantity <= 0) {
      alert("Please enter valid quantity");

      return;
    }

    if (quantity > Number(product.quantity)) {
      alert("Quantity cannot exceed available stock");

      return;
    }

    let updatedOrderItems = [...existingOrderItems];

    const existingProductIndex = updatedOrderItems.findIndex(
      (item) => String(item.product) === String(product._id),
    );

    /*
    -----------------------------------------
    PRODUCT ALREADY EXISTS
    -----------------------------------------
    */

    if (existingProductIndex !== -1) {
      const existingItem = updatedOrderItems[existingProductIndex];

      const updatedQuantity = Number(existingItem.requiredQuantity) + quantity;

      if (updatedQuantity > Number(product.quantity)) {
        alert(
          `Total quantity cannot exceed available stock (${product.quantity} MT)`,
        );

        return;
      }

      updatedOrderItems[existingProductIndex] = {
        ...existingItem,

        requiredQuantity: updatedQuantity,

        subtotal: updatedQuantity * Number(existingItem.pricePerMT),
      };
    } else {

    /*
    -----------------------------------------
    NEW PRODUCT
    -----------------------------------------
    */
      updatedOrderItems.push({
        product: product._id,

        seller: product.seller?._id,

        category: product.category,

        application: product.application,

        requiredQuantity: quantity,

        pricePerMT: Number(product.pricePerMT),

        subtotal: quantity * Number(product.pricePerMT),

        loadingLocation: product.loadingLocation,

        hsnCode: product.hsnCode,

        /*
        -------------------------------------
        KEEP IMAGE
        -------------------------------------
        */

        productImage: product.images?.[0]?.image || "",

        availableQuantity: Number(product.quantity || 0),
      });
    }

    /*
    =========================================
    UPDATE REDUX
    =========================================
    */

    dispatch(updateOrderItems(updatedOrderItems));

    /*
    =========================================
    NAVIGATE
    =========================================
    */

    navigate("/order-summary");
  };

  /*
  =========================================
  LOADING
  =========================================
  */

  if (loading) {
    return <div className={styles.loading}>Loading Products...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      {/* HEADER */}

      <div className={styles.headerSection}>
        <h1>More Products From {sellerName}</h1>

        <p>
          Select additional products from this seller and add them to the same
          order.
        </p>
      </div>

      {/* PRODUCTS */}

      <div className={styles.productGrid}>
        {products.map((product) => {
          const alreadyAdded = existingOrderItems.find(
            (item) => String(item.product) === String(product._id),
          );

          return (
            <div className={styles.productCard} key={product._id}>
              {/* IMAGE */}

              <div className={styles.imageWrapper}>
                <img
                  src={
                    product.images?.[0]?.image ||
                    "https://via.placeholder.com/200x200?text=No+Image"
                  }
                  alt={product.application}
                  className={styles.productImage}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/200x200?text=No+Image";
                  }}
                />
              </div>

              {/* CONTENT */}

              <div className={styles.productContent}>
                <span className={styles.categoryBadge}>{product.category}</span>

                <h3>{product.application}</h3>

                <div className={styles.infoRow}>
                  <span>Price Per MT</span>

                  <strong>
                    ₹{Number(product.pricePerMT).toLocaleString()}
                  </strong>
                </div>

                <div className={styles.infoRow}>
                  <span>Available Quantity</span>

                  <strong>{product.quantity} MT</strong>
                </div>

                <div className={styles.infoRow}>
                  <span>Loading Location</span>

                  <strong>{product.loadingLocation}</strong>
                </div>

                <div className={styles.infoRow}>
                  <span>Already In Order</span>

                  <strong>
                    {alreadyAdded
                      ? `${alreadyAdded.requiredQuantity} MT`
                      : "0 MT"}
                  </strong>
                </div>

                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  placeholder="Enter Quantity"
                  className={styles.quantityInput}
                  value={selectedQuantities[product._id] || ""}
                  onChange={(e) =>
                    handleQuantityChange(product._id, e.target.value)
                  }
                />

                <button
                  className={styles.addButton}
                  onClick={() => handleAddProduct(product)}
                >
                  Add To Order
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SellerProductsBySeller;
