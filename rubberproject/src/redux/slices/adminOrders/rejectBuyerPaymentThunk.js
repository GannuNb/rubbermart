import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export const rejectBuyerPayment = createAsyncThunk(
  "adminOrders/rejectBuyerPayment",

  async ({ orderId, paymentId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.put(
        `${API}/api/orders/admin/${orderId}/payment/${paymentId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to reject payment"
      );
    }
  }
);