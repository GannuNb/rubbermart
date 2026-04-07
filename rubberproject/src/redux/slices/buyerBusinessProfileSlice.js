// Good practice:
// Keep buyer business profile in separate redux files.


// ============================================
// src/redux/slices/buyerBusinessProfileSlice.js
// Create this new file
// ============================================

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createBusinessProfileLoading: false,
  createBusinessProfileError: null,
  createBusinessProfileSuccessMessage: null,
  businessProfileData: null,
};

const buyerBusinessProfileSlice = createSlice({
  name: "buyerBusinessProfile",
  initialState,
  reducers: {
    setCreateBusinessProfileLoading: (state, action) => {
      state.createBusinessProfileLoading = action.payload;
    },

    setCreateBusinessProfileError: (state, action) => {
      state.createBusinessProfileError = action.payload;
    },

    setCreateBusinessProfileSuccessMessage: (state, action) => {
      state.createBusinessProfileSuccessMessage = action.payload;
    },

    setBusinessProfileData: (state, action) => {
      state.businessProfileData = action.payload;
    },

    clearBusinessProfileMessages: (state) => {
      state.createBusinessProfileError = null;
      state.createBusinessProfileSuccessMessage = null;
    },
  },
});

export const {
  setCreateBusinessProfileLoading,
  setCreateBusinessProfileError,
  setCreateBusinessProfileSuccessMessage,
  setBusinessProfileData,
  clearBusinessProfileMessages,
} = buyerBusinessProfileSlice.actions;

export default buyerBusinessProfileSlice.reducer;
