import React, { useState } from "react";
import { FaTruck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { markShipmentDeliveredByAdmin } from "../../../redux/slices/adminOrders/markShipmentDeliveredThunk";
import styles from "../../../styles/Admin/AdminSingleShippingInvoice.module.css";
// 🟢 Imported your reusable CustomAlert
import CustomAlert from "../../alert/CustomAlert";

const AdminShipmentActionsCard = ({ shipment, order }) => {
  const dispatch = useDispatch();
  
  // 🟢 State to manage the alert object (null = no alert)
  const [alert, setAlert] = useState(null);

  const { singleOrder, markDeliveredLoading } = useSelector(
    (state) => state.adminOrders
  );

  const latestShipment =
    singleOrder?.shipments?.find((item) => item?._id === shipment?._id) || shipment;

  const isDelivered = latestShipment?.shipmentStatus === "delivered";
  
  // 🟢 Logic: Define valid states that allow moving to 'delivered'
  const canMarkDelivered = ["shipped", "in_transit"].includes(latestShipment?.shipmentStatus);

  const handleMarkDelivered = async () => {
    const result = await dispatch(
      markShipmentDeliveredByAdmin({
        orderId: order?._id,
        shipmentId: shipment?._id,
      })
    );

    if (result?.meta?.requestStatus === "fulfilled") {
      setAlert({
        type: "success",
        title: "Success",
        message: "Shipment marked as delivered"
      });
    } else {
      setAlert({
        type: "error",
        title: "Action Failed",
        message: result.payload || "Could not mark as delivered"
      });
    }
  };

  return (
    <div className={styles.actionsWrapper}>
      {/* 🟢 Render CustomAlert dynamically */}
      {alert && (
        <CustomAlert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className={styles.actionsCard}>
        <h3 className={styles.cardTitle}>Shipment Actions</h3>

        <div className={styles.actionsRow}>
          <button
            className={styles.deliverBtn}
            onClick={handleMarkDelivered}
            // 🟢 Button is disabled if processing, already done, or workflow step not met
            disabled={
              markDeliveredLoading || 
              isDelivered || 
              !canMarkDelivered
            }
          >
            <FaTruck />
            {markDeliveredLoading
              ? "Updating..."
              : isDelivered
              ? "Already Delivered"
              : !canMarkDelivered
              ? "Awaiting Shipment"
              : "Mark as Delivered"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminShipmentActionsCard;