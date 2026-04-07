import {
  setCreateBusinessProfileLoading,
  setCreateBusinessProfileError,
  setCreateBusinessProfileSuccessMessage,
  setBusinessProfileData,
} from "./sellerBusinessProfileSlice";

export const createSellerBusinessProfileThunk =
  (formData) => async (dispatch) => {
    try {
      dispatch(setCreateBusinessProfileLoading(true));
      dispatch(setCreateBusinessProfileError(null));
      dispatch(setCreateBusinessProfileSuccessMessage(null));

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/seller-business-profile/create-seller-business-profile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        dispatch(setBusinessProfileData(data.businessProfile));
        dispatch(
          setCreateBusinessProfileSuccessMessage(
            "Seller business profile created successfully"
          )
        );
      } else {
        dispatch(setCreateBusinessProfileError(data.message));
      }
    } catch (error) {
      dispatch(setCreateBusinessProfileError("Something went wrong"));
    } finally {
      dispatch(setCreateBusinessProfileLoading(false));
    }
  };