// src/pages/SellerProductsBySeller.js

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "../styles/SellerProductsBySeller.module.css";

function SellerProductsBySeller() {
  const { sellerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuantities, setSelectedQuantities] = useState({});

  const existingOrderItems = location.state?.existingOrderItems || [];
  const shippingAddress = location.state?.shippingAddress;
  const sellerName = location.state?.sellerName || "Seller";

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/buyer-products/products?sellerId=${sellerId}`
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

  const handleQuantityChange = (productId, value) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleAddProduct = (product) => {
    const quantity = Number(selectedQuantities[product._id]);

    if (!quantity || quantity <= 0) {
      alert("Please enter valid quantity");
      return;
    }

    let updatedOrderItems = [...existingOrderItems];

    const existingProductIndex = updatedOrderItems.findIndex(
      (item) => item.product === product._id
    );

    if (existingProductIndex !== -1) {
      updatedOrderItems[existingProductIndex].requiredQuantity =
        updatedOrderItems[existingProductIndex].requiredQuantity + quantity;

      updatedOrderItems[existingProductIndex].subtotal =
        updatedOrderItems[existingProductIndex].requiredQuantity *
        updatedOrderItems[existingProductIndex].pricePerMT;
    } else {
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
        productImage: product.images?.[0]?.image || "",
      });
    }

    navigate("/order-summary", {
      state: {
        sellerId,
        sellerName,
        shippingAddress,
        orderItems: updatedOrderItems,
      },
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading Products...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.headerSection}>
        <h1>More Products From {sellerName}</h1>
        <p>
          Select additional products from this seller and add them to the same
          order.
        </p>
      </div>

      <div className={styles.productGrid}>
        {products.map((product) => (
          <div className={styles.productCard} key={product._id}>
            <div className={styles.imageWrapper}>
              <img
                src={product.images?.[0]?.image}
                alt={product.application}
                className={styles.productImage}
              />
            </div>

            <div className={styles.productContent}>
              <span className={styles.categoryBadge}>
                {product.category}
              </span>

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
        ))}
      </div>
    </div>
  );
}

export default SellerProductsBySeller;