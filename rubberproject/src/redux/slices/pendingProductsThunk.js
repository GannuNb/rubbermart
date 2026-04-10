// src/redux/slices/pendingProductsThunk.js

import {
  setPendingProductsLoading,
  setPendingProductsSuccess,
  setPendingProductsError,
} from "./sellerProductSlice";

export const fetchPendingProductsThunk = () => async (dispatch) => {
  try {
    dispatch(setPendingProductsLoading(true));
    dispatch(setPendingProductsError(null));

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/seller/products`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      dispatch(setPendingProductsSuccess(data.products));
    } else {
      dispatch(
        setPendingProductsError(
          data.message || "Failed to fetch products"
        )
      );
    }
  } catch (error) {
    dispatch(setPendingProductsError("Failed to fetch products"));
  } finally {
    dispatch(setPendingProductsLoading(false));
  }
};