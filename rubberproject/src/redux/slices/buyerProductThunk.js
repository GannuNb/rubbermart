import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchApprovedProducts = createAsyncThunk(
  "buyerProducts/fetchApprovedProducts",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/buyer-products/approved`
      );

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to fetch approved products"
        );
      }

      return data.products;
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);