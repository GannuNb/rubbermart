import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";

import styles from "../../../styles/Admin/AdminAllInvoices.module.css";

const AdminInvoicesTable = ({ order, itemName }) => {
  const shipments =
    order?.shipments?.filter(
      (shipment) => shipment?.selectedItem === itemName,
    ) || [];
  const navigate = useNavigate();
  return (
    <div className={styles.tableWrapper}>
      {/* Header */}
      <div className={styles.tableHeader}>
        <div>Shipment ID</div>
        <div>Vehicle No</div>
        <div>Driver Name</div>
        <div>Shipped Qty</div>
        <div>Shipment From</div>
        <div>Status</div>
        <div>Action</div>
      </div>

      {/* Empty State */}
      {shipments.length === 0 && (
        <div className={styles.emptyState}>
          No shipments found for this item
        </div>
      )}

      {/* Rows */}
      {shipments.map((item, index) => (
        <div key={index} className={styles.tableRow}>
          <div>{item?.shipmentInvoiceId || "-"}</div>

          <div>{item?.vehicleNumber || "-"}</div>

          <div>{item?.driverName || "-"}</div>

          <div>{item?.shippedQuantity || 0} MT</div>

          <div>{item?.shipmentFrom || "-"}</div>

          <div>
            <span className={styles.statusPill}>
              {item?.shipmentStatus || "-"}
            </span>
          </div>

          <div>
            <button
              className={styles.viewBtn}
              onClick={() =>
                navigate(
                  `/admin/order/${order?._id}/shipping-invoice/${item?._id}`,
                )
              }
            >
              <FaEye />
              View Shipping
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminInvoicesTable;
