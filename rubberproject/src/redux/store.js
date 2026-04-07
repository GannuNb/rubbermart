import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import buyerBusinessProfileReducer from "./slices/buyerBusinessProfileSlice";
import sellerBusinessProfileReducer from "./slices/sellerBusinessProfileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    buyerBusinessProfile: buyerBusinessProfileReducer,
    sellerBusinessProfile: sellerBusinessProfileReducer,
  },
});