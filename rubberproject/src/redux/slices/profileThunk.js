// src/redux/slices/profileThunk.js

import { setUser } from "./authSlice";

export const fetchProfileThunk = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/my-profile`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      dispatch(setUser(data.user));
    }
  } catch (error) {
    console.log("Profile Fetch Error:", error);
  }
};