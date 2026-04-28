import { createSlice } from "@reduxjs/toolkit";

import {
  getBuyerSingleOrderThunk,
} from "./buyerOrderThunk";

import {
  getBuyerOrdersThunk,
} from "./getBuyerOrdersThunk";

const initialState = {
  /* =========================
     ALL BUYER ORDERS
  ========================= */

  orders: [],
  ordersLoading: false,
  ordersError: null,

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
    clearBuyerSingleOrder: (
      state
    ) => {
      state.singleOrder = null;
      state.singleOrderError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* =========================
         GET BUYER ALL ORDERS
      ========================= */

      .addCase(
        getBuyerOrdersThunk.pending,
        (state) => {
          state.ordersLoading = true;
          state.ordersError = null;
        }
      )

      .addCase(
        getBuyerOrdersThunk.fulfilled,
        (state, action) => {
          state.ordersLoading = false;
          state.orders =
            action.payload || [];
        }
      )

      .addCase(
        getBuyerOrdersThunk.rejected,
        (state, action) => {
          state.ordersLoading = false;
          state.ordersError =
            action.payload;
        }
      )

      /* =========================
         GET BUYER SINGLE ORDER
      ========================= */

      .addCase(
        getBuyerSingleOrderThunk.pending,
        (state) => {
          state.singleOrderLoading =
            true;

          state.singleOrderError =
            null;
        }
      )

      .addCase(
        getBuyerSingleOrderThunk.fulfilled,
        (state, action) => {
          state.singleOrderLoading =
            false;

          state.singleOrder =
            action.payload || null;
        }
      )

      .addCase(
        getBuyerSingleOrderThunk.rejected,
        (state, action) => {
          state.singleOrderLoading =
            false;

          state.singleOrderError =
            action.payload;
        }
      );
  },
});

export const {
  clearBuyerSingleOrder,
} = buyerOrderSlice.actions;

export default buyerOrderSlice.reducer;