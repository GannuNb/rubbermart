import { createSlice } from "@reduxjs/toolkit";
import {
  getSellerOrdersThunk,
  getSellerSingleOrderThunk,
  confirmSellerOrderThunk,
  rejectSellerOrderThunk,
} from "./sellerOrderThunk";

const initialState = {
  sellerOrders: [],
  selectedOrder: null,

  sellerOrdersLoading: false,
  sellerOrdersError: null,

  singleOrderLoading: false,
  singleOrderError: null,

  confirmOrderLoading: false,
  confirmOrderError: null,
  confirmOrderSuccess: null,

  rejectOrderLoading: false,
  rejectOrderError: null,
  rejectOrderSuccess: null,
};

const sellerOrderSlice = createSlice({
  name: "sellerOrders",
  initialState,
  reducers: {
    clearSellerOrderMessages: (state) => {
      state.confirmOrderError = null;
      state.confirmOrderSuccess = null;
      state.rejectOrderError = null;
      state.rejectOrderSuccess = null;
    },

    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
      state.singleOrderError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // GET SELLER ORDERS
      .addCase(getSellerOrdersThunk.pending, (state) => {
        state.sellerOrdersLoading = true;
        state.sellerOrdersError = null;
      })
      .addCase(getSellerOrdersThunk.fulfilled, (state, action) => {
        state.sellerOrdersLoading = false;
        state.sellerOrders = action.payload;
      })
      .addCase(getSellerOrdersThunk.rejected, (state, action) => {
        state.sellerOrdersLoading = false;
        state.sellerOrdersError = action.payload;
      })

      // GET SINGLE ORDER
      .addCase(getSellerSingleOrderThunk.pending, (state) => {
        state.singleOrderLoading = true;
        state.singleOrderError = null;
      })
      .addCase(getSellerSingleOrderThunk.fulfilled, (state, action) => {
        state.singleOrderLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(getSellerSingleOrderThunk.rejected, (state, action) => {
        state.singleOrderLoading = false;
        state.singleOrderError = action.payload;
      })

      // CONFIRM ORDER
      .addCase(confirmSellerOrderThunk.pending, (state) => {
        state.confirmOrderLoading = true;
        state.confirmOrderError = null;
        state.confirmOrderSuccess = null;
      })
      .addCase(confirmSellerOrderThunk.fulfilled, (state, action) => {
        state.confirmOrderLoading = false;
        state.confirmOrderSuccess = "Order confirmed successfully";
        state.selectedOrder = action.payload;

        state.sellerOrders = state.sellerOrders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(confirmSellerOrderThunk.rejected, (state, action) => {
        state.confirmOrderLoading = false;
        state.confirmOrderError = action.payload;
      })

      // REJECT ORDER
      .addCase(rejectSellerOrderThunk.pending, (state) => {
        state.rejectOrderLoading = true;
        state.rejectOrderError = null;
        state.rejectOrderSuccess = null;
      })
      .addCase(rejectSellerOrderThunk.fulfilled, (state, action) => {
        state.rejectOrderLoading = false;
        state.rejectOrderSuccess = "Order rejected successfully";
        state.selectedOrder = action.payload;

        state.sellerOrders = state.sellerOrders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(rejectSellerOrderThunk.rejected, (state, action) => {
        state.rejectOrderLoading = false;
        state.rejectOrderError = action.payload;
      });
  },
});

export const { clearSellerOrderMessages, clearSelectedOrder } =
  sellerOrderSlice.actions;

export default sellerOrderSlice.reducer;