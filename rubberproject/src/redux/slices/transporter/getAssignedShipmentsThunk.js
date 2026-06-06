import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const API = process.env.REACT_APP_API_URL;

/* =========================
   GET ASSIGNED SHIPMENTS
========================= */

export const getAssignedShipmentsThunk = createAsyncThunk(
  "transporter/getAssignedShipments",

  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.get(
        `${API}/api/orders/transporter/assigned-shipments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.assignedShipments || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch assigned shipments",
      );
    }
  },
);
