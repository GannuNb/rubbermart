import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

/* =========================
   GET DASHBOARD STATS
========================= */

export const getSellerDashboardStatsThunk = createAsyncThunk(
  "sellerDashboard/getStats",

  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.get(
        `${API_URL}/api/seller-dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.stats;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats",
      );
    }
  },
);

export const getSellerOrdersOverviewThunk = createAsyncThunk(
  "sellerDashboard/getOrdersOverview",

  async (filter = "7days", thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.get(
        `${API_URL}/api/seller-dashboard/orders-overview?filter=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders overview",
      );
    }
  },
);

export const getRecentSellerOrdersThunk = createAsyncThunk(
  "sellerDashboard/getRecentOrders",

  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.get(
        `${API_URL}/api/seller-dashboard/recent-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch recent orders",
      );
    }
  },
);

/* =========================
   PENDING PRODUCTS
========================= */

export const getSellerPendingProductsThunk = createAsyncThunk(
  "sellerDashboard/getPendingProducts",

  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.get(
        `${API_URL}/api/seller-dashboard/pending-products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.products;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending products",
      );
    }
  },
);

/* =========================
   TOP SELLING PRODUCTS
========================= */

export const getTopSellingProductsThunk = createAsyncThunk(
  "sellerDashboard/getTopSellingProducts",

  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.get(
        `${API_URL}/api/seller-dashboard/top-selling-products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.products;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch top selling products",
      );
    }
  },
);
