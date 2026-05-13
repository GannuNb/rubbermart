// src/redux/slices/sellerProductSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addProductLoading: false,
  addProductError: null,
  addProductSuccess: null,

  pendingProducts: [],
  pendingProductsLoading: false,
  pendingProductsError: null,

  adminPendingProducts: [],
  adminPendingProductsLoading: false,
  adminPendingProductsError: null,

  approveProductLoading: false,
  approveProductLoadingId: null,
  approveProductSuccess: null,
  approveProductError: null,

  rejectProductLoading: false,
  rejectProductLoadingId: null,
  rejectProductSuccess: null,
  rejectProductError: null,
};

const sellerProductSlice = createSlice({
  name: "sellerProduct",
  initialState,
  reducers: {
    setAddProductLoading: (state, action) => {
      state.addProductLoading = action.payload;
    },
    setAddProductError: (state, action) => {
      state.addProductError = action.payload;
    },
    setAddProductSuccess: (state, action) => {
      state.addProductSuccess = action.payload;
    },

    setPendingProductsLoading: (state, action) => {
      state.pendingProductsLoading = action.payload;
    },
    setPendingProductsSuccess: (state, action) => {
      state.pendingProducts = action.payload;
    },
    setPendingProductsError: (state, action) => {
      state.pendingProductsError = action.payload;
    },

    setAdminPendingProductsLoading: (state, action) => {
      state.adminPendingProductsLoading = action.payload;
    },
    setAdminPendingProductsSuccess: (state, action) => {
      state.adminPendingProducts = action.payload;
    },
    setAdminPendingProductsError: (state, action) => {
      state.adminPendingProductsError = action.payload;
    },

    setApproveProductLoading: (state, action) => {
      state.approveProductLoading = action.payload.loading;
      state.approveProductLoadingId = action.payload.productId;
    },
    setApproveProductSuccess: (state, action) => {
      state.approveProductSuccess = action.payload;
    },
    setApproveProductError: (state, action) => {
      state.approveProductError = action.payload;
    },

    setRejectProductLoading: (state, action) => {
      state.rejectProductLoading = action.payload.loading;
      state.rejectProductLoadingId = action.payload.productId;
    },
    setRejectProductSuccess: (state, action) => {
      state.rejectProductSuccess = action.payload;
    },
    setRejectProductError: (state, action) => {
      state.rejectProductError = action.payload;
    },

    resetProductState: (state) => {
      state.addProductError = null;
      state.addProductSuccess = null;
      state.pendingProductsError = null;
      state.adminPendingProductsError = null;
      state.approveProductError = null;
      state.approveProductSuccess = null;
      state.rejectProductError = null;
      state.rejectProductSuccess = null;
    },
  },
});

export const {
  setAddProductLoading,
  setAddProductError,
  setAddProductSuccess,

  setPendingProductsLoading,
  setPendingProductsSuccess,
  setPendingProductsError,

  setAdminPendingProductsLoading,
  setAdminPendingProductsSuccess,
  setAdminPendingProductsError,

  setApproveProductLoading,
  setApproveProductSuccess,
  setApproveProductError,

  setRejectProductLoading,
  setRejectProductSuccess,
  setRejectProductError,

  resetProductState,
} = sellerProductSlice.actions;

export default sellerProductSlice.reducer;