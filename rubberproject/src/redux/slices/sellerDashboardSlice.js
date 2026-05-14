import { createSlice } from "@reduxjs/toolkit";

import {
  getSellerDashboardStatsThunk,
  getSellerOrdersOverviewThunk,
  getRecentSellerOrdersThunk,
  getSellerPendingProductsThunk,
  getTopSellingProductsThunk,
} from "./sellerDashboardThunk";

const initialState = {
  /* =========================
     STATS
  ========================= */

  stats: {
    totalProducts: 0,
    approvedProducts: 0,
    pendingProducts: 0,
    totalOrders: 0,
  },

  statsLoading: false,
  statsError: null,

  /* =========================
     ORDERS OVERVIEW
  ========================= */

  ordersOverview: {
    graphData: [],

    summary: {
      totalOrders: 0,
      completedOrders: 0,
      pendingOrders: 0,
      partialShipmentOrders: 0,
    },
  },

  ordersOverviewLoading: false,
  ordersOverviewError: null,
  recentOrders: [],

  recentOrdersLoading: false,
  recentOrdersError: null,

  /* =========================
   PENDING PRODUCTS
========================= */

  pendingProducts: [],

  pendingProductsLoading: false,

  pendingProductsError: null,

  /* =========================
   TOP SELLING PRODUCTS
========================= */

  topSellingProducts: [],

  topSellingProductsLoading: false,

  topSellingProductsError: null,
};

const sellerDashboardSlice = createSlice({
  name: "sellerDashboard",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* =========================
           GET STATS
        ========================= */

      .addCase(getSellerDashboardStatsThunk.pending, (state) => {
        state.statsLoading = true;

        state.statsError = null;
      })

      .addCase(getSellerDashboardStatsThunk.fulfilled, (state, action) => {
        state.statsLoading = false;

        state.stats = action.payload;
      })

      .addCase(getSellerDashboardStatsThunk.rejected, (state, action) => {
        state.statsLoading = false;

        state.statsError = action.payload;
      })

      /* =========================
           ORDERS OVERVIEW
        ========================= */

      .addCase(getSellerOrdersOverviewThunk.pending, (state) => {
        state.ordersOverviewLoading = true;

        state.ordersOverviewError = null;
      })

      .addCase(getSellerOrdersOverviewThunk.fulfilled, (state, action) => {
        state.ordersOverviewLoading = false;

        state.ordersOverview.graphData = action.payload.graphData;

        state.ordersOverview.summary = action.payload.summary;
      })

      .addCase(getSellerOrdersOverviewThunk.rejected, (state, action) => {
        state.ordersOverviewLoading = false;

        state.ordersOverviewError = action.payload;
      })

      /* =========================
           RECENT ORDERS
        ========================= */

      .addCase(getRecentSellerOrdersThunk.pending, (state) => {
        state.recentOrdersLoading = true;

        state.recentOrdersError = null;
      })

      .addCase(getRecentSellerOrdersThunk.fulfilled, (state, action) => {
        state.recentOrdersLoading = false;

        state.recentOrders = action.payload;
      })

      .addCase(getRecentSellerOrdersThunk.rejected, (state, action) => {
        state.recentOrdersLoading = false;

        state.recentOrdersError = action.payload;
      })

      /* =========================
           PENDING PRODUCTS
        ========================= */

      .addCase(getSellerPendingProductsThunk.pending, (state) => {
        state.pendingProductsLoading = true;

        state.pendingProductsError = null;
      })

      .addCase(getSellerPendingProductsThunk.fulfilled, (state, action) => {
        state.pendingProductsLoading = false;

        state.pendingProducts = action.payload;
      })

      .addCase(getSellerPendingProductsThunk.rejected, (state, action) => {
        state.pendingProductsLoading = false;

        state.pendingProductsError = action.payload;
      })

      /* =========================
           TOP SELLING PRODUCTS
        ========================= */

      .addCase(getTopSellingProductsThunk.pending, (state) => {
        state.topSellingProductsLoading = true;

        state.topSellingProductsError = null;
      })

      .addCase(getTopSellingProductsThunk.fulfilled, (state, action) => {
        state.topSellingProductsLoading = false;

        state.topSellingProducts = action.payload;
      })

      .addCase(getTopSellingProductsThunk.rejected, (state, action) => {
        state.topSellingProductsLoading = false;

        state.topSellingProductsError = action.payload;
      });
  },
});

export default sellerDashboardSlice.reducer;
