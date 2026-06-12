import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export const getAdminSingleOrderDetails = createAsyncThunk(
  "adminOrders/getAdminSingleOrderDetails",

  async (orderId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;

      const { data } = await axios.get(`${API}/api/orders/admin/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order details",
      );
    }
  },
);

export const verifyBuyerTransportPaymentThunk =
  ({ orderId, shipmentId, receiptId, action }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: "adminOrders/verifyBuyerTransportPaymentPending",
      });

      const token = getState().auth.token;

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/orders/admin/orders/${orderId}/shipment/${shipmentId}/transport-payment/${receiptId}/verify`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            action,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify payment");
      }

      dispatch({
        type: "adminOrders/verifyBuyerTransportPaymentSuccess",

        payload: data,
      });
    } catch (error) {
      console.log("Verify Buyer Transport Payment Error:", error);

      dispatch({
        type: "adminOrders/verifyBuyerTransportPaymentFail",

        payload: error.message,
      });
    }
  };
