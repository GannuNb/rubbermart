import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const API = process.env.REACT_APP_API_URL;

/* =========================
   GET COMPLETED DELIVERIES
========================= */

export const getCompletedDeliveriesThunk = createAsyncThunk(
  "transporter/getCompletedDeliveries",

  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.get(
        `${API}/api/orders/transporter/completed-deliveries`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.completedDeliveries || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch completed deliveries",
      );
    }
  },
);
