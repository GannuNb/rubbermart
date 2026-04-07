import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createBusinessProfileLoading: false,
  createBusinessProfileError: null,
  createBusinessProfileSuccessMessage: null,
  businessProfileData: null,
};

const sellerBusinessProfileSlice = createSlice({
  name: "sellerBusinessProfile",
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
  },
});

export const {
  setCreateBusinessProfileLoading,
  setCreateBusinessProfileError,
  setCreateBusinessProfileSuccessMessage,
  setBusinessProfileData,
} = sellerBusinessProfileSlice.actions;

export default sellerBusinessProfileSlice.reducer;