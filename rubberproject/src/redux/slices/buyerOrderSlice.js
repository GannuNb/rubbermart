import { createSlice } from "@reduxjs/toolkit";

import { getBuyerSingleOrderThunk } from "./buyerOrderThunk";

import {
  getBuyerOrdersThunk,
  cancelBuyerOrderThunk,
} from "./getBuyerOrdersThunk";
import { uploadTransportPaymentThunk } from "./buyer/uploadTransportPaymentThunk";

const initialState = {
  /* =========================
     ALL BUYER ORDERS
  ========================= */

  orders: [],
  ordersLoading: false,
  ordersError: null,

  /* =========================
     PAGINATION
  ========================= */

  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 3,
  },

  /* =========================
     SINGLE BUYER ORDER
  ========================= */

  singleOrder: null,
  singleOrderLoading: false,
  singleOrderError: null,

  cancelOrderLoading: false,
  cancelOrderError: null,
  cancelOrderSuccess: null,

  transportPaymentUploadLoading: false,

  transportPaymentUploadError: null,

  transportPaymentUploadSuccess: null,
};

const buyerOrderSlice = createSlice({
  name: "buyerOrders",

  initialState,

  reducers: {
    clearBuyerSingleOrder: (state) => {
      state.singleOrder = null;

      state.singleOrderError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* =========================
         GET BUYER ALL ORDERS
      ========================= */

      .addCase(getBuyerOrdersThunk.pending, (state) => {
        state.ordersLoading = true;

        state.ordersError = null;
      })

      .addCase(getBuyerOrdersThunk.fulfilled, (state, action) => {
        state.ordersLoading = false;

        /* =========================
             ORDERS
          ========================= */

        state.orders = action.payload.orders || [];

        /* =========================
             PAGINATION
          ========================= */

        state.pagination = action.payload.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalOrders: 0,
          limit: 3,
        };
      })

      .addCase(getBuyerOrdersThunk.rejected, (state, action) => {
        state.ordersLoading = false;

        state.ordersError = action.payload;
      })

      /* =========================
         GET BUYER SINGLE ORDER
      ========================= */

      .addCase(getBuyerSingleOrderThunk.pending, (state) => {
        state.singleOrderLoading = true;

        state.singleOrderError = null;
      })

      .addCase(getBuyerSingleOrderThunk.fulfilled, (state, action) => {
        state.singleOrderLoading = false;

        state.singleOrder = action.payload || null;
      })

      .addCase(getBuyerSingleOrderThunk.rejected, (state, action) => {
        state.singleOrderLoading = false;

        state.singleOrderError = action.payload;
      })

      /* =========================
            CANCEL ORDER
          ========================= */

      .addCase(cancelBuyerOrderThunk.pending, (state) => {
        state.cancelOrderLoading = true;

        state.cancelOrderError = null;

        state.cancelOrderSuccess = null;
      })

      .addCase(cancelBuyerOrderThunk.fulfilled, (state, action) => {
        state.cancelOrderLoading = false;

        state.cancelOrderSuccess = "Order cancelled successfully";

        /* =========================
     UPDATE ORDER LIST
  ========================= */

        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order,
        );

        /* =========================
     UPDATE SINGLE ORDER
  ========================= */

        if (state.singleOrder && state.singleOrder._id === action.payload._id) {
          state.singleOrder = action.payload;
        }
      })

      .addCase(cancelBuyerOrderThunk.rejected, (state, action) => {
        state.cancelOrderLoading = false;

        state.cancelOrderError = action.payload;
      })
      .addCase(uploadTransportPaymentThunk.pending, (state) => {
        state.transportPaymentUploadLoading = true;

        state.transportPaymentUploadError = null;

        state.transportPaymentUploadSuccess = null;
      })

      .addCase(uploadTransportPaymentThunk.fulfilled, (state, action) => {
        state.transportPaymentUploadLoading = false;

        state.transportPaymentUploadSuccess = action.payload.message;

        state.singleOrder = action.payload.order;
      })

      .addCase(uploadTransportPaymentThunk.rejected, (state, action) => {
        state.transportPaymentUploadLoading = false;

        state.transportPaymentUploadError = action.payload;
      });
  },
});

export const { clearBuyerSingleOrder } = buyerOrderSlice.actions;

export default buyerOrderSlice.reducer;
