// src/redux/slices/adminOrders/adminOrderSlice.js

import { createSlice } from "@reduxjs/toolkit";

import { getAdminAllOrders } from "./adminOrderThunk";
import { getAdminSingleOrderDetails } from "./adminSingleOrderThunk";
import { approveBuyerPayment } from "./approveBuyerPaymentThunk";
import { uploadAdminToSellerPayment } from "./uploadAdminToSellerPaymentThunk";
import { markShipmentDeliveredByAdmin } from "./markShipmentDeliveredThunk";
import { getShipmentQuotes } from "./adminShipmentQuotesThunk";
import { assignTransporterToShipment } from "./assignTransporterThunk";
import { getAllTransporters } from "./getAllTransportersThunk";
import { adminDirectAssignTransporter } from "./adminDirectAssignTransporterThunk";
import { markShipmentShippedByAdminThunk } from "./markShipmentShippedByAdminThunk";

const initialState = {
  /* =========================
     ALL ORDERS
  ========================= */

  adminOrdersLoading: false,
  adminOrdersError: null,

  orders: [],
  totalOrders: 0,
  currentPage: 1,
  totalPages: 1,

  counts: {
    all: 0,
    pending: 0,
    delivered: 0,
    partialShipments: 0,
    cancelled: 0,
  },

  /* =========================
     SINGLE ORDER
  ========================= */

  singleOrderLoading: false,
  singleOrderError: null,
  singleOrder: null,

  /* =========================
     APPROVE BUYER PAYMENT
  ========================= */

  approvePaymentLoading: false,
  approvePaymentError: null,

  /* =========================
     ADMIN → SELLER PAYMENT
  ========================= */

  uploadSellerPaymentLoading: false,
  uploadSellerPaymentError: null,

  /* =========================
     SHIPMENT ACTIONS
  ========================= */

  markDeliveredLoading: false,
  markDeliveredError: null,

  /* =========================
   SHIPMENT QUOTES
========================= */

  shipmentQuotes: {},
  shipmentQuotesLoading: false,
  shipmentQuotesError: null,

  /* =========================
      ASSIGN TRANSPORTER
      ========================= */
  assignTransporterLoading: false,
  assignTransporterError: null,

  /* =========================
   TRANSPORTERS
  ========================= */
  transporters: [],
  transportersLoading: false,
  transportersError: null,

  /* =========================
   ADMIN DIRECT ASSIGN
========================= */

  directAssignLoading: false,

  directAssignError: null,

  markShipmentShippedLoading: false,

  markShipmentShippedError: null,

  activeShipmentId: null,
};

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,

  reducers: {
    clearAdminOrdersError: (state) => {
      state.adminOrdersError = null;
    },

    clearSingleOrderError: (state) => {
      state.singleOrderError = null;
    },

    clearApprovePaymentError: (state) => {
      state.approvePaymentError = null;
    },

    clearUploadSellerPaymentError: (state) => {
      state.uploadSellerPaymentError = null;
    },

    clearMarkDeliveredError: (state) => {
      state.markDeliveredError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* =========================
         GET ALL ORDERS
      ========================= */

      .addCase(getAdminAllOrders.pending, (state) => {
        state.adminOrdersLoading = true;
        state.adminOrdersError = null;
      })

      .addCase(getAdminAllOrders.fulfilled, (state, action) => {
        state.adminOrdersLoading = false;

        state.orders = action.payload.orders || [];

        state.totalOrders = action.payload.totalOrders || 0;

        state.currentPage = action.payload.currentPage || 1;

        state.totalPages = action.payload.totalPages || 1;

        state.counts = action.payload.counts || {
          all: 0,
          pending: 0,
          delivered: 0,
          partialShipments: 0,
          cancelled: 0,
        };
      })

      .addCase(getAdminAllOrders.rejected, (state, action) => {
        state.adminOrdersLoading = false;
        state.adminOrdersError = action.payload;
      })

      /* =========================
         GET SINGLE ORDER
      ========================= */

      .addCase(getAdminSingleOrderDetails.pending, (state) => {
        state.singleOrderLoading = true;
        state.singleOrderError = null;
      })

      .addCase(getAdminSingleOrderDetails.fulfilled, (state, action) => {
        state.singleOrderLoading = false;

        state.singleOrder = action.payload.order || null;
      })

      .addCase(getAdminSingleOrderDetails.rejected, (state, action) => {
        state.singleOrderLoading = false;
        state.singleOrderError = action.payload;
      })

      /* =========================
         APPROVE BUYER PAYMENT
      ========================= */

      .addCase(approveBuyerPayment.pending, (state) => {
        state.approvePaymentLoading = true;
        state.approvePaymentError = null;
      })

      .addCase(approveBuyerPayment.fulfilled, (state, action) => {
        state.approvePaymentLoading = false;

        state.singleOrder = action.payload.order || null;
      })

      .addCase(approveBuyerPayment.rejected, (state, action) => {
        state.approvePaymentLoading = false;
        state.approvePaymentError = action.payload;
      })

      /* =========================
         ADMIN → SELLER PAYMENT
      ========================= */

      .addCase(uploadAdminToSellerPayment.pending, (state) => {
        state.uploadSellerPaymentLoading = true;

        state.uploadSellerPaymentError = null;
      })

      .addCase(uploadAdminToSellerPayment.fulfilled, (state, action) => {
        state.uploadSellerPaymentLoading = false;

        state.singleOrder = action.payload.order || null;
      })

      .addCase(uploadAdminToSellerPayment.rejected, (state, action) => {
        state.uploadSellerPaymentLoading = false;

        state.uploadSellerPaymentError = action.payload;
      })

      /* =========================
            GET SHIPMENT QUOTES
        ========================= */

      .addCase(getShipmentQuotes.pending, (state) => {
        state.shipmentQuotesLoading = true;

        state.shipmentQuotesError = null;
      })

      .addCase(getShipmentQuotes.fulfilled, (state, action) => {
        state.shipmentQuotesLoading = false;

        state.shipmentQuotes[action.payload.shipmentId] = action.payload.quotes;
      })

      .addCase(getShipmentQuotes.rejected, (state, action) => {
        state.shipmentQuotesLoading = false;

        state.shipmentQuotesError = action.payload;
      })

      /* =========================
          ASSIGN TRANSPORTER
        ========================= */

      .addCase(assignTransporterToShipment.pending, (state) => {
        state.assignTransporterLoading = true;

        state.assignTransporterError = null;
      })

      .addCase(assignTransporterToShipment.fulfilled, (state, action) => {
        state.assignTransporterLoading = false;

        state.singleOrder = action.payload.order || null;
      })

      .addCase(assignTransporterToShipment.rejected, (state, action) => {
        state.assignTransporterLoading = false;

        state.assignTransporterError = action.payload;
      })

      /* =========================
   GET ALL TRANSPORTERS
========================= */

      .addCase(getAllTransporters.pending, (state) => {
        state.transportersLoading = true;

        state.transportersError = null;
      })

      .addCase(getAllTransporters.fulfilled, (state, action) => {
        state.transportersLoading = false;

        state.transporters = action.payload || [];
      })

      .addCase(getAllTransporters.rejected, (state, action) => {
        state.transportersLoading = false;

        state.transportersError = action.payload;
      })

      /* =========================
   ADMIN DIRECT ASSIGN
========================= */

      .addCase(adminDirectAssignTransporter.pending, (state) => {
        state.directAssignLoading = true;

        state.directAssignError = null;
      })

      .addCase(adminDirectAssignTransporter.fulfilled, (state, action) => {
        state.directAssignLoading = false;

        state.singleOrder = action.payload.order || null;
      })

      .addCase(adminDirectAssignTransporter.rejected, (state, action) => {
        state.directAssignLoading = false;

        state.directAssignError = action.payload;
      })

      /* =========================
         MARK DELIVERED 
      ========================= */

      .addCase(markShipmentDeliveredByAdmin.pending, (state) => {
        state.markDeliveredLoading = true;

        state.markDeliveredError = null;
      })

      .addCase(markShipmentDeliveredByAdmin.fulfilled, (state, action) => {
        state.markDeliveredLoading = false;

        state.singleOrder = action.payload.order || null;
      })

      .addCase(markShipmentDeliveredByAdmin.rejected, (state, action) => {
        state.markDeliveredLoading = false;

        state.markDeliveredError = action.payload;
      })

      /* =========================
    MARK SHIPPED BY ADMIN
========================= */

      .addCase(markShipmentShippedByAdminThunk.pending, (state, action) => {
        state.markShipmentShippedLoading = true;

        state.markShipmentShippedError = null;

        state.activeShipmentId = action.meta.arg.shipmentId;
      })

      .addCase(markShipmentShippedByAdminThunk.fulfilled, (state, action) => {
        state.markShipmentShippedLoading = false;

        state.activeShipmentId = null;

        const updatedOrder = action.payload.order;

        /* =========================
       UPDATE SINGLE ORDER
    ========================= */

        if (state.singleOrder?._id === updatedOrder._id) {
          state.singleOrder = updatedOrder;
        }
      })

      .addCase(markShipmentShippedByAdminThunk.rejected, (state, action) => {
        state.markShipmentShippedLoading = false;

        state.activeShipmentId = null;

        state.markShipmentShippedError = action.payload;
      });
  },
});

export const {
  clearAdminOrdersError,
  clearSingleOrderError,
  clearApprovePaymentError,
  clearUploadSellerPaymentError,
  clearMarkDeliveredError,
} = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
