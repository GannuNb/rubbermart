import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  buyer: JSON.parse(localStorage.getItem("buyer")) || null,
  seller: JSON.parse(localStorage.getItem("seller")) || null,
  token: localStorage.getItem("token") || null,

  // ✅ Buyer states
  buyerSignupLoading: false,
  buyerSignupError: null,
  buyerSignupSuccessMessage: null,

  // ✅ Seller states
  sellerSignupLoading: false,
  sellerSignupError: null,
  sellerSignupSuccessMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🔹 Buyer reducers
    setBuyerSignupLoading: (state, action) => {
      state.buyerSignupLoading = action.payload;
    },

    setBuyerSignupError: (state, action) => {
      state.buyerSignupError = action.payload;
    },

    setBuyerSignupSuccessMessage: (state, action) => {
      state.buyerSignupSuccessMessage = action.payload;
    },

    // 🔹 Seller reducers
    setSellerSignupLoading: (state, action) => {
      state.sellerSignupLoading = action.payload;
    },

    setSellerSignupError: (state, action) => {
      state.sellerSignupError = action.payload;
    },

    setSellerSignupSuccessMessage: (state, action) => {
      state.sellerSignupSuccessMessage = action.payload;
    },

    setBuyer: (state, action) => {
      state.buyer = action.payload;
    },

    setSeller: (state, action) => {
      state.seller = action.payload;
    },

    setToken: (state, action) => {
      state.token = action.payload;
    },

    logoutBuyer: (state) => {
      state.buyer = null;
      state.token = null;

      state.buyerSignupError = null;
      state.buyerSignupSuccessMessage = null;
      state.sellerSignupError = null;
      state.sellerSignupSuccessMessage = null;

      localStorage.removeItem("token");
      localStorage.removeItem("buyer");
    },
  },
});

export const {
  setBuyerSignupLoading,
  setBuyerSignupError,
  setBuyerSignupSuccessMessage,

  setSellerSignupLoading,
  setSellerSignupError,
  setSellerSignupSuccessMessage,

  setBuyer,
  setSeller, // ✅ ADD THIS LINE
  setToken,
  logoutBuyer,
} = authSlice.actions;

export default authSlice.reducer;