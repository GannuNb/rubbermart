import {
  setProductsLoading,
  setProductsError,
  fetchProductsSuccess,
} from "./sellerProductSlice";

export const fetchPendingProductsThunk = (page = 1, status = "") => async (dispatch) => {
  try {
    dispatch(setProductsLoading(true));
    dispatch(setProductsError(null));

    const token = localStorage.getItem("token");
    // Ensure status is handled correctly by the backend
    const url = `${process.env.REACT_APP_API_URL}/api/seller/products?page=${page}${status ? `&status=${status}` : ""}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      // Pass the data object and status so the slice knows which bucket to fill
      // Using 'pending' as the default status if none is provided
      dispatch(fetchProductsSuccess({ data, status: status || "pending" })); 
    } else {
      dispatch(setProductsError(data.message || "Failed to fetch products"));
    }
  } catch (error) {
    dispatch(setProductsError("Failed to fetch products"));
  } finally {
    dispatch(setProductsLoading(false));
  }
};