import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const getSellerOrdersThunk = createAsyncThunk(
  "sellerOrders/getSellerOrders",
  async (page = 1, thunkAPI) => {
    try {
      // 1. Get token from Redux state safely
      const token = thunkAPI.getState().auth?.token;

      // 2. Perform the GET request with pagination query parameter
      const response = await axios.get(
        `${API_URL}/api/orders/seller-orders?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // 3. Return the payload (expects { orders, totalPages, currentPage })
      return response.data;
    } catch (error) {
      // 4. Handle errors gracefully by returning the server message or a fallback
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch orders. Please try again.",
      );
    }
  },
);

export const getSellerSingleOrderThunk = createAsyncThunk(
  "sellerOrders/getSellerSingleOrder",
  async (orderId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.get(
        `${API_URL}/api/orders/seller-orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch order details",
      );
    }
  },
);

export const confirmSellerOrderThunk = createAsyncThunk(
  "sellerOrders/confirmSellerOrder",
  async ({ orderId, transportMode }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.put(
        `${API_URL}/api/orders/seller-orders/${orderId}/confirm`,
        {
          transportMode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to confirm order",
      );
    }
  },
);

export const rejectSellerOrderThunk = createAsyncThunk(
  "sellerOrders/rejectSellerOrder",
  async ({ orderId, cancellationReason }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.put(
        `${API_URL}/api/orders/seller-orders/${orderId}/reject`,
        { cancellationReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to reject order",
      );
    }
  },
);

export const addShipmentToOrderThunk = createAsyncThunk(
  "sellerOrders/addShipmentToOrder",
  async ({ orderId, shipmentData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.post(
        `${API_URL}/api/orders/seller-orders/${orderId}/shipment`,
        shipmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data.shipments;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add shipment details",
      );
    }
  },
);

export const markShipmentDeliveredBySellerThunk = createAsyncThunk(
  "sellerOrders/markShipmentDeliveredBySeller",
  async ({ orderId, shipmentId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.put(
        `${API_URL}/api/orders/seller-orders/${orderId}/shipment/${shipmentId}/delivered`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark shipment delivered",
      );
    }
  },
);

export const markShipmentShippedBySellerThunk = createAsyncThunk(
  "sellerOrders/markShipmentShippedBySeller",

  async ({ orderId, shipmentId }, thunkAPI) => {
    try {
      const token =
        thunkAPI.getState().auth.token;

      const response =
        await axios.put(
          `${API_URL}/api/orders/seller-orders/${orderId}/shipment/${shipmentId}/shipped`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

      return response.data.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to mark shipment shipped",
      );
    }
  },
);
