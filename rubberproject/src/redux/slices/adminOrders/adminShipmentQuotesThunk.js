import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const API = process.env.REACT_APP_API_URL;

/* =========================
   GET SHIPMENT QUOTES
========================= */

export const getShipmentQuotes = createAsyncThunk(
  "adminOrders/getShipmentQuotes",

  async (shipmentId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.get(
        `${API}/api/orders/admin/shipment/${shipmentId}/quotes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return {
        shipmentId,

        quotes: response.data.quotes,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch shipment quotes",
      );
    }
  },
);
