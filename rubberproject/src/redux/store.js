import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import buyerBusinessProfileReducer from "./slices/buyerBusinessProfileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    buyerBusinessProfile: buyerBusinessProfileReducer,
  },
});





