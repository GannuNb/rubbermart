// src/redux/slices/transporter/transporterSlice.js

import { createSlice } from "@reduxjs/toolkit";

import {
  getOpenTransportShipmentsThunk,
  submitTransportQuoteThunk,
  getTransporterQuotesThunk,
} from "./transporterThunk";
import { getPendingAssignmentsThunk } from "./getPendingAssignmentsThunk";
import { acceptAssignmentThunk } from "./acceptAssignmentThunk";

import { rejectAssignmentThunk } from "./rejectAssignmentThunk";
import { getAssignedShipmentsThunk } from "./getAssignedShipmentsThunk";
import { getCompletedDeliveriesThunk } from "./getCompletedDeliveriesThunk";
import { markShipmentShippedThunk } from "./markShipmentShippedThunk";

const initialState = {
  /* =========================
     OPEN SHIPMENTS
  ========================= */
  openShipments: [],
  openShipmentsLoading: false,
  openShipmentsError: null,

  /* =========================
     SUBMIT QUOTE
  ========================= */
  submitQuoteLoading: false,
  submitQuoteError: null,
  submitQuoteSuccess: null,

  /* =========================
     MY QUOTES
  ========================= */
  myQuotes: [],
  myQuotesLoading: false,
  myQuotesError: null,

  /* =========================
   PENDING ASSIGNMENTS
========================= */
  pendingAssignments: [],
  pendingAssignmentsLoading: false,
  pendingAssignmentsError: null,

  /* =========================
   ASSIGNMENT ACTIONS
========================= */

  assignmentActionLoading: false,
  assignmentActionError: null,
  activeAssignmentShipmentId: null,

  /* =========================
   ASSIGNED SHIPMENTS
========================= */
  assignedShipments: [],
  assignedShipmentsLoading: false,
  assignedShipmentsError: null,

  /* =========================
   COMPLETED DELIVERIES
========================= */

  completedDeliveries: [],
  completedDeliveriesLoading: false,
  completedDeliveriesError: null,

  markShippedLoading: false,

  markShippedError: null,
};

const transporterSlice = createSlice({
  name: "transporter",
  initialState,

  reducers: {
    clearTransporterMessages: (state) => {
      state.submitQuoteError = null;
      state.submitQuoteSuccess = null;
      state.openShipmentsError = null;
      state.myQuotesError = null;
      state.pendingAssignmentsError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* =========================
         GET OPEN SHIPMENTS
      ========================= */

      .addCase(getOpenTransportShipmentsThunk.pending, (state) => {
        state.openShipmentsLoading = true;
        state.openShipmentsError = null;
      })

      .addCase(getOpenTransportShipmentsThunk.fulfilled, (state, action) => {
        state.openShipmentsLoading = false;
        state.openShipments = action.payload;
      })

      .addCase(getOpenTransportShipmentsThunk.rejected, (state, action) => {
        state.openShipmentsLoading = false;
        state.openShipmentsError = action.payload;
      })

      /* =========================
         SUBMIT QUOTE
      ========================= */

      .addCase(submitTransportQuoteThunk.pending, (state) => {
        state.submitQuoteLoading = true;
        state.submitQuoteError = null;
        state.submitQuoteSuccess = null;
      })

      .addCase(submitTransportQuoteThunk.fulfilled, (state, action) => {
        state.submitQuoteLoading = false;
        state.submitQuoteSuccess = "Quote submitted successfully";
      })

      .addCase(submitTransportQuoteThunk.rejected, (state, action) => {
        state.submitQuoteLoading = false;
        state.submitQuoteError = action.payload;
      })

      /* =========================
         GET MY QUOTES
      ========================= */

      .addCase(getTransporterQuotesThunk.pending, (state) => {
        state.myQuotesLoading = true;
        state.myQuotesError = null;
      })

      .addCase(getTransporterQuotesThunk.fulfilled, (state, action) => {
        state.myQuotesLoading = false;
        state.myQuotes = action.payload;
      })

      .addCase(getTransporterQuotesThunk.rejected, (state, action) => {
        state.myQuotesLoading = false;
        state.myQuotesError = action.payload;
      })
      /* =========================
          GET PENDING ASSIGNMENTS
        ========================= */

      .addCase(getPendingAssignmentsThunk.pending, (state) => {
        state.pendingAssignmentsLoading = true;
        state.pendingAssignmentsError = null;
      })

      .addCase(getPendingAssignmentsThunk.fulfilled, (state, action) => {
        state.pendingAssignmentsLoading = false;
        state.pendingAssignments = action.payload || [];
      })

      .addCase(getPendingAssignmentsThunk.rejected, (state, action) => {
        state.pendingAssignmentsLoading = false;
        state.pendingAssignmentsError = action.payload;
      })

      /* =========================
          GET ASSIGNED SHIPMENTS
        ========================= */

      .addCase(getAssignedShipmentsThunk.pending, (state) => {
        state.assignedShipmentsLoading = true;
        state.assignedShipmentsError = null;
      })

      .addCase(getAssignedShipmentsThunk.fulfilled, (state, action) => {
        state.assignedShipmentsLoading = false;
        state.assignedShipments = action.payload || [];
      })

      .addCase(getAssignedShipmentsThunk.rejected, (state, action) => {
        state.assignedShipmentsLoading = false;
        state.assignedShipmentsError = action.payload;
      })

      /* =========================
          GET COMPLETED DELIVERIES
        ========================= */

      .addCase(getCompletedDeliveriesThunk.pending, (state) => {
        state.completedDeliveriesLoading = true;
        state.completedDeliveriesError = null;
      })

      .addCase(getCompletedDeliveriesThunk.fulfilled, (state, action) => {
        state.completedDeliveriesLoading = false;
        state.completedDeliveries = action.payload || [];
      })

      .addCase(getCompletedDeliveriesThunk.rejected, (state, action) => {
        state.completedDeliveriesLoading = false;
        state.completedDeliveriesError = action.payload;
      })
      /* =========================
          ACCEPT ASSIGNMENT
        ========================= */

      .addCase(acceptAssignmentThunk.pending, (state, action) => {
        state.assignmentActionLoading = true;

        state.assignmentActionError = null;

        state.activeAssignmentShipmentId = action.meta.arg.shipmentId;
      })

      .addCase(acceptAssignmentThunk.fulfilled, (state, action) => {
        state.assignmentActionLoading = false;
        state.activeAssignmentShipmentId = null;

        state.pendingAssignments = state.pendingAssignments.filter(
          (item) => item.shipment._id !== action.payload.shipmentId,
        );
      })

      .addCase(acceptAssignmentThunk.rejected, (state, action) => {
        state.assignmentActionLoading = false;
        state.assignmentActionError = action.payload;
        state.activeAssignmentShipmentId = null;
      })

      /* =========================
          REJECT ASSIGNMENT
        ========================= */

      .addCase(rejectAssignmentThunk.pending, (state, action) => {
        state.assignmentActionLoading = true;

        state.assignmentActionError = null;

        state.activeAssignmentShipmentId = action.meta.arg.shipmentId;
      })

      .addCase(rejectAssignmentThunk.fulfilled, (state, action) => {
        state.assignmentActionLoading = false;
        state.activeAssignmentShipmentId = null;
        state.pendingAssignments = state.pendingAssignments.filter(
          (item) => item.shipment._id !== action.payload.shipmentId,
        );
      })

      .addCase(rejectAssignmentThunk.rejected, (state, action) => {
        state.assignmentActionLoading = false;
        state.activeAssignmentShipmentId = null;
        state.assignmentActionError = action.payload;
      })
        /* =========================
              MARK SHIPPED
          ========================= */

      .addCase(markShipmentShippedThunk.pending, (state) => {
        state.markShippedLoading = true;

        state.markShippedError = null;
      })

      .addCase(markShipmentShippedThunk.fulfilled, (state, action) => {
        state.markShippedLoading = false;

        const updatedOrder = action.payload.order;

        state.assignedShipments = state.assignedShipments.map((item) => {
          if (item.orderId === updatedOrder._id) {
            const updatedShipment = updatedOrder.shipments.find(
              (shipment) =>
                shipment._id.toString() === item.shipment._id.toString(),
            );

            return {
              ...item,

              shipment: updatedShipment,
            };
          }

          return item;
        });
      })

      .addCase(markShipmentShippedThunk.rejected, (state, action) => {
        state.markShippedLoading = false;

        state.markShippedError = action.payload;
      });
  },
});

export const { clearTransporterMessages } = transporterSlice.actions;

export default transporterSlice.reducer;
