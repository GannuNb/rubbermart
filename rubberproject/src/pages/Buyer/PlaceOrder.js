// src/pages/Buyer/PlaceOrder.js

import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  FaClipboardList,
  FaStore,
  FaMapMarkerAlt,
  FaUser,
  FaPhoneAlt,
  FaHome,
  FaIdCard,
  FaPercent,
  FaBoxOpen,
  FaFileInvoice,
  FaInfoCircle,
  FaFileAlt,
  FaReceipt,
  FaShieldAlt,
} from "react-icons/fa";

import styles from "../../styles/Buyer/PlaceOrder.module.css";

function PlaceOrder() {
  const location = useLocation();
  const navigate = useNavigate();

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const sellerId = location.state?.sellerId || "";
  const sellerName = location.state?.sellerName || "";
  const shippingAddress = location.state?.shippingAddress || {};
  const orderItems = location.state?.orderItems || [];
  const buyerGstNumber = location.state?.buyerGstNumber || "";

  const taxableAmount = useMemo(() => {
    return Number(location.state?.taxableAmount || 0);
  }, [location.state]);

  const cgstAmount = useMemo(() => {
    return Number(location.state?.cgstAmount || 0);
  }, [location.state]);

  const sgstAmount = useMemo(() => {
    return Number(location.state?.sgstAmount || 0);
  }, [location.state]);

  const igstAmount = useMemo(() => {
    return Number(location.state?.igstAmount || 0);
  }, [location.state]);

  const gstAmount = useMemo(() => {
    return Number(location.state?.gstAmount || 0);
  }, [location.state]);

  const totalAmount = useMemo(() => {
    return Number(location.state?.totalAmount || 0);
  }, [location.state]);

  const isMaharashtraGST = buyerGstNumber.startsWith("27");

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
            cgstAmount: Number(cgstAmount),
            sgstAmount: Number(sgstAmount),
            igstAmount: Number(igstAmount),
            gstAmount: Number(gstAmount),
            totalAmount: Number(totalAmount),
            buyerGstNumber,
            gstType: isMaharashtraGST ? "cgst_sgst" : "igst",
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
    <>
      {/* =========================================
      PAGE HEADER
      ========================================= */}

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageHeaderIcon}>
            <FaClipboardList />
          </div>

          <div>
            <h1>Place Order</h1>

            <p>
              Review Your Order Details before confirming
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
      MAIN WRAPPER
      ========================================= */}

      <div className={styles.pageWrapper}>
        {/* =========================================
        LEFT SECTION
        ========================================= */}

        <div className={styles.leftSection}>
          {/* =========================================
          INFORMATION
          ========================================= */}

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <FaStore />
              </div>

              <h2>Information</h2>
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoLeft}>
                <FaStore className={styles.rowIcon} />

                <span className={styles.infoLabel}>
                  Seller Name
                </span>
              </div>

              <span>:</span>

              <span className={styles.infoValue}>
                {sellerName || "Not Available"}
              </span>
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoLeft}>
                <FaIdCard className={styles.rowIcon} />

                <span className={styles.infoLabel}>
                  Buyer GST Number
                </span>
              </div>

              <span>:</span>

              <span className={styles.infoValue}>
                {buyerGstNumber || "Not Available"}
              </span>
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoLeft}>
                <FaPercent className={styles.rowIcon} />

                <span className={styles.infoLabel}>
                  GST Type
                </span>
              </div>

              <span>:</span>

              <span className={styles.infoValue}>
                {isMaharashtraGST
                  ? "CGST + SGST"
                  : "IGST"}
              </span>
            </div>
          </div>

          {/* =========================================
          DELIVERY ADDRESS
          ========================================= */}

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <FaMapMarkerAlt />
              </div>

              <h2>Delivery Address</h2>
            </div>

            <div className={styles.addressBox}>
              <div className={styles.infoRow}>
                <div className={styles.infoLeft}>
                  <FaUser className={styles.rowIcon} />

                  <span className={styles.infoLabel}>
                    Full Name
                  </span>
                </div>

                <span>:</span>

                <span className={styles.infoValue}>
                  {shippingAddress?.fullName ||
                    "Not Available"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLeft}>
                  <FaPhoneAlt
                    className={styles.rowIcon}
                  />

                  <span className={styles.infoLabel}>
                    Mobile Number
                  </span>
                </div>

                <span>:</span>

                <span className={styles.infoValue}>
                  {shippingAddress?.mobileNumber ||
                    "Not Available"}
                </span>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLeft}>
                  <FaHome className={styles.rowIcon} />

                  <span className={styles.infoLabel}>
                    Address
                  </span>
                </div>

                <span>:</span>

                <span className={styles.infoValue}>
                  {shippingAddress?.fullAddress ||
                    "Not Available"}
                </span>
              </div>
            </div>
          </div>

          {/* =========================================
          PRODUCTS
          ========================================= */}

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <FaBoxOpen />
              </div>

              <h2>Selected Products</h2>
            </div>

            <div className={styles.productList}>
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  className={styles.productItem}
                >
                  {/* IMAGE */}

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

                  {/* INFO */}

                  <div className={styles.productInfo}>
                    <h3>
                      {item.application ||
                        "Product Name"}
                    </h3>

                    <div className={styles.badgeWrapper}>
                      <span
                        className={styles.productBadge}
                      >
                        {item.category || "Category"}
                      </span>

                      <span
                        className={styles.productBadge}
                      >
                        {item.loadingLocation ||
                          "Location"}
                      </span>

                      <span
                        className={styles.productBadge}
                      >
                        HSN: {item.hsnCode || "N/A"}
                      </span>
                    </div>

                    <div className={styles.productMeta}>
                      <div className={styles.metaRow}>
                        <span>Quantity</span>

                        <strong>
                          {item.requiredQuantity} MT
                        </strong>
                      </div>

                      <div className={styles.metaRow}>
                        <span>Price Per MT</span>

                        <strong>
                          ₹
                          {Number(
                            item.pricePerMT || 0
                          ).toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* SUBTOTAL */}

                  <div className={styles.productSubtotal}>
                    <span>Subtotal</span>

                    <strong>
                      ₹
                      {Number(
                        item.subtotal || 0
                      ).toLocaleString()}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================
        RIGHT SECTION
        ========================================= */}

        <div className={styles.rightSection}>
          <div className={styles.summaryCard}>
            {/* HEADER */}

            <div className={styles.summaryHeader}>
              <div className={styles.summaryIcon}>
                <FaFileInvoice />
              </div>

              <h2>Final Amount Summary</h2>
            </div>

            {/* SUMMARY */}

            <div className={styles.summaryRow}>
              <span>Taxable Amount</span>

              <span>
                ₹
                {Number(
                  taxableAmount
                ).toLocaleString()}
              </span>
            </div>

            {isMaharashtraGST ? (
              <>
                <div className={styles.summaryRow}>
                  <span>CGST (9%)</span>

                  <span>
                    ₹
                    {Number(
                      cgstAmount
                    ).toLocaleString()}
                  </span>
                </div>

                <div className={styles.summaryRow}>
                  <span>SGST (9%)</span>

                  <span>
                    ₹
                    {Number(
                      sgstAmount
                    ).toLocaleString()}
                  </span>
                </div>
              </>
            ) : (
              <div className={styles.summaryRow}>
                <span>IGST (18%)</span>

                <span>
                  ₹
                  {Number(
                    igstAmount
                  ).toLocaleString()}
                </span>
              </div>
            )}

            {/* TOTAL */}

            <div className={styles.totalRow}>
              <span>Total Amount</span>

              <span>
                ₹{Number(totalAmount).toLocaleString()}
              </span>
            </div>

            {/* NOTICE */}

            <div className={styles.noticeBox}>
              <div className={styles.noticeItem}>
                <FaInfoCircle />

                <p>
                  Seller will review this order before
                  payment is requested
                </p>
              </div>

              <div className={styles.noticeItem}>
                <FaFileAlt />

                <p>
                  Invoice PDF with order ID will be sent
                  to your registered email after order
                  confirmation.
                </p>
              </div>

              <div className={styles.noticeItem}>
                <FaReceipt />

                <p>
                  You can upload payment receipt only
                  after seller confirms the order.
                </p>
              </div>
            </div>

            {/* CHECKBOX */}

            <label className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) =>
                  setAgreeTerms(e.target.checked)
                }
              />

              <span>
                I confirm that all order details are
                correct.
              </span>
            </label>

            {/* BUTTON */}

            <button
              className={styles.confirmButton}
              disabled={!agreeTerms || loading}
              onClick={handleConfirmOrder}
            >
              <FaShieldAlt />

              {loading
                ? "Placing Order..."
                : "Confirm Order"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlaceOrder;