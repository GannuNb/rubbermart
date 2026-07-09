import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchLoadingLocations = createAsyncThunk(
  "buyerProducts/fetchLoadingLocations",

  async (_, thunkAPI) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/buyer-products/loading-locations`
      );

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message || "Failed to fetch loading locations"
        );
      }

      return data.locations;
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);