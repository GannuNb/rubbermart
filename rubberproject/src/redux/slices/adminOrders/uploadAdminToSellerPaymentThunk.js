import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export const uploadAdminToSellerPayment =
  createAsyncThunk(
    "adminOrders/uploadAdminToSellerPayment",

    async (
      {
        orderId,
        amount,
        paymentMode,
        transactionId,
        note,
        file,
      },
      { rejectWithValue, getState }
    ) => {
      try {
        const token =
          getState().auth.token;

        const formData =
          new FormData();

        formData.append(
          "amount",
          amount
        );

        formData.append(
          "paymentMode",
          paymentMode
        );

        formData.append(
          "transactionId",
          transactionId
        );

        formData.append(
          "note",
          note
        );

        if (file) {
          formData.append(
            "file",
            file
          );
        }

        const { data } =
          await axios.post(
            `${API}/api/orders/admin/${orderId}/seller-payment`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        return data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to upload seller payment"
        );
      }
    }
  );