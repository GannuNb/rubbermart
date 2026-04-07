import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,

  signupLoading: false,
  signupError: null,
  signupSuccessMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSignupLoading: (state, action) => {
      state.signupLoading = action.payload;
    },

    setSignupError: (state, action) => {
      state.signupError = action.payload;
    },

    setSignupSuccessMessage: (state, action) => {
      state.signupSuccessMessage = action.payload;
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },

    setToken: (state, action) => {
      state.token = action.payload;
    },

    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.signupError = null;
      state.signupSuccessMessage = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const {
  setSignupLoading,
  setSignupError,
  setSignupSuccessMessage,
  setUser,
  setToken,
  logoutUser,
} = authSlice.actions;

export default authSlice.reducer;