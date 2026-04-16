// src/pages/PlaceOrder.js

import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/PlaceOrder.module.css";

function PlaceOrder() {
  const location = useLocation();
  const navigate = useNavigate();

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const sellerId = location.state?.sellerId || "";
  const sellerName = location.state?.sellerName || "";
  const shippingAddress = location.state?.shippingAddress || {};
  const orderItems = location.state?.orderItems || [];

  const taxableAmount = useMemo(() => {
    return Number(location.state?.taxableAmount || 0);
  }, [location.state]);

  const gstAmount = useMemo(() => {
    return Number(location.state?.gstAmount || 0);
  }, [location.state]);

  const totalAmount = useMemo(() => {
    return Number(location.state?.totalAmount || 0);
  }, [location.state]);

  const handleConfirmOrder = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const backendOrderItems = orderItems.map((item) => ({
        product: item.product,
        seller: item.seller,
        category: item.category,
        application: item.application,
        requiredQuantity: Number(item.requiredQuantity),
        pricePerMT: Number(item.pricePerMT),
        subtotal: Number(item.subtotal),
        loadingLocation: item.loadingLocation,
        hsnCode: item.hsnCode,
      }));

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/orders/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            seller: sellerId,
            shippingAddress,
            orderItems: backendOrderItems,
            taxableAmount: Number(taxableAmount),
            gstAmount: Number(gstAmount),
            totalAmount: Number(totalAmount),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/order-success", {
          state: {
            order: data.order,
          },
        });
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (error) {
      console.log("Place Order Error:", error);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!orderItems || orderItems.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyCard}>
          <h2>No Order Data Found</h2>
          <p>Please return and create your order again.</p>

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
      <div className={styles.leftSection}>
        <div className={styles.card}>
          <h2>Seller Information</h2>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Seller Name</span>
            <span className={styles.infoValue}>
              {sellerName || "Not Available"}
            </span>
          </div>
        </div>

        <div className={styles.card}>
          <h2>Delivery Address</h2>

          <div className={styles.addressBox}>
            <div className={styles.addressRow}>
              <span className={styles.addressLabel}>Full Name</span>
              <span className={styles.addressValue}>
                {shippingAddress?.fullName || "Not Available"}
              </span>
            </div>

            <div className={styles.addressRow}>
              <span className={styles.addressLabel}>Mobile Number</span>
              <span className={styles.addressValue}>
                {shippingAddress?.mobileNumber || "Not Available"}
              </span>
            </div>

            <div className={styles.addressRow}>
              <span className={styles.addressLabel}>Address</span>
              <span className={styles.addressValue}>
                {shippingAddress?.fullAddress || "Not Available"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2>Order Items</h2>

          <div className={styles.productList}>
            {orderItems.map((item, index) => (
              <div key={index} className={styles.productItem}>
                <div className={styles.imageWrapper}>
                  <img
                    src={
                      item.productImagePreview
                        ? item.productImagePreview
                        : item.productImage
                        ? item.productImage
                        : "https://via.placeholder.com/120x120?text=No+Image"
                    }
                    alt={item.application || "Product"}
                    className={styles.productImage}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/120x120?text=No+Image";
                    }}
                  />
                </div>

                <div className={styles.productInfo}>
                  <h3>{item.application || "Product Name"}</h3>

                  <div className={styles.badgeWrapper}>
                    <span className={styles.productBadge}>
                      {item.category || "Category"}
                    </span>

                    <span className={styles.productBadge}>
                      {item.loadingLocation || "Location"}
                    </span>

                    <span className={styles.productBadge}>
                      HSN: {item.hsnCode || "N/A"}
                    </span>
                  </div>

                  <div className={styles.productMeta}>
                    <div className={styles.metaRow}>
                      <span>Quantity</span>
                      <strong>{item.requiredQuantity} MT</strong>
                    </div>

                    <div className={styles.metaRow}>
                      <span>Price Per MT</span>
                      <strong>
                        ₹{Number(item.pricePerMT || 0).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className={styles.productSubtotal}>
                  <span>Subtotal</span>

                  <strong>
                    ₹{Number(item.subtotal || 0).toLocaleString()}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.summaryCard}>
          <h2>Final Amount Summary</h2>

          <div className={styles.summaryRow}>
            <span>Taxable Amount</span>
            <span>₹{Number(taxableAmount).toLocaleString()}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>GST (18%)</span>
            <span>₹{Number(gstAmount).toLocaleString()}</span>
          </div>

          <div className={styles.totalRow}>
            <span>Total Amount</span>
            <span>₹{Number(totalAmount).toLocaleString()}</span>
          </div>

          <div className={styles.noticeBox}>
            <p>
              Seller will review this order before payment is requested.
            </p>

            <p>
              Invoice PDF with order ID will be sent to your registered email
              after order confirmation.
            </p>

            <p>
              You can upload payment receipt only after seller confirms the
              order.
            </p>
          </div>

          <label className={styles.checkboxWrapper}>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />

            <span>I confirm that all order details are correct.</span>
          </label>

          <button
            className={styles.confirmButton}
            disabled={!agreeTerms || loading}
            onClick={handleConfirmOrder}
          >
            {loading ? "Placing Order..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;