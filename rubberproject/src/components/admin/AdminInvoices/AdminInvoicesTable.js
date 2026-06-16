import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";

import styles from "../../../styles/Admin/AdminAllInvoices.module.css";

const AdminInvoicesTable = ({ order, itemName }) => {
  const navigate = useNavigate();

  const shipments =
    order?.shipments?.filter(
      (shipment) => shipment?.selectedItem === itemName,
    ) || [];

  return (
    <div className={styles.tableWrapper}>
      {/* =========================
          TABLE HEADER
      ========================= */}
      <div className={styles.tableHeader}>
        <div>Shipment ID</div>

        <div>Transport Status</div>

        <div>Transporter</div>

        <div>Shipped Qty</div>

        <div>Shipment From</div>

        <div>Status</div>

        <div>Action</div>
      </div>

      {/* =========================
          EMPTY STATE
      ========================= */}
      {shipments.length === 0 && (
        <div className={styles.emptyState}>
          No shipments found for this item
        </div>
      )}

      {/* =========================
          TABLE ROWS
      ========================= */}
      {shipments.map((item, index) => (
        <div
          key={item?._id || index}
          className={styles.tableRow}
          onClick={() =>
            navigate(`/admin/order/${order?._id}/shipping-invoice/${item?._id}`)
          }
          style={{ cursor: "pointer" }}
        >
          <div data-label="Shipment ID">{item?.shipmentInvoiceId || "-"}</div>

          <div data-label="Transport Status">
            {item?.transportStatus === "quotes_received"
              ? "Quotes Received"
              : item?.transportStatus === "transporter_assigned"
                ? "Assigned"
                : item?.transportStatus === "completed"
                  ? "Completed"
                  : "Open"}
          </div>

          <div data-label="Transporter">
            {item?.assignedTransporter?.fullName || "Not Assigned"}
          </div>

          <div data-label="Shipped Qty">{item?.shippedQuantity || 0} MT</div>

          <div data-label="Shipment From">{item?.shipmentFrom || "-"}</div>

          <div data-label="Status">
            <span className={styles.statusPill}>
              {item?.shipmentStatus || "-"}
            </span>
          </div>

          <div data-label="Action">
            <div className={styles.viewBtn}>
              <FaEye />
              View Shipping
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminInvoicesTable;
