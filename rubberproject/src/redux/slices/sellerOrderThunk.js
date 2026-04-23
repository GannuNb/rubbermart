import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const getSellerOrdersThunk = createAsyncThunk(
  "sellerOrders/getSellerOrders",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.get(
        `${API_URL}/api/orders/seller-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch seller orders"
      );
    }
  }
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
        }
      );

      return response.data.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch order details"
      );
    }
  }
);

export const confirmSellerOrderThunk = createAsyncThunk(
  "sellerOrders/confirmSellerOrder",
  async (orderId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.put(
        `${API_URL}/api/orders/seller-orders/${orderId}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to confirm order"
      );
    }
  }
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
        }
      );

      return response.data.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to reject order"
      );
    }
  }
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
        }
      );

      return response.data.shipments;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to add shipment details"
      );
    }
  }
);