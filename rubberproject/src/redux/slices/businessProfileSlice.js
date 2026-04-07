// src/redux/slices/businessProfileSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createBusinessProfileLoading: false,
  createBusinessProfileError: null,
  createBusinessProfileSuccessMessage: null,
  businessProfileData: null,
};

const businessProfileSlice = createSlice({
  name: "businessProfile",
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
} = businessProfileSlice.actions;

export default businessProfileSlice.reducer;