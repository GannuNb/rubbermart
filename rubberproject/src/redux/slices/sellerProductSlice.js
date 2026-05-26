import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Add Product Flow
  addProductLoading: false,
  addProductError: null,
  addProductSuccess: null,

  // Isolated state buckets
  allProducts: { items: [], totalPages: 1, currentPage: 1 },
  pendingProducts: { items: [], totalPages: 1, currentPage: 1 },
  approvedProducts: { items: [], totalPages: 1, currentPage: 1 },
  rejectedProducts: { items: [], totalPages: 1, currentPage: 1 },

  // Global loading/error states
  pendingProductsLoading: false,
  pendingProductsError: null,

  // Admin Flow
  adminPendingProducts: [],
  adminPendingProductsTotalPages: 1,
  adminPendingProductsLoading: false,
  adminPendingProductsError: null,

  // Action Flows
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
    // Add Product reducers
    setAddProductLoading: (state, action) => {
      state.addProductLoading = action.payload;
    },
    setAddProductError: (state, action) => {
      state.addProductError = action.payload;
    },
    setAddProductSuccess: (state, action) => {
      state.addProductSuccess = action.payload;
    },

    // Seller List Loading / Error
    setProductsLoading: (state, action) => {
      state.pendingProductsLoading = action.payload;
    },
    setProductsError: (state, action) => {
      state.pendingProductsError = action.payload;
      state.pendingProductsLoading = false;
    },

    // Renamed to match your Thunk exactly: fetchProductsSuccess
    fetchProductsSuccess: (state, action) => {
      const { data, status } = action.payload;

      let targetBucket = "allProducts";
      if (status === "approved") targetBucket = "approvedProducts";
      if (status === "rejected") targetBucket = "rejectedProducts";
      if (status === "pending") targetBucket = "pendingProducts";

      state[targetBucket] = {
        items: data.products || data.pendingProducts || [],
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || 1,
      };

      state.pendingProductsLoading = false;
    },

    // Admin List
    setAdminPendingProductsLoading: (state, action) => {
      state.adminPendingProductsLoading = action.payload;
    },
    setAdminPendingProductsSuccess: (state, action) => {
      state.adminPendingProducts = action.payload.products;
      state.adminPendingProductsTotalPages =
        action.payload.totalPages || 1;

      state.adminPendingProductsLoading = false;
    },
    setAdminPendingProductsError: (state, action) => {
      state.adminPendingProductsError = action.payload;
      state.adminPendingProductsLoading = false;
    },

    // Action Management
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
  setProductsLoading,
  setProductsError,
  fetchProductsSuccess,
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