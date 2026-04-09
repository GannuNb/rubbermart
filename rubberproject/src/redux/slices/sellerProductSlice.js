import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addProductLoading: false,
  addProductError: null,
  addProductSuccess: null,

  pendingProducts: [],
  pendingProductsLoading: false,
  pendingProductsError: null,
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

    resetProductState: (state) => {
      state.addProductError = null;
      state.addProductSuccess = null;
    },

    setPendingProducts: (state, action) => {
      state.pendingProducts = action.payload;
    },

    setPendingProductsLoading: (state, action) => {
      state.pendingProductsLoading = action.payload;
    },

    setPendingProductsError: (state, action) => {
      state.pendingProductsError = action.payload;
    },
  },
});

export const {
  setAddProductLoading,
  setAddProductError,
  setAddProductSuccess,
  resetProductState,

  setPendingProducts,
  setPendingProductsLoading,
  setPendingProductsError,
} = sellerProductSlice.actions;

export default sellerProductSlice.reducer;