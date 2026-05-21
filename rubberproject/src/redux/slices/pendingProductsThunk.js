// src/redux/slices/pendingProductsThunk.js

import {
  setPendingProductsLoading,
  setPendingProductsSuccess,
  setPendingProductsError,
} from "./sellerProductSlice";

// Add 'page' as an argument here with a default value of 1
export const fetchPendingProductsThunk = (page = 1) => async (dispatch) => {
  try {
    dispatch(setPendingProductsLoading(true));
    dispatch(setPendingProductsError(null));

    const token = localStorage.getItem("token");

    // Now 'page' is defined and will be correctly injected into the URL
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/seller/products?page=${page}&limit=3`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      // Ensure your slice is configured to handle the object containing 
      // { products, totalPages, currentPage }
      dispatch(setPendingProductsSuccess(data)); 
    } else {
      dispatch(setPendingProductsError(data.message));
    }
  } catch (error) {
    dispatch(setPendingProductsError("Failed to fetch products"));
  } finally {
    dispatch(setPendingProductsLoading(false));
  }
};