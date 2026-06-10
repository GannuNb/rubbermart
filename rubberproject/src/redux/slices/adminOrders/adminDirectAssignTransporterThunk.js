import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const API =
  process.env.REACT_APP_API_URL;

/* =========================
   ADMIN DIRECT ASSIGN
========================= */

export const adminDirectAssignTransporter =
  createAsyncThunk(
    "adminOrders/adminDirectAssignTransporter",

    async (
      {
        orderId,

        shipmentId,

        transporterId,

        adminPrice,

        adminNote,
      },
      thunkAPI,
    ) => {
      try {
        const token =
          thunkAPI.getState()
            .auth.token;

        const response =
          await axios.put(
            `${API}/api/orders/admin/${orderId}/shipment/${shipmentId}/direct-assign`,
            {
              transporterId,

              adminPrice,

              adminNote,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to assign transporter",
        );
      }
    },
  );