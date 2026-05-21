// src/redux/slices/sellerProductThunk.js
import {
  setAddProductLoading,
  setAddProductError,
  setAddProductSuccess,
  setApproveProductLoading,
  setApproveProductSuccess,
  setApproveProductError,
} from "./sellerProductSlice";

// --- ADD PRODUCT THUNK ---
export const addProductThunk = (formData) => async (dispatch) => {
  try {
    dispatch(setAddProductLoading(true));
    dispatch(setAddProductError(null));
    dispatch(setAddProductSuccess(null));

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/seller/add-product`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Since it uses FormData for images, do not add Content-Type header manually
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      dispatch(setAddProductSuccess(data.message));
    } else {
      dispatch(setAddProductError(data.message || "Failed to add product"));
    }
  } catch (error) {
    dispatch(setAddProductError("Failed to add product"));
  } finally {
    dispatch(setAddProductLoading(false));
  }
};

// --- UPDATE PRODUCT THUNK ---
export const updateSellerProductThunk = (productId, updatedData) => async (dispatch) => {
  try {
    dispatch(setApproveProductLoading({ loading: true, productId }));
    dispatch(setApproveProductError(null));
    dispatch(setApproveProductSuccess(null));

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/seller/update-product/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      dispatch(setApproveProductSuccess(data.message));
    } else {
      dispatch(setApproveProductError(data.message || "Failed to update product"));
      throw new Error(data.message || "Failed to update product");
    }
  } catch (error) {
    dispatch(setApproveProductError(error.message || "Failed to update product"));
    throw error;
  } finally {
    dispatch(setApproveProductLoading({ loading: false, productId: null }));
  }
};