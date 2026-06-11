import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const API = process.env.REACT_APP_API_URL;

/* =========================
   MARK SHIPPED
========================= */

export const markShipmentShippedThunk = createAsyncThunk(
  "transporter/markShipmentShipped",

  async (
    {
      orderId,

      shipmentId,
    },
    thunkAPI,
  ) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.put(
        `${API}/api/orders/transporter/${orderId}/shipment/${shipmentId}/shipped`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark shipment shipped",
      );
    }
  },
);
