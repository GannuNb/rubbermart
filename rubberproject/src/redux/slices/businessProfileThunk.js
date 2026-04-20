
// src/redux/slices/businessProfileThunk.js

import {
  setCreateBusinessProfileLoading,
  setCreateBusinessProfileError,
  setCreateBusinessProfileSuccessMessage,
  setBusinessProfileData,
} from "./businessProfileSlice";

export const createBusinessProfileThunk =
  (formData) => async (dispatch) => {
    try {
      dispatch(setCreateBusinessProfileLoading(true));
      dispatch(setCreateBusinessProfileError(null));
      dispatch(setCreateBusinessProfileSuccessMessage(null));

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/business-profile/create-business-profile`,
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
        dispatch(
          setCreateBusinessProfileError(
            data.message || "Failed to create business profile"
          )
        );
      }
    } catch (error) {
      dispatch(setCreateBusinessProfileError("Something went wrong"));
    } finally {
      dispatch(setCreateBusinessProfileLoading(false));
    }
  };

