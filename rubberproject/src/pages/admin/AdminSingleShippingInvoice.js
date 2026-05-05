// src/pages/admin/AdminSingleShippingInvoice.js

import React, { useEffect } from "react";
import {  FaArrowLeft,} from "react-icons/fa";
import {  useNavigate,  useParams,} from "react-router-dom";
import {  useDispatch,  useSelector,} from "react-redux";

import AdminShipmentTopCard from "../../components/admin/AdminSingleShipping/AdminShipmentTopCard";
import AdminShipmentProductCard from "../../components/admin/AdminSingleShipping/AdminShipmentProductCard";
import AdminDriverDetailsCard from "../../components/admin/AdminSingleShipping/AdminDriverDetailsCard";
import AdminShipmentSummaryCard from "../../components/admin/AdminSingleShipping/AdminShipmentSummaryCard";
import AdminShipmentActionsCard from "../../components/admin/AdminSingleShipping/AdminShipmentActionsCard";

import {  getAdminSingleOrderDetails,} from "../../redux/slices/adminOrders/adminSingleOrderThunk";

import styles from "../../styles/Admin/AdminSingleShippingInvoice.module.css";

const AdminSingleShippingInvoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {orderId,shipmentId,} = useParams();

  const {singleOrder,singleOrderLoading,singleOrderError,} = useSelector((state) => state.adminOrders );

  const order = singleOrder;

  /* =========================
     FETCH FRESH ORDER
  ========================= */

  useEffect(() => {
    if (orderId) {
      dispatch(
        getAdminSingleOrderDetails(
          orderId
        )
      );
    }
  }, [dispatch, orderId]);

  /* =========================
     FIND SHIPMENT
  ========================= */

  const shipment =
    order?.shipments?.find(
      (item) =>
        item?._id === shipmentId
    );

  /* =========================
     LOADING
  ========================= */

  if (singleOrderLoading) {
    return (
      <div className={styles.container}>
        Loading shipment details...
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (singleOrderError) {
    return (
      <div className={styles.container}>
        {singleOrderError}
      </div>
    );
  }

  /* =========================
     SAFETY CHECK
  ========================= */

  if (!shipment || !order) {
    return (
      <div className={styles.container}>
        <div
          className={
            styles.emptyState
          }
        >
          Shipment details not found
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* PAGE HEADER */}

      <div
        className={
          styles.pageHeader
        }
      >
        <h1
          className={
            styles.mainTitle
          }
        >
          Admin Orders
        </h1>

        <div
          className={
            styles.adminProfile
          }
        >
          <div
            className={
              styles.avatar
            }
          ></div>

          <span>Admin</span>
        </div>
      </div>

      {/* BREADCRUMB */}

      <div
        className={
          styles.breadcrumb
        }
      >
        <span>Orders</span>
        <span>{">"}</span>

        <span>All Orders</span>
        <span>{">"}</span>

        <span>
          Order Details
        </span>
        <span>{">"}</span>

        <span>
          All Invoices
        </span>
        <span>{">"}</span>

        <span>
          Shipping Details
        </span>
      </div>

      {/* BACK */}

      <div
        className={
          styles.backSection
        }
      >
        <button
          className={
            styles.backBtn
          }
          onClick={() =>
            navigate(-1)
          }
        >
          <FaArrowLeft />
        </button>

        <h2 className={styles.sectionTitle}>
          Shipping Details
          <div className={styles.idRow}>
            <span>
              Order Id: {order?.orderId || orderId}
            </span>
            {/* <span>
              Invoice: {shipment?.shipmentInvoiceId || shipmentId}
            </span> */}
          </div>
        </h2>
      </div>

      {/* TOP CARD */}

      <AdminShipmentTopCard
        shipment={shipment}
        order={order}
      />

      {/* PRODUCT CARD */}

      <AdminShipmentProductCard
        shipment={shipment}
        order={order}
      />

      {/* BOTTOM GRID */}

      <div
        className={
          styles.bottomGrid
        }
      >
        <AdminDriverDetailsCard
          shipment={shipment}
        />

        <AdminShipmentSummaryCard
          shipment={shipment}
        />
      </div>

      {/* ACTIONS */}

      <AdminShipmentActionsCard
        shipment={shipment}
        order={order}
      />
    </div>
  );
};

export default AdminSingleShippingInvoice;