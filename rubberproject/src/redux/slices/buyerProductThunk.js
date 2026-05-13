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


export const fetchRecommendedProducts = createAsyncThunk(
  "buyerProducts/fetchRecommendedProducts",

  async (_, thunkAPI) => {
    try {
      const token =
        thunkAPI.getState().auth.token;

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/buyer-products/recommended`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message ||
            "Failed to fetch recommended products"
        );
      }

      return data.products;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  "buyerProducts/fetchFeaturedProducts",

  async (_, thunkAPI) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/buyer-products/featured`
      );

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          data.message ||
            "Failed to fetch featured products"
        );
      }

      return data.products;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);