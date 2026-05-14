// src/redux/slices/buyerProductSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchApprovedProducts,
  fetchRecommendedProducts,
  fetchFeaturedProducts,
} from "./buyerProductThunk";

const initialState = {
  approvedProducts: [],
  approvedProductsLoading: false,
  approvedProductsError: null,

  recommendedProducts: [],
  recommendedProductsLoading: false,
  recommendedProductsError: null,

  featuredProducts: [],
  featuredProductsLoading: false,
  featuredProductsError: null,
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
      })

      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.featuredProductsLoading = true;

        state.featuredProductsError = null;
      })

      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProductsLoading = false;

        state.featuredProducts = action.payload;
      })

      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.featuredProductsLoading = false;

        state.featuredProductsError = action.payload;
      })

      .addCase(fetchRecommendedProducts.pending, (state) => {
        state.recommendedProductsLoading = true;

        state.recommendedProductsError = null;
      })

      .addCase(fetchRecommendedProducts.fulfilled, (state, action) => {
        state.recommendedProductsLoading = false;

        state.recommendedProducts = action.payload;
      })

      .addCase(fetchRecommendedProducts.rejected, (state, action) => {
        state.recommendedProductsLoading = false;

        state.recommendedProductsError = action.payload;
      });
  },
});

export default buyerProductSlice.reducer;
