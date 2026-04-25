import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export const getAdminSingleOrderDetails =
  createAsyncThunk(
    "adminOrders/getAdminSingleOrderDetails",

    async (orderId, { rejectWithValue, getState }) => {
      try {
        const token = getState().auth.token;

        const { data } = await axios.get(
          `${API}/api/orders/admin/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch order details"
        );
      }
    }
  );