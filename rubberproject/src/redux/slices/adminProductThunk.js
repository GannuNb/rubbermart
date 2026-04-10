// src/redux/slices/adminProductThunk.js

import {
  setAdminPendingProductsLoading,
  setAdminPendingProductsSuccess,
  setAdminPendingProductsError,
  setApproveProductLoading,
  setApproveProductSuccess,
  setApproveProductError,
  setRejectProductLoading,
  setRejectProductSuccess,
  setRejectProductError,
} from "./sellerProductSlice";

export const fetchAdminPendingProductsThunk = () => async (dispatch) => {
  try {
    dispatch(setAdminPendingProductsLoading(true));
    dispatch(setAdminPendingProductsError(null));

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/seller/admin/pending-products`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      dispatch(setAdminPendingProductsSuccess(data.products));
    } else {
      dispatch(setAdminPendingProductsError(data.message));
    }
  } catch (error) {
    dispatch(setAdminPendingProductsError("Failed to fetch products"));
  } finally {
    dispatch(setAdminPendingProductsLoading(false));
  }
};

export const approveProductThunk = (productId) => async (dispatch) => {
  try {
    dispatch(setApproveProductLoading(true));
    dispatch(setApproveProductError(null));

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/seller/admin/approve-product/${productId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      dispatch(setApproveProductSuccess(data.message));
      dispatch(fetchAdminPendingProductsThunk());
    } else {
      dispatch(setApproveProductError(data.message));
    }
  } catch (error) {
    dispatch(setApproveProductError("Failed to approve product"));
  } finally {
    dispatch(setApproveProductLoading(false));
  }
};

export const rejectProductThunk = (productId) => async (dispatch) => {
  try {
    dispatch(setRejectProductLoading(true));
    dispatch(setRejectProductError(null));

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/seller/admin/reject-product/${productId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      dispatch(setRejectProductSuccess(data.message));
      dispatch(fetchAdminPendingProductsThunk());
    } else {
      dispatch(setRejectProductError(data.message));
    }
  } catch (error) {
    dispatch(setRejectProductError("Failed to reject product"));
  } finally {
    dispatch(setRejectProductLoading(false));
  }
};