// src/redux/slices/authSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

let validToken = token;
let validUser = user;

if (token) {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      validToken = null;
      validUser = null;
    }
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    validToken = null;
    validUser = null;
  }
}

const initialState = {
  user: validUser,
  token: validToken,

  signupLoading: false,
  signupError: null,
  signupSuccessMessage: null,

  loginLoading: false,
  loginError: null,
  loginSuccessMessage: null,
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

    setLoginLoading: (state, action) => {
      state.loginLoading = action.payload;
    },

    setLoginError: (state, action) => {
      state.loginError = action.payload;
    },

    setLoginSuccessMessage: (state, action) => {
      state.loginSuccessMessage = action.payload;
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
      state.loginError = null;
      state.loginSuccessMessage = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const {
  setSignupLoading,
  setSignupError,
  setSignupSuccessMessage,

  setLoginLoading,
  setLoginError,
  setLoginSuccessMessage,

  setUser,
  setToken,
  logoutUser,
} = authSlice.actions;

export default authSlice.reducer;