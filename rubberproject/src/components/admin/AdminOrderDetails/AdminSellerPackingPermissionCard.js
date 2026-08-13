import React, { useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import { updateSellerPackingPermission } from "../../../redux/slices/adminOrders/updateSellerPackingPermissionThunk";

import styles from "../../../styles/Admin/AdminSellerPackingPermissionCard.module.css";

const AdminSellerPackingPermissionCard = ({ order }) => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const { sellerPackingPermissionLoading } = useSelector(
    (state) => state.adminOrders,
  );

  /* =========================
     PAYMENT STATUS
  ========================= */

  const buyerPaidAmount = Number(order?.buyerPaidAmount || 0);
  const buyerPendingAmount = Number(order?.buyerPendingAmount || 0);

  const sellerPaidAmount = Number(order?.sellerPaidAmount || 0);
  const sellerPendingAmount = Number(order?.sellerPendingAmount || 0);

  const isSellerFullyPaid =
    sellerPendingAmount === 0 &&
    order?.sellerPaymentStatus === "completed";

  const isManuallyApproved =
    order?.sellerPackingPermission === true;

  const handleTogglePermission = () => {
    dispatch(
      updateSellerPackingPermission({
        orderId: order?._id,
        sellerPackingPermission: !isManuallyApproved,
      }),
    );
  };

  /* =========================
     PACKING STATUS
  ========================= */

  let packingStatus = "Seller Payment Pending";
  let packingStatusClass = styles.notAllowedBadge;

  if (isSellerFullyPaid) {
    packingStatus = "Payment Completed — Seller Can Pack";
    packingStatusClass = styles.allowedBadge;
  } else if (isManuallyApproved) {
    packingStatus = "Packing Approved — Seller Can Pack";
    packingStatusClass = styles.allowedBadge;
  }

  return (
    <div className={styles.card}>
      {/* =========================
          HEADER
      ========================= */}

      <div
        className={styles.dropdownHeader}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.headerLeft}>
          <div className={styles.iconBox}>
            <FaBoxOpen />
          </div>

          <div>
            <h3>Seller Packing & Payment Status</h3>

            <p className={styles.description}>
              Review payment status and seller packing permission.
            </p>
          </div>
        </div>

        <span
          className={`${styles.toggleIcon} ${
            isOpen ? styles.iconActive : ""
          }`}
        >
          {isOpen ? "−" : "+"}
        </span>
      </div>

      {/* =========================
          DROPDOWN CONTENT
      ========================= */}

      {isOpen && (
        <div className={styles.content}>

          {/* =========================
              BUYER → ADMIN
          ========================= */}

          <div className={styles.paymentSection}>
            <h4>Buyer → Admin Payment</h4>

            <div className={styles.paymentRows}>
              <div className={styles.row}>
                <span>Paid Amount</span>
                <strong>₹ {buyerPaidAmount}</strong>
              </div>

              <div className={styles.row}>
                <span>Pending Amount</span>
                <strong>₹ {buyerPendingAmount}</strong>
              </div>

              <div className={styles.row}>
                <span>Status</span>
                <strong>
                  {order?.buyerPaymentStatus || "pending"}
                </strong>
              </div>
            </div>
          </div>

          {/* =========================
              ADMIN → SELLER
          ========================= */}

          <div className={styles.paymentSection}>
            <h4>Admin → Seller Payment</h4>

            <div className={styles.paymentRows}>
              <div className={styles.row}>
                <span>Paid Amount</span>
                <strong>₹ {sellerPaidAmount}</strong>
              </div>

              <div className={styles.row}>
                <span>Pending Amount</span>
                <strong>₹ {sellerPendingAmount}</strong>
              </div>

              <div className={styles.row}>
                <span>Status</span>
                <strong>
                  {order?.sellerPaymentStatus || "pending"}
                </strong>
              </div>
            </div>
          </div>

          {/* =========================
              PACKING PERMISSION
          ========================= */}

          <div className={styles.packingSection}>
            <h4>Seller Packing Permission</h4>

            <div className={styles.packingStatus}>
              <span>Status</span>

              <span className={packingStatusClass}>
                {packingStatus}
              </span>
            </div>

            {/* FULL PAYMENT */}
            {isSellerFullyPaid ? (
              <div className={styles.paymentCompleted}>
                <strong>Payment Completed</strong>

                <span>
                  Admin has fully paid the seller. Seller can pack
                  the order.
                </span>
              </div>
            ) : (
              <>
                {/* MANUAL APPROVAL */}
                {isManuallyApproved && (
                  <div className={styles.manualApproval}>
                    <strong>Admin Packing Approval Active</strong>

                    <span>
                      Seller is allowed to pack even though the
                      seller payment is not fully completed.
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  className={
                    isManuallyApproved
                      ? styles.disableButton
                      : styles.allowButton
                  }
                  onClick={handleTogglePermission}
                  disabled={sellerPackingPermissionLoading}
                >
                  {sellerPackingPermissionLoading
                    ? "Updating..."
                    : isManuallyApproved
                      ? "Disable Packing Permission"
                      : "Allow Seller to Pack"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSellerPackingPermissionCard;