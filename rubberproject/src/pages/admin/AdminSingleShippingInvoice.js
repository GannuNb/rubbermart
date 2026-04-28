import React from "react";
import {
  FaArrowLeft,
} from "react-icons/fa";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import AdminShipmentTopCard from "../../components/admin/AdminSingleShipping/AdminShipmentTopCard";
import AdminShipmentProductCard from "../../components/admin/AdminSingleShipping/AdminShipmentProductCard";
import AdminDriverDetailsCard from "../../components/admin/AdminSingleShipping/AdminDriverDetailsCard";
import AdminShipmentSummaryCard from "../../components/admin/AdminSingleShipping/AdminShipmentSummaryCard";
import AdminShipmentActionsCard from "../../components/admin/AdminSingleShipping/AdminShipmentActionsCard";

import styles from "../../styles/Admin/AdminSingleShippingInvoice.module.css";

const AdminSingleShippingInvoice = () => {
  const navigate = useNavigate();
  const { shipmentId } = useParams();
  const location = useLocation();

  const shipment =
    location.state?.shipment;

  const order =
    location.state?.order;

  /* =========================
     SAFETY CHECK
  ========================= */

  if (!shipment || !order) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          Shipment details not found
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className={styles.pageHeader}>
        <h1 className={styles.mainTitle}>
          Admin Orders
        </h1>

        <div className={styles.adminProfile}>
          <div className={styles.avatar}></div>
          <span>Admin</span>
        </div>
      </div>

      {/* =========================
          BREADCRUMB
      ========================= */}

      <div className={styles.breadcrumb}>
        <span>Orders</span>
        <span>{">"}</span>

        <span>All Orders</span>
        <span>{">"}</span>

        <span>Order Details</span>
        <span>{">"}</span>

        <span>All Invoices</span>
        <span>{">"}</span>

        <span>Shipping Details</span>
      </div>

      {/* =========================
          BACK
      ========================= */}

      <div className={styles.backSection}>
        <button
          className={styles.backBtn}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
        </button>

        <h2 className={styles.sectionTitle}>
          Shipping Details - Invoice{" "}
          {shipment?.shipmentInvoiceId ||
            shipmentId}
        </h2>
      </div>

      {/* =========================
          TOP CARD
      ========================= */}

      <AdminShipmentTopCard
        shipment={shipment}
        order={order}
      />

      {/* =========================
          PRODUCT CARD
      ========================= */}

      <AdminShipmentProductCard
        shipment={shipment}
        order={order}
      />

      {/* =========================
          BOTTOM GRID
      ========================= */}

      <div className={styles.bottomGrid}>
        <AdminDriverDetailsCard
          shipment={shipment}
        />

        <AdminShipmentSummaryCard
          shipment={shipment}
        />
      </div>

      {/* =========================
          ACTIONS
      ========================= */}

      <AdminShipmentActionsCard
        shipment={shipment}
        order={order}
      />
    </div>
  );
};

export default AdminSingleShippingInvoice;