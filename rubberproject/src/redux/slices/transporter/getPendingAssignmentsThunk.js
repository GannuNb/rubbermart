import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const API = process.env.REACT_APP_API_URL;

/* =========================
   GET PENDING ASSIGNMENTS
========================= */

export const getPendingAssignmentsThunk = createAsyncThunk(
  "transporter/getPendingAssignments",

  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await axios.get(
        `${API}/api/orders/transporter/pending-assignments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.assignments;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch assignments",
      );
    }
  },
);
