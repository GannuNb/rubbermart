// src/redux/slices/transporter/transporterThunk.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

/* =========================
   GET OPEN MARKETPLACE SHIPMENTS
========================= */

export const getOpenTransportShipmentsThunk = createAsyncThunk(
  "transporter/getOpenShipments",

  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.get(
        `${API_URL}/api/orders/transporter/open-shipments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.shipments;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch shipments",
      );
    }
  },
);

/* =========================
   SUBMIT TRANSPORT QUOTE
========================= */

export const submitTransportQuoteThunk = createAsyncThunk(
  "transporter/submitQuote",

  async ({ orderId, shipmentId, quoteData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.post(
        `${API_URL}/api/orders/transporter/${orderId}/shipment/${shipmentId}/quote`,
        quoteData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return {
        shipmentId,

        data: response.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to submit quote",
      );
    }
  },
);

/* =========================
   GET TRANSPORTER QUOTES
========================= */

export const getTransporterQuotesThunk = createAsyncThunk(
  "transporter/getMyQuotes",

  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.get(
        `${API_URL}/api/orders/transporter/my-quotes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.quotes;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch quotes",
      );
    }
  },
);
