import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

/* =========================
   GET BUYER ALL ORDERS
========================= */

export const getBuyerOrdersThunk = createAsyncThunk(
  "buyerOrders/getBuyerOrders",

  async ({ page = 1, limit = 3, filter = "all" }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.get(`${API_URL}/api/orders/buyer-orders`, {
        params: {
          page,
          limit,
          filter,
        },

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch buyer orders",
      );
    }
  },
);

export const cancelBuyerOrderThunk = createAsyncThunk(
  "buyerOrders/cancelBuyerOrder",

  async ({ orderId, cancellationReason }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.put(
        `${API_URL}/api/orders/buyer-orders/${orderId}/cancel`,
        {
          cancellationReason,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to cancel order",
      );
    }
  },
);
