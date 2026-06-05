import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const API = process.env.REACT_APP_API_URL;

/* =========================
   ASSIGN TRANSPORTER
========================= */

export const assignTransporterToShipment = createAsyncThunk(
  "adminOrders/assignTransporterToShipment",

  async (
    {
      orderId,

      shipmentId,

      quoteId,
    },
    thunkAPI,
  ) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.put(
        `${API}/api/orders/admin/${orderId}/shipment/${shipmentId}/assign-transporter/${quoteId}`,
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
        error.response?.data?.message || "Failed to assign transporter",
      );
    }
  },
);
