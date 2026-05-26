import React, { useState } from "react";

import {
  FaTruck,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  markShipmentDeliveredByAdmin,
} from "../../../redux/slices/adminOrders/markShipmentDeliveredThunk";

import styles from "../../../styles/Admin/AdminSingleShippingInvoice.module.css";

const AdminShipmentActionsCard = ({
  shipment,
  order,
}) => {
  const dispatch = useDispatch();

  const [showSuccess, setShowSuccess] =
    useState(false);

  const {
    singleOrder,
    markDeliveredLoading,
  } = useSelector(
    (state) => state.adminOrders
  );

  const latestShipment =
    singleOrder?.shipments?.find(
      (item) => item?._id === shipment?._id
    ) || shipment;

  const isDelivered =
    latestShipment?.shipmentStatus ===
    "delivered";

  const handleMarkDelivered = async () => {
    const result = await dispatch(
      markShipmentDeliveredByAdmin({
        orderId: order?._id,
        shipmentId: shipment?._id,
      })
    );

    if (
      result?.meta?.requestStatus ===
      "fulfilled"
    ) {
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };

  return (
    <div className={styles.actionsWrapper}>
      {/* SUCCESS ALERT */}
      {showSuccess && (
        <div className={styles.successAlert}>
          {/* TOP TIMER LINE */}
          <div
            className={styles.alertProgress}
          ></div>

          <div className={styles.alertContent}>
            <div className={styles.alertLeft}>
              <FaCheckCircle
                className={styles.alertIcon}
              />

              <div>
                <h4>Success</h4>

                <p>
                  Shipment marked as delivered
                </p>
              </div>
            </div>

            <button
              className={styles.closeAlert}
              onClick={() =>
                setShowSuccess(false)
              }
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      <div className={styles.actionsCard}>
        <h3 className={styles.cardTitle}>
          Shipment Actions
        </h3>

        <div className={styles.actionsRow}>
          <button
            className={styles.deliverBtn}
            onClick={handleMarkDelivered}
            disabled={
              isDelivered ||
              markDeliveredLoading
            }
          >
            <FaTruck />

            {markDeliveredLoading
              ? "Updating..."
              : isDelivered
              ? "Already Delivered"
              : "Mark as Delivered"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminShipmentActionsCard;