import { createSlice } from "@reduxjs/toolkit";
import {
  getSellerOrdersThunk,
  getSellerSingleOrderThunk,
  confirmSellerOrderThunk,
  rejectSellerOrderThunk,
  addShipmentToOrderThunk,
  markShipmentDeliveredBySellerThunk,
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

  shipmentLoading: false,
  shipmentError: null,
  shipmentSuccess: null,

  markDeliveredLoading: false,
  markDeliveredError: null,
  markDeliveredSuccess: null,
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
      state.shipmentError = null;
      state.shipmentSuccess = null;
      state.markDeliveredError = null;
      state.markDeliveredSuccess = null;
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
          order._id === action.payload._id ? action.payload : order,
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
          order._id === action.payload._id ? action.payload : order,
        );
      })
      .addCase(rejectSellerOrderThunk.rejected, (state, action) => {
        state.rejectOrderLoading = false;
        state.rejectOrderError = action.payload;
      })

      // ADD SHIPMENT
      .addCase(addShipmentToOrderThunk.pending, (state) => {
        state.shipmentLoading = true;
        state.shipmentError = null;
        state.shipmentSuccess = null;
      })
      .addCase(addShipmentToOrderThunk.fulfilled, (state, action) => {
        state.shipmentLoading = false;
        state.shipmentSuccess = "Shipment details added successfully";

        if (state.selectedOrder) {
          state.selectedOrder.shipments = action.payload;
        }
      })
      .addCase(addShipmentToOrderThunk.rejected, (state, action) => {
        state.shipmentLoading = false;
        state.shipmentError = action.payload;
      })
      /* =========================
            MARK DELIVERED
         ========================= */

      .addCase(markShipmentDeliveredBySellerThunk.pending, (state) => {
        state.markDeliveredLoading = true;

        state.markDeliveredError = null;

        state.markDeliveredSuccess = null;
      })

      .addCase(
        markShipmentDeliveredBySellerThunk.fulfilled,
        (state, action) => {
          state.markDeliveredLoading = false;

          state.markDeliveredSuccess = "Shipment marked as delivered";

          state.selectedOrder = action.payload;
        },
      )

      .addCase(markShipmentDeliveredBySellerThunk.rejected, (state, action) => {
        state.markDeliveredLoading = false;

        state.markDeliveredError = action.payload;
      });
  },
});

export const { clearSellerOrderMessages, clearSelectedOrder } =
  sellerOrderSlice.actions;

export default sellerOrderSlice.reducer;
