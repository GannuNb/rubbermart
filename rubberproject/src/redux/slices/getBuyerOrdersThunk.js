import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL;

/* =========================
   GET BUYER ALL ORDERS
========================= */

export const getBuyerOrdersThunk =
  createAsyncThunk(
    "buyerOrders/getBuyerOrders",
    async (_, thunkAPI) => {
      try {
        const token =
          thunkAPI.getState().auth.token;

        const response =
          await axios.get(
            `${API_URL}/api/orders/buyer-orders`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        return (
          response.data.orders || []
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch buyer orders"
        );
      }
    }
  );