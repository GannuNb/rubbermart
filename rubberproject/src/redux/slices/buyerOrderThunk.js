import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL;

/* =========================
   GET BUYER SINGLE ORDER
========================= */

export const getBuyerSingleOrderThunk =
  createAsyncThunk(
    "buyerOrders/getBuyerSingleOrder",
    async (orderId, thunkAPI) => {
      try {
        const token =
          thunkAPI.getState().auth.token;

        const response =
          await axios.get(
            `${API_URL}/api/orders/buyer-orders/${orderId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        return response.data.order;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch buyer order details"
        );
      }
    }
  );