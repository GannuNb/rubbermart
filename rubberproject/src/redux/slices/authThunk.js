import {
  setBuyerSignupLoading,
  setBuyer,
  setToken,
  setBuyerSignupError,
  setBuyerSignupSuccessMessage,

  setSellerSignupLoading,
  setSellerSignupError,
  setSellerSignupSuccessMessage,
  setSeller, // ✅ ADD THIS LINE
} from "./authSlice";


// ================= BUYER =================

// ✅ Buyer Signup
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


// ✅ Google Buyer Signup
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
      dispatch(setBuyerSignupSuccessMessage("Google signup successful"));
    } else {
      dispatch(setBuyerSignupError(data.message));
    }
  } catch (error) {
    dispatch(setBuyerSignupError("Google signup failed"));
  } finally {
    dispatch(setBuyerSignupLoading(false));
  }
};


// ================= SELLER =================

// ✅ Seller Signup
export const signupSellerThunk = (formData) => async (dispatch) => {
  try {
    dispatch(setSellerSignupLoading(true));

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/signupseller`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("seller", JSON.stringify(data.seller));

      dispatch(setSeller(data.seller));
      dispatch(setToken(data.token));
      dispatch(setSellerSignupSuccessMessage("Signup successful"));
    } else {
      dispatch(setSellerSignupError(data.message));
    }
  } catch (error) {
    dispatch(setSellerSignupError("Something went wrong"));
  } finally {
    dispatch(setSellerSignupLoading(false));
  }
};


// ✅ Google Seller Signup
export const googleSignupSellerThunk = (googleUserData) => async (dispatch) => {
  try {
    dispatch(setSellerSignupLoading(true));

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/google-signupseller`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(googleUserData),
      }
    );

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("seller", JSON.stringify(data.seller));

      dispatch(setSeller(data.seller));
      dispatch(setToken(data.token));
      dispatch(setSellerSignupSuccessMessage("Google signup successful"));
    } else {
      dispatch(setSellerSignupError(data.message));
    }
  } catch (error) {
    dispatch(setSellerSignupError("Google signup failed"));
  } finally {
    dispatch(setSellerSignupLoading(false));
  }
};