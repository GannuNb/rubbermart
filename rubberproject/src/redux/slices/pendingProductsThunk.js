import {
  setPendingProducts,
  setPendingProductsLoading,
  setPendingProductsError,
} from "./sellerProductSlice";

export const fetchPendingProductsThunk = () => async (dispatch) => {
  try {
    dispatch(setPendingProductsLoading(true));
    dispatch(setPendingProductsError(null));

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/seller/pending-products`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      dispatch(setPendingProducts(data.products));
    } else {
      dispatch(
        setPendingProductsError(
          data.message || "Failed to fetch pending products"
        )
      );
    }
  } catch (error) {
    dispatch(setPendingProductsError("Failed to fetch pending products"));
  } finally {
    dispatch(setPendingProductsLoading(false));
  }
};