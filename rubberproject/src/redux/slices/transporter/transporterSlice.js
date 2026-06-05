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

        state.openShipments = state.openShipments.filter(
          (item) => item.shipment._id !== action.payload.shipmentId,
        );
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
   ACCEPT ASSIGNMENT
========================= */

.addCase(
  acceptAssignmentThunk.pending,
  (state) => {
    state.assignmentActionLoading =
      true;

    state.assignmentActionError =
      null;
  },
)

.addCase(
  acceptAssignmentThunk.fulfilled,
  (state, action) => {
    state.assignmentActionLoading =
      false;

    state.pendingAssignments =
      state.pendingAssignments.filter(
        (item) =>
          item.shipment._id !==
          action.payload.shipmentId,
      );
  },
)

.addCase(
  acceptAssignmentThunk.rejected,
  (state, action) => {
    state.assignmentActionLoading =
      false;

    state.assignmentActionError =
      action.payload;
  },
)

/* =========================
   REJECT ASSIGNMENT
========================= */

.addCase(
  rejectAssignmentThunk.pending,
  (state) => {
    state.assignmentActionLoading =
      true;

    state.assignmentActionError =
      null;
  },
)

.addCase(
  rejectAssignmentThunk.fulfilled,
  (state, action) => {
    state.assignmentActionLoading =
      false;

    state.pendingAssignments =
      state.pendingAssignments.filter(
        (item) =>
          item.shipment._id !==
          action.payload.shipmentId,
      );
  },
)

.addCase(
  rejectAssignmentThunk.rejected,
  (state, action) => {
    state.assignmentActionLoading =
      false;

    state.assignmentActionError =
      action.payload;
  },
);

  },
});

export const { clearTransporterMessages } = transporterSlice.actions;

export default transporterSlice.reducer;
