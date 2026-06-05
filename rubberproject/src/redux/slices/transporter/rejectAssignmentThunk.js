import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const API =
  process.env.REACT_APP_API_URL;

/* =========================
   REJECT ASSIGNMENT
========================= */

export const rejectAssignmentThunk =
  createAsyncThunk(
    "transporter/rejectAssignment",

    async (
      {
        orderId,

        shipmentId,
      },
      thunkAPI,
    ) => {
      try {
        const token =
          thunkAPI.getState()
            .auth.token;

        const response =
          await axios.put(
            `${API}/api/orders/transporter/${orderId}/shipment/${shipmentId}/reject-assignment`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

        return {
          shipmentId,

          data:
            response.data,
        };
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to reject assignment",
        );
      }
    },
  );