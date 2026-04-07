import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  buyer: JSON.parse(localStorage.getItem("buyer")) || null,
  token: localStorage.getItem("token") || null,

  buyerSignupLoading: false,
  buyerSignupError: null,
  buyerSignupSuccessMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setBuyerSignupLoading: (state, action) => {
      state.buyerSignupLoading = action.payload;
    },

    setBuyer: (state, action) => {
      state.buyer = action.payload;
    },

    setToken: (state, action) => {
      state.token = action.payload;
    },

    setBuyerSignupError: (state, action) => {
      state.buyerSignupError = action.payload;
    },

    setBuyerSignupSuccessMessage: (state, action) => {
      state.buyerSignupSuccessMessage = action.payload;
    },

    logoutBuyer: (state) => {
      state.buyer = null;
      state.token = null;
      state.buyerSignupError = null;
      state.buyerSignupSuccessMessage = null;

      localStorage.removeItem("token");
      localStorage.removeItem("buyer");
    },
  },
});

export const {
  setBuyerSignupLoading,
  setBuyer,
  setToken,
  setBuyerSignupError,
  setBuyerSignupSuccessMessage,
  logoutBuyer,
} = authSlice.actions;

export default authSlice.reducer;