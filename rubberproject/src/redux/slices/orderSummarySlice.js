import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sellerId: "",
  sellerName: "",
  shippingAddress: {},
  buyerGstNumber: "",
  businessProfile: {},
  orderItems: [],
};

const orderSummarySlice = createSlice({
  name: "orderSummary",

  initialState,

  reducers: {
    setOrderSummary: (state, action) => {
      state.sellerId = action.payload.sellerId || "";

      state.sellerName = action.payload.sellerName || "";

      state.shippingAddress = action.payload.shippingAddress || {};

      state.buyerGstNumber = action.payload.buyerGstNumber || "";

      state.businessProfile = action.payload.businessProfile || {};

      state.orderItems = action.payload.orderItems || [];
    },

    updateOrderItems: (state, action) => {
      state.orderItems = action.payload;
    },

    clearOrderSummary: (state) => {
      state.sellerId = "";

      state.sellerName = "";

      state.shippingAddress = {};

      state.buyerGstNumber = "";

      state.businessProfile = {};

      state.orderItems = [];
    },
  },
});

export const { setOrderSummary, updateOrderItems, clearOrderSummary } =
  orderSummarySlice.actions;

export default orderSummarySlice.reducer;
