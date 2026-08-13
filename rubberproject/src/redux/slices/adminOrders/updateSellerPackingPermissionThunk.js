import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export const updateSellerPackingPermission = createAsyncThunk(
  "adminOrders/updateSellerPackingPermission",

  async (
    { orderId, sellerPackingPermission },
    { rejectWithValue, getState },
  ) => {
    try {
      const token = getState().auth.token;

      const { data } = await axios.put(
        `${API}/api/orders/admin/${orderId}/packing-permission`,
        {
          sellerPackingPermission,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update seller packing permission",
      );
    }
  },
);