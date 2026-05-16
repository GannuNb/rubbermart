// src/pages/Buyer/OrderSummary.js

import React, { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { updateOrderItems } from "../../redux/slices/orderSummarySlice";

import {
  FaClipboardList,
  FaStore,
  FaMapMarkerAlt,
  FaFileInvoice,
  FaShoppingCart,
  FaTrashAlt,
  FaPlus,
  FaBriefcase,
  FaUser,
  FaPhoneAlt,
  FaHome,
  FaIdCard,
  FaPercent,
} from "react-icons/fa";

import styles from "../../styles/Buyer/OrderSummary.module.css";

function OrderSummary() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  /*
  =========================================
  REDUX DATA
  =========================================
  */

  const {
    sellerId,
    sellerName,
    shippingAddress,
    buyerGstNumber,
    orderItems: reduxOrderItems,
  } = useSelector((state) => state.orderSummary);

  const isMaharashtraGST = buyerGstNumber?.startsWith("27");

  const [orderItems, setOrderItems] = useState(reduxOrderItems || []);

  /*
  =========================================
  TOTALS
  =========================================
  */

  const taxableAmount = useMemo(() => {
    return orderItems.reduce((total, item) => {
      return total + Number(item.subtotal || 0);
    }, 0);
  }, [orderItems]);

  const cgstAmount = useMemo(() => {
    return isMaharashtraGST ? (taxableAmount * 9) / 100 : 0;
  }, [taxableAmount, isMaharashtraGST]);

  const sgstAmount = useMemo(() => {
    return isMaharashtraGST ? (taxableAmount * 9) / 100 : 0;
  }, [taxableAmount, isMaharashtraGST]);

  const igstAmount = useMemo(() => {
    return !isMaharashtraGST ? (taxableAmount * 18) / 100 : 0;
  }, [taxableAmount, isMaharashtraGST]);

  const gstAmount = useMemo(() => {
    return cgstAmount + sgstAmount + igstAmount;
  }, [cgstAmount, sgstAmount, igstAmount]);

  const totalAmount = useMemo(() => {
    return taxableAmount + gstAmount;
  }, [taxableAmount, gstAmount]);

  /*
  =========================================
  QUANTITY CHANGE
  =========================================
  */

  const handleQuantityChange = (index, value) => {
    const quantity = Number(value);

    if (!quantity || quantity <= 0) return;

    const updatedItems = [...orderItems];

    const maxQuantity = Number(updatedItems[index].availableQuantity) || 999999;

    if (quantity > maxQuantity) {
      alert(`Quantity cannot exceed ${maxQuantity} MT`);

      return;
    }

    updatedItems[index] = {
      ...updatedItems[index],

      requiredQuantity: quantity,

      subtotal: quantity * Number(updatedItems[index].pricePerMT),
    };

    setOrderItems(updatedItems);

    /*
    -------------------------------------
    UPDATE REDUX
    -------------------------------------
    */

    dispatch(updateOrderItems(updatedItems));
  };

  /*
  =========================================
  REMOVE ITEM
  =========================================
  */

  const handleRemoveItem = (index) => {
    const updatedItems = orderItems.filter((_, i) => i !== index);

    setOrderItems(updatedItems);

    /*
    -------------------------------------
    UPDATE REDUX
    -------------------------------------
    */

    dispatch(updateOrderItems(updatedItems));
  };

  /*
  =========================================
  ADD MORE PRODUCTS
  =========================================
  */

  const handleAddMoreProducts = () => {
    navigate(`/seller-products/${sellerId}`);
  };

  /*
  =========================================
  PLACE ORDER
  =========================================
  */

  const handlePlaceOrder = () => {
    navigate("/place-order");
  };

  /*
  =========================================
  EMPTY STATE
  =========================================
  */

  if (!orderItems || orderItems.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyCard}>
          <h2>No Order Data Found</h2>

          <p>Please select a product and continue again.</p>

          <button
            className={styles.backButton}
            onClick={() => navigate("/our-products")}
          >
            Go Back To Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* HEADER */}

      <div className={styles.headerSection}>
        <div className={styles.headerTop}>
          <div className={styles.headerIcon}>
            <FaClipboardList />
          </div>

          <div>
            <h1>Order Summary</h1>

            <p>Review selected products before placing your order.</p>
          </div>
        </div>
      </div>

      {/* TOP GRID */}

      <div className={styles.topGrid}>
        {/* SELLER INFO */}

        <div className={styles.infoCard}>
          <div className={styles.cardHeading}>
            <div className={styles.cardIconPurple}>
              <FaStore />
            </div>

            <h3>Information</h3>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoLeft}>
              <FaStore className={styles.rowIcon} />

              <span className={styles.infoLabel}>Seller Name</span>
            </div>

            <span>:</span>

            <span className={styles.infoValue}>{sellerName}</span>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoLeft}>
              <FaIdCard className={styles.rowIcon} />

              <span className={styles.infoLabel}>Buyer GST Number</span>
            </div>

            <span>:</span>

            <span className={styles.infoValue}>
              {buyerGstNumber || "Not Available"}
            </span>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoLeft}>
              <FaPercent className={styles.rowIcon} />

              <span className={styles.infoLabel}>GST Type</span>
            </div>

            <span>:</span>

            <span className={styles.infoValue}>
              {isMaharashtraGST ? "CGST + SGST" : "IGST"}
            </span>
          </div>
        </div>

        {/* ADDRESS */}

        <div className={styles.infoCard}>
          <div className={styles.cardHeading}>
            <div className={styles.cardIconBlue}>
              <FaMapMarkerAlt />
            </div>

            <h3>Delivery Address</h3>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoLeft}>
              <FaUser className={styles.rowIcon} />

              <span className={styles.infoLabel}>Full Name</span>
            </div>

            <span>:</span>

            <span className={styles.infoValue}>
              {shippingAddress?.fullName || "Not Available"}
            </span>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoLeft}>
              <FaPhoneAlt className={styles.rowIcon} />

              <span className={styles.infoLabel}>Mobile Number</span>
            </div>

            <span>:</span>

            <span className={styles.infoValue}>
              {shippingAddress?.mobileNumber || "Not Available"}
            </span>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoLeft}>
              <FaHome className={styles.rowIcon} />

              <span className={styles.infoLabel}>Address</span>
            </div>

            <span>:</span>

            <span className={styles.infoValue}>
              {shippingAddress?.fullAddress || "Not Available"}
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}

      <div className={styles.bottomSection}>
        {/* PRODUCTS */}

        <div className={styles.productsSection}>
          <div className={styles.productsHeader}>
            <div className={styles.cardIconGreen}>
              <FaShoppingCart />
            </div>

            <h2 className={styles.productsTitle}>Selected Products</h2>
          </div>

          {orderItems.map((item, index) => (
            <div className={styles.productCard} key={index}>
              {/* IMAGE */}

              <div className={styles.productImageWrapper}>
                <img
                  src={
                    item.productImage ||
                    "https://via.placeholder.com/150x150?text=No+Image"
                  }
                  alt={item.application || "Product"}
                  className={styles.productImage}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/150x150?text=No+Image";
                  }}
                />
              </div>

              {/* DETAILS */}

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
                    HSN : {item.hsnCode || "N/A"}
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

              {/* ACTIONS */}

              <div className={styles.productActions}>
                <div>
                  <div className={styles.subtotalLabel}>Subtotal</div>

                  <div className={styles.subtotalText}>
                    ₹{Number(item.subtotal || 0).toLocaleString()}
                  </div>
                </div>

                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveItem(index)}
                >
                  <FaTrashAlt />
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* ADD MORE */}

          <div className={styles.actionButtons}>
            <button
              className={styles.addMoreButton}
              onClick={handleAddMoreProducts}
            >
              <FaPlus />
              Add More Products From This Seller
            </button>
          </div>
        </div>

        {/* SUMMARY */}

        <div className={styles.summaryCard}>
          <div className={styles.cardHeading}>
            <div className={styles.cardIconPurple}>
              <FaFileInvoice />
            </div>

            <h3>Order Amount Summary</h3>
          </div>

          <div className={styles.summaryRow}>
            <span>Taxable Amount</span>

            <span>₹{Number(taxableAmount).toLocaleString()}</span>
          </div>

          {isMaharashtraGST ? (
            <>
              <div className={styles.summaryRow}>
                <span>CGST (9%)</span>

                <span>₹{Number(cgstAmount).toLocaleString()}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>SGST (9%)</span>

                <span>₹{Number(sgstAmount).toLocaleString()}</span>
              </div>
            </>
          ) : (
            <div className={styles.summaryRow}>
              <span>IGST (18%)</span>

              <span>₹{Number(igstAmount).toLocaleString()}</span>
            </div>
          )}

          <div className={styles.summaryTotal}>
            <span>Total Amount</span>

            <span>₹{Number(totalAmount).toLocaleString()}</span>
          </div>

          <button
            className={styles.placeOrderButton}
            onClick={handlePlaceOrder}
            disabled={orderItems.length === 0}
          >
            <FaBriefcase />
            Continue To Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
