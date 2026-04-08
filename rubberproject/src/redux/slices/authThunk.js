// src/redux/slices/authThunk.js

import {
  setSignupLoading,
  setSignupError,
  setSignupSuccessMessage,
  setLoginLoading,
  setLoginError,
  setLoginSuccessMessage,
  setUser,
  setToken,
} from "./authSlice";

export const signupThunk = (formData) => async (dispatch) => {
  try {
    dispatch(setSignupLoading(true));
    dispatch(setSignupError(null));
    dispatch(setSignupSuccessMessage(null));

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/signup`,
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
          role: formData.role,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      dispatch(setUser(data.user));
      dispatch(setToken(data.token));
      dispatch(setSignupSuccessMessage("Signup successful"));
    } else {
      dispatch(setSignupError(data.message));
    }
  } catch (error) {
    dispatch(setSignupError("Something went wrong"));
  } finally {
    dispatch(setSignupLoading(false));
  }
};

export const googleSignupThunk = (googleUserData) => async (dispatch) => {
  try {
    dispatch(setSignupLoading(true));
    dispatch(setSignupError(null));
    dispatch(setSignupSuccessMessage(null));

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/google-signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: googleUserData.fullName,
          email: googleUserData.email,
          profileImage: googleUserData.profileImage,
          role: googleUserData.role,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      dispatch(setUser(data.user));
      dispatch(setToken(data.token));
      dispatch(setSignupSuccessMessage("Google signup successful"));
    } else {
      dispatch(setSignupError(data.message));
    }
  } catch (error) {
    dispatch(setSignupError("Google signup failed"));
  } finally {
    dispatch(setSignupLoading(false));
  }
};

// src/redux/slices/authThunk.js
// Replace only loginThunk and googleLoginThunk with this

export const loginThunk = (formData) => async (dispatch) => {
  try {
    dispatch(setLoginLoading(true));
    dispatch(setLoginError(null));
    dispatch(setLoginSuccessMessage(null));

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      dispatch(setUser(data.user));
      dispatch(setToken(data.token));
      dispatch(setLoginSuccessMessage("Login successful"));
    } else {
      dispatch(setLoginError(data.message));
    }
  } catch (error) {
    dispatch(setLoginError("Login failed"));
  } finally {
    dispatch(setLoginLoading(false));
  }
};

export const googleLoginThunk = (googleUserData) => async (dispatch) => {
  try {
    dispatch(setLoginLoading(true));
    dispatch(setLoginError(null));
    dispatch(setLoginSuccessMessage(null));

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/google-login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: googleUserData.email,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      dispatch(setUser(data.user));
      dispatch(setToken(data.token));
      dispatch(setLoginSuccessMessage("Google login successful"));
    } else {
      dispatch(setLoginError(data.message));
    }
  } catch (error) {
    dispatch(setLoginError("Google login failed"));
  } finally {
    dispatch(setLoginLoading(false));
  }
};