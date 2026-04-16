// src/pages/OrderSummary.js

import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/OrderSummary.module.css";

function OrderSummary() {
  const location = useLocation();
  const navigate = useNavigate();

  const sellerId = location.state?.sellerId || "";
  const sellerName = location.state?.sellerName || "";
  const shippingAddress = location.state?.shippingAddress || {};

  const [orderItems, setOrderItems] = useState(
    location.state?.orderItems || []
  );

  const taxableAmount = useMemo(() => {
    return orderItems.reduce((total, item) => {
      return total + Number(item.subtotal || 0);
    }, 0);
  }, [orderItems]);

  const gstAmount = useMemo(() => {
    return (taxableAmount * 18) / 100;
  }, [taxableAmount]);

  const totalAmount = useMemo(() => {
    return taxableAmount + gstAmount;
  }, [taxableAmount, gstAmount]);

  const handleQuantityChange = (index, value) => {
    const quantity = Number(value);

    if (!quantity || quantity <= 0) {
      return;
    }

    const updatedItems = [...orderItems];

    updatedItems[index].requiredQuantity = quantity;

    updatedItems[index].subtotal =
      quantity * Number(updatedItems[index].pricePerMT);

    setOrderItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(updatedItems);
  };

  const handleAddMoreProducts = () => {
    navigate(`/seller-products/${sellerId}`, {
      state: {
        sellerId,
        sellerName,
        shippingAddress,
        existingOrderItems: orderItems,
      },
    });
  };

  const handlePlaceOrder = () => {
    navigate("/place-order", {
      state: {
        sellerId,
        sellerName,
        shippingAddress,
        orderItems,
        taxableAmount,
        gstAmount,
        totalAmount,
      },
    });
  };

  if (!orderItems || orderItems.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyCard}>
          <h2>No Order Data Found</h2>
          <p>Please select a product and continue again.</p>

          <button
            className={styles.backButton}
            onClick={() => navigate("/ourproducts")}
          >
            Go Back To Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.headerSection}>
        <h1>Order Summary</h1>
        <p>Review selected products before placing your order.</p>
      </div>

      <div className={styles.topGrid}>
        <div className={styles.infoCard}>
          <h3>Seller Information</h3>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Seller Name</span>
            <span className={styles.infoValue}>{sellerName}</span>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h3>Delivery Address</h3>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Full Name</span>
            <span className={styles.infoValue}>
              {shippingAddress?.fullName || "Not Available"}
            </span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Mobile Number</span>
            <span className={styles.infoValue}>
              {shippingAddress?.mobileNumber || "Not Available"}
            </span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Address</span>
            <span className={styles.infoValue}>
              {shippingAddress?.fullAddress || "Not Available"}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.productsSection}>
        <h2 className={styles.productsTitle}>Selected Products</h2>

        {orderItems.map((item, index) => (
          <div className={styles.productCard} key={index}>
            <div className={styles.productImageWrapper}>
              <img
                src={
                  item.productImagePreview
                    ? item.productImagePreview
                    : item.productImage
                    ? item.productImage
                    : "https://via.placeholder.com/150x150?text=No+Image"
                }
                alt={item.application || "Product"}
                className={styles.productImage}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/150x150?text=No+Image";
                }}
              />
            </div>

            <div className={styles.productDetails}>
              <h3>{item.application}</h3>

              <div className={styles.productMeta}>
                <span className={styles.metaBadge}>
                  {item.category || "Category"}
                </span>

                <span className={styles.metaBadge}>
                  {item.loadingLocation || "Location Not Available"}
                </span>

                <span className={styles.metaBadge}>
                  HSN: {item.hsnCode || "N/A"}
                </span>
              </div>

              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Price Per MT</span>

                <div className={styles.priceValue}>
                  ₹{Number(item.pricePerMT || 0).toLocaleString()}
                </div>
              </div>

              <div className={styles.quantityWrapper}>
                <label>Required Quantity (MT)</label>

                <input
                  type="number"
                  min="1"
                  max={item.availableQuantity || 999999}
                  value={item.requiredQuantity}
                  onChange={(e) =>
                    handleQuantityChange(index, e.target.value)
                  }
                  className={styles.quantityInput}
                />
              </div>
            </div>

            <div className={styles.productActions}>
              <div className={styles.subtotalLabel}>Subtotal</div>

              <div className={styles.subtotalText}>
                ₹{Number(item.subtotal || 0).toLocaleString()}
              </div>

              <button
                className={styles.removeButton}
                onClick={() => handleRemoveItem(index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.actionButtons}>
          <button
            className={styles.addMoreButton}
            onClick={handleAddMoreProducts}
          >
            Add More Products From This Seller
          </button>
        </div>

        <div className={styles.summaryCard}>
          <h3>Order Amount Summary</h3>

          <div className={styles.summaryRow}>
            <span>Taxable Amount</span>
            <span>₹{Number(taxableAmount).toLocaleString()}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>GST (18%)</span>
            <span>₹{Number(gstAmount).toLocaleString()}</span>
          </div>

          <div className={styles.summaryTotal}>
            <span>Total Amount</span>
            <span>₹{Number(totalAmount).toLocaleString()}</span>
          </div>

          <button
            className={styles.placeOrderButton}
            onClick={handlePlaceOrder}
            disabled={orderItems.length === 0}
          >
            Continue To Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;