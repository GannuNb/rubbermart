import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const API = process.env.REACT_APP_API_URL;

/* =========================
   UPLOAD TRANSPORT PAYMENT
========================= */

export const uploadTransportPaymentThunk = createAsyncThunk(
  "buyerOrders/uploadTransportPayment",

  async ({ orderId, shipmentId, formData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.post(
        `${API}/api/orders/buyer/${orderId}/shipment/${shipmentId}/upload-transport-payment`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to upload transport payment",
      );
    }
  },
);
