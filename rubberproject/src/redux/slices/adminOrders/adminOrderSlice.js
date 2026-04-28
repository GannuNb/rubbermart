// src/redux/slices/adminOrders/adminOrderSlice.js

import { createSlice } from "@reduxjs/toolkit";

import { getAdminAllOrders } from "./adminOrderThunk";
import { getAdminSingleOrderDetails } from "./adminSingleOrderThunk";
import { approveBuyerPayment } from "./approveBuyerPaymentThunk";
import { uploadAdminToSellerPayment } from "./uploadAdminToSellerPaymentThunk";
import { approveShipmentByAdmin } from "./approveShipmentThunk";
import { markShipmentDeliveredByAdmin } from "./markShipmentDeliveredThunk";

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

  approveShipmentLoading: false,
  approveShipmentError: null,

  markDeliveredLoading: false,
  markDeliveredError: null,
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

    clearUploadSellerPaymentError: (
      state
    ) => {
      state.uploadSellerPaymentError =
        null;
    },

    clearApproveShipmentError: (
      state
    ) => {
      state.approveShipmentError =
        null;
    },

    clearMarkDeliveredError: (
      state
    ) => {
      state.markDeliveredError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* =========================
         GET ALL ORDERS
      ========================= */

      .addCase(
        getAdminAllOrders.pending,
        (state) => {
          state.adminOrdersLoading = true;
          state.adminOrdersError = null;
        }
      )

      .addCase(
        getAdminAllOrders.fulfilled,
        (state, action) => {
          state.adminOrdersLoading = false;

          state.orders =
            action.payload.orders || [];

          state.totalOrders =
            action.payload.totalOrders || 0;

          state.currentPage =
            action.payload.currentPage || 1;

          state.totalPages =
            action.payload.totalPages || 1;

          state.counts =
            action.payload.counts || {
              all: 0,
              pending: 0,
              delivered: 0,
              partialShipments: 0,
              cancelled: 0,
            };
        }
      )

      .addCase(
        getAdminAllOrders.rejected,
        (state, action) => {
          state.adminOrdersLoading = false;
          state.adminOrdersError =
            action.payload;
        }
      )

      /* =========================
         GET SINGLE ORDER
      ========================= */

      .addCase(
        getAdminSingleOrderDetails.pending,
        (state) => {
          state.singleOrderLoading = true;
          state.singleOrderError = null;
        }
      )

      .addCase(
        getAdminSingleOrderDetails.fulfilled,
        (state, action) => {
          state.singleOrderLoading = false;

          state.singleOrder =
            action.payload.order || null;
        }
      )

      .addCase(
        getAdminSingleOrderDetails.rejected,
        (state, action) => {
          state.singleOrderLoading = false;
          state.singleOrderError =
            action.payload;
        }
      )

      /* =========================
         APPROVE BUYER PAYMENT
      ========================= */

      .addCase(
        approveBuyerPayment.pending,
        (state) => {
          state.approvePaymentLoading = true;
          state.approvePaymentError = null;
        }
      )

      .addCase(
        approveBuyerPayment.fulfilled,
        (state, action) => {
          state.approvePaymentLoading = false;

          state.singleOrder =
            action.payload.order || null;
        }
      )

      .addCase(
        approveBuyerPayment.rejected,
        (state, action) => {
          state.approvePaymentLoading = false;
          state.approvePaymentError =
            action.payload;
        }
      )

      /* =========================
         ADMIN → SELLER PAYMENT
      ========================= */

      .addCase(
        uploadAdminToSellerPayment.pending,
        (state) => {
          state.uploadSellerPaymentLoading =
            true;

          state.uploadSellerPaymentError =
            null;
        }
      )

      .addCase(
        uploadAdminToSellerPayment.fulfilled,
        (state, action) => {
          state.uploadSellerPaymentLoading =
            false;

          state.singleOrder =
            action.payload.order || null;
        }
      )

      .addCase(
        uploadAdminToSellerPayment.rejected,
        (state, action) => {
          state.uploadSellerPaymentLoading =
            false;

          state.uploadSellerPaymentError =
            action.payload;
        }
      )

      /* =========================
         APPROVE SHIPMENT
      ========================= */

      .addCase(
        approveShipmentByAdmin.pending,
        (state) => {
          state.approveShipmentLoading =
            true;

          state.approveShipmentError =
            null;
        }
      )

      .addCase(
        approveShipmentByAdmin.fulfilled,
        (state, action) => {
          state.approveShipmentLoading =
            false;

          state.singleOrder =
            action.payload.order || null;
        }
      )

      .addCase(
        approveShipmentByAdmin.rejected,
        (state, action) => {
          state.approveShipmentLoading =
            false;

          state.approveShipmentError =
            action.payload;
        }
      )

      /* =========================
         MARK DELIVERED
      ========================= */

      .addCase(
        markShipmentDeliveredByAdmin.pending,
        (state) => {
          state.markDeliveredLoading =
            true;

          state.markDeliveredError =
            null;
        }
      )

      .addCase(
        markShipmentDeliveredByAdmin.fulfilled,
        (state, action) => {
          state.markDeliveredLoading =
            false;

          state.singleOrder =
            action.payload.order || null;
        }
      )

      .addCase(
        markShipmentDeliveredByAdmin.rejected,
        (state, action) => {
          state.markDeliveredLoading =
            false;

          state.markDeliveredError =
            action.payload;
        }
      );
  },
});

export const {
  clearAdminOrdersError,
  clearSingleOrderError,
  clearApprovePaymentError,
  clearUploadSellerPaymentError,
  clearApproveShipmentError,
  clearMarkDeliveredError,
} = adminOrderSlice.actions;

export default adminOrderSlice.reducer;