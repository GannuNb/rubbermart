
import {
  setCreateBusinessProfileLoading,
  setCreateBusinessProfileError,
  setCreateBusinessProfileSuccessMessage,
  setBusinessProfileData,
} from "./buyerBusinessProfileSlice";

export const createBuyerBusinessProfileThunk =
  (formData) => async (dispatch) => {
    try {
      dispatch(setCreateBusinessProfileLoading(true));
      dispatch(setCreateBusinessProfileError(null));
      dispatch(setCreateBusinessProfileSuccessMessage(null));

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/buyer-business-profile/create-buyer-business-profile`,
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
            "Business profile created successfully"
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

