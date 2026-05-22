import { createSlice } from "@reduxjs/toolkit";

import { getBuyerSingleOrderThunk } from "./buyerOrderThunk";

import { getBuyerOrdersThunk } from "./getBuyerOrdersThunk";

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
      });
  },
});

export const { clearBuyerSingleOrder } = buyerOrderSlice.actions;

export default buyerOrderSlice.reducer;
