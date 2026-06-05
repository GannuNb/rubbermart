import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const API = process.env.REACT_APP_API_URL;

/* =========================
   GET ALL TRANSPORTERS
========================= */

export const getAllTransporters = createAsyncThunk(
  "adminOrders/getAllTransporters",

  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.get(`${API}/api/orders/admin/transporters`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.transporters;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch transporters",
      );
    }
  },
);
