import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import businessProfileReducer from "./slices/businessProfileSlice";
import sellerProductReducer from "./slices/sellerProductSlice";
import buyerProductReducer from "./slices/buyerProductSlice";
import sellerOrderReducer from "./slices/sellerOrderSlice";
import adminOrderReducer from "./slices/adminOrders/adminOrderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    businessProfile: businessProfileReducer,
    sellerProduct: sellerProductReducer,
    buyerProducts: buyerProductReducer,
    sellerOrders: sellerOrderReducer,
    adminOrders: adminOrderReducer,
  },
});