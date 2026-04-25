import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export const approveBuyerPayment =
  createAsyncThunk(
    "adminOrders/approveBuyerPayment",

    async (
      { orderId, paymentId },
      { rejectWithValue, getState }
    ) => {
      try {
        const token =
          getState().auth.token;

        const { data } = await axios.put(
          `${API}/api/orders/admin/${orderId}/payment/${paymentId}/approve`,
          {},
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
            "Failed to approve payment"
        );
      }
    }
  );