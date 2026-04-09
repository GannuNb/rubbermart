import {
  setAddProductLoading,
  setAddProductError,
  setAddProductSuccess,
} from "./sellerProductSlice";

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
        body: formData,
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      dispatch(setAddProductSuccess(data.message));
    } else {
      dispatch(
        setAddProductError(
          data.message || "Failed to add product"
        )
      );
    }
  } catch (error) {
    dispatch(
      setAddProductError("Failed to add product")
    );
  } finally {
    dispatch(setAddProductLoading(false));
  }
};