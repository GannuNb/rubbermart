// src/redux/slices/transporter/getTransporterPaymentHistoryThunk.js

import axios from "axios";

import {
  getTransporterPaymentHistoryPending,
  getTransporterPaymentHistorySuccess,
  getTransporterPaymentHistoryFail,
} from "./transporterSlice";

export const getTransporterPaymentHistoryThunk =
  () => async (dispatch, getState) => {
    try {
      /* =========================
         LOADING
      ========================= */

      dispatch(getTransporterPaymentHistoryPending());

      /* =========================
         TOKEN
      ========================= */

      const token = getState().auth.token;

      /* =========================
         API
      ========================= */

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/orders/transporter/payment-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      /* =========================
         SUCCESS
      ========================= */

      dispatch(
        getTransporterPaymentHistorySuccess(response.data.shipments || []),
      );
    } catch (error) {
      console.log("Get Transporter Payment History Error:", error);

      /* =========================
         ERROR MESSAGE
      ========================= */

      const message =
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch payment history";

      dispatch(getTransporterPaymentHistoryFail(message));
    }
  };
