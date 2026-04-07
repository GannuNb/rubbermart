import {
  setBuyerSignupLoading,
  setBuyer,
  setToken,
  setBuyerSignupError,
  setBuyerSignupSuccessMessage,
} from "./authSlice";

export const signupBuyerThunk = (formData) => async (dispatch) => {
  try {
    dispatch(setBuyerSignupLoading(true));
    dispatch(setBuyerSignupError(null));
    dispatch(setBuyerSignupSuccessMessage(null));

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/signupbuyer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          location: formData.location,
          password: formData.password,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("buyer", JSON.stringify(data.buyer));

      dispatch(setBuyer(data.buyer));
      dispatch(setToken(data.token));
      dispatch(setBuyerSignupSuccessMessage("Signup successful"));
    } else {
      dispatch(setBuyerSignupError(data.message));
    }
  } catch (error) {
    dispatch(setBuyerSignupError("Something went wrong"));
  } finally {
    dispatch(setBuyerSignupLoading(false));
  }
};

export const googleSignupBuyerThunk = (googleUserData) => async (dispatch) => {
  try {
    dispatch(setBuyerSignupLoading(true));
    dispatch(setBuyerSignupError(null));
    dispatch(setBuyerSignupSuccessMessage(null));

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/google-signupbuyer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: googleUserData.fullName,
          email: googleUserData.email,
          profileImage: googleUserData.profileImage,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("buyer", JSON.stringify(data.buyer));

      dispatch(setBuyer(data.buyer));
      dispatch(setToken(data.token));
      dispatch(
        setBuyerSignupSuccessMessage("Google signup successful")
      );
    } else {
      dispatch(setBuyerSignupError(data.message));
    }
  } catch (error) {
    dispatch(setBuyerSignupError("Google signup failed"));
  } finally {
    dispatch(setBuyerSignupLoading(false));
  }
};