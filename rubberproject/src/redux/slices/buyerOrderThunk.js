import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL;

/* =========================
   GET BUYER SINGLE ORDER
========================= */

export const getBuyerSingleOrderThunk =
  createAsyncThunk(
    "buyerOrders/getBuyerSingleOrder",
    async (orderId, thunkAPI) => {
      try {
        const token =
          thunkAPI.getState().auth.token;

        const response =
          await axios.get(
            `${API_URL}/api/orders/buyer-orders/${orderId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        return response.data.order;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch buyer order details"
        );
      }
    }
  );


  export const downloadProformaInvoiceThunk =
  (orderId) => async (dispatch, getState) => {
    try {
      const token = getState().auth.token;

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/orders/buyer-orders/${orderId}/proforma-invoice`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Proforma-Invoice-${orderId}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Download Invoice Error:", error);
    }
  };