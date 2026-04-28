import React, { useEffect } from "react";
import {
  FaArrowLeft,
  FaFileInvoice,
  FaCalendarAlt,
  FaBoxOpen,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getBuyerSingleOrderThunk } from "../../redux/slices/buyerOrderThunk";

import styles from "../../styles/Buyer/BuyerShippingInvoices.module.css";

const BuyerShippingInvoices = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orderId, itemName } = useParams();

  const { singleOrder, singleOrderLoading, singleOrderError } = useSelector(
    (state) => state.buyerOrders,
  );

  const order = singleOrder;

  /* =========================
     FETCH ORDER
  ========================= */

  useEffect(() => {
    if (orderId) {
      dispatch(getBuyerSingleOrderThunk(orderId));
    }
  }, [dispatch, orderId]);

  /* =========================
     LOADING
  ========================= */

  if (singleOrderLoading) {
    return <div className={styles.container}>Loading shipment invoices...</div>;
  }

  /* =========================
     ERROR
  ========================= */

  if (singleOrderError) {
    return <div className={styles.container}>{singleOrderError}</div>;
  }

  /* =========================
     SAFETY CHECK
  ========================= */

  if (!order) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <h2>Order details not found</h2>
        </div>
      </div>
    );
  }

  /* =========================
     FILTER APPROVED SHIPMENTS
  ========================= */

  const approvedShipments =
    order?.shipments?.filter((shipment) => {
      const shipmentItem = shipment?.selectedItem?.trim()?.toLowerCase();

      const currentItem = decodeURIComponent(itemName)?.trim()?.toLowerCase();

      return shipmentItem === currentItem && shipment?.approvedByAdmin === true;
    }) || [];

  return (
    <div className={styles.container}>
      {/* TOP SECTION */}

      <div className={styles.topSection}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Back to Order Details
        </button>

        <div className={styles.titleRow}>
          <div>
            <h1 className={styles.heading}>Shipping Details</h1>

            <p className={styles.subText}>
              Complete Shipment Invoice Information and Tracking Details
            </p>
          </div>

          <div className={styles.orderIdBox}>
            <span>Order ID</span>
            <strong>{order?.orderId || orderId}</strong>
          </div>
        </div>
      </div>

      {/* SHIPMENT LIST */}

      {approvedShipments.length === 0 ? (
        <div className={styles.empty}>No approved shipment invoices found</div>
      ) : (
        <div className={styles.invoiceList}>
          {approvedShipments.map((shipment) => (
            <div key={shipment?._id} className={styles.invoiceCard}>
              <div className={styles.cardLeft}>
                <div className={styles.infoBlock}>
                  <div className={styles.iconBox}>
                    <FaFileInvoice />
                  </div>

                  <div>
                    <p className={styles.label}>Invoice ID</p>

                    <h4>{shipment?.shipmentInvoiceId || "-"}</h4>
                  </div>
                </div>

                <div className={styles.infoBlock}>
                  <div className={styles.iconBox}>
                    <FaCalendarAlt />
                  </div>

                  <div>
                    <p className={styles.label}>Shipment Date</p>

                    <h4>
                      {shipment?.shippedAt
                        ? new Date(shipment.shippedAt).toLocaleDateString()
                        : "-"}
                    </h4>
                  </div>
                </div>

                <div className={styles.infoBlock}>
                  <div className={styles.iconBox}>
                    <FaBoxOpen />
                  </div>

                  <div>
                    <p className={styles.label}>Item</p>

                    <h4>{shipment?.selectedItem || "-"}</h4>
                  </div>
                </div>
                {/* STATUS */}

                <div className={styles.infoBlock}>
                  <div className={styles.iconBox}>
                    <FaCheckCircle />
                  </div>

                  <div>
                    <p className={styles.label}>Status</p>

                    <h4
                      className={
                        shipment?.shipmentStatus === "delivered"
                          ? styles.deliveredStatus
                          : styles.inTransitStatus
                      }
                    >
                      {shipment?.shipmentStatus === "delivered"
                        ? "Delivered"
                        : "In Transit"}
                    </h4>
                  </div>
                </div>
              </div>

              <button
                className={styles.viewButton}
                onClick={() =>
                  navigate(
                    `/buyer/order/${order?._id}/shipping-invoice/${shipment?._id}`,
                  )
                }
              >
                View More
                <FaArrowRight />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerShippingInvoices;
