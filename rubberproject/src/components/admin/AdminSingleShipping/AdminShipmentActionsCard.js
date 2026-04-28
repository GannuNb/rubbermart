import React from "react";
import {
  FaCheck,
  FaTruck,
} from "react-icons/fa";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  approveShipmentByAdmin,
} from "../../../redux/slices/adminOrders/approveShipmentThunk";

import {
  markShipmentDeliveredByAdmin,
} from "../../../redux/slices/adminOrders/markShipmentDeliveredThunk";

import styles from "../../../styles/Admin/AdminSingleShippingInvoice.module.css";

const AdminShipmentActionsCard = ({
  shipment,
  order,
}) => {
  const dispatch = useDispatch();

  const {
    singleOrder,
    approveShipmentLoading,
    markDeliveredLoading,
  } = useSelector(
    (state) => state.adminOrders
  );

  /* =========================
     ALWAYS GET LATEST SHIPMENT
  ========================= */

  const latestShipment =
    singleOrder?.shipments?.find(
      (item) => item?._id === shipment?._id
    ) || shipment;

  const isApproved =
    latestShipment?.approvedByAdmin === true;

  const isDelivered =
    latestShipment?.shipmentStatus ===
    "delivered";

  const handleApproveShipment = () => {
    dispatch(
      approveShipmentByAdmin({
        orderId: order?._id,
        shipmentId: shipment?._id,
      })
    );
  };

  const handleMarkDelivered = () => {
    dispatch(
      markShipmentDeliveredByAdmin({
        orderId: order?._id,
        shipmentId: shipment?._id,
      })
    );
  };

  return (
    <div className={styles.actionsCard}>
      <h3 className={styles.cardTitle}>
        Shipment Actions
      </h3>

      <div className={styles.actionsRow}>
        {/* Approve Shipment */}
        <button
          className={styles.approveBtn}
          onClick={handleApproveShipment}
          disabled={
            isApproved ||
            isDelivered ||
            approveShipmentLoading
          }
        >
          <FaCheck />

          {approveShipmentLoading
            ? "Approving..."
            : isApproved
            ? "Shipment Approved"
            : "Approve Shipment"}
        </button>

        {/* Mark Delivered */}
        <button
          className={styles.deliverBtn}
          onClick={handleMarkDelivered}
          disabled={
            !isApproved ||
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
  );
};

export default AdminShipmentActionsCard;