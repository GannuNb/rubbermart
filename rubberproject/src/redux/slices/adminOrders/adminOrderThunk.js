// src/redux/slices/adminOrders/adminOrderThunk.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export const getAdminAllOrders = createAsyncThunk(
  "adminOrders/getAdminAllOrders",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
      status = "all",
      fromDate = "",
      toDate = "",
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const token = getState().auth.token;

      const { data } = await axios.get(
        `${API}/api/orders/admin/all-orders`,
        {
          params: {
            page,
            limit,
            search,
            status,
            fromDate,
            toDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch admin orders"
      );
    }
  }
);