// src/redux/slices/buyerProductSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { fetchApprovedProducts } from "./buyerProductThunk";

const initialState = {
  approvedProducts: [],
  approvedProductsLoading: false,
  approvedProductsError: null,
};

const buyerProductSlice = createSlice({
  name: "buyerProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApprovedProducts.pending, (state) => {
        state.approvedProductsLoading = true;
        state.approvedProductsError = null;
      })
      .addCase(fetchApprovedProducts.fulfilled, (state, action) => {
        state.approvedProductsLoading = false;
        state.approvedProducts = action.payload;
      })
      .addCase(fetchApprovedProducts.rejected, (state, action) => {
        state.approvedProductsLoading = false;
        state.approvedProductsError = action.payload;
      });
  },
});

export default buyerProductSlice.reducer;