import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const approveShipmentByAdmin =
  createAsyncThunk(
    "adminOrders/approveShipmentByAdmin",
    async (
      { orderId, shipmentId },
      thunkAPI
    ) => {
      try {
        const token =
          localStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } =
          await axios.put(
            `${process.env.REACT_APP_API_URL}/api/orders/admin/${orderId}/shipment/${shipmentId}/approve`,
            {},
            config
          );

        return data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error?.response?.data?.message ||
            "Failed to approve shipment"
        );
      }
    }
  );

export default approveShipmentByAdmin;