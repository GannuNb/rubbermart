import {
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
} from "react-redux";

import { jwtDecode } from "jwt-decode";

import {
  logoutUser,
} from "../redux/slices/authSlice";

function useAutoLogout() {

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();


  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) return;

    try {

      const decoded =
        jwtDecode(token);

      const expiryTime =
        decoded.exp * 1000;

      const currentTime =
        Date.now();

      const timeLeft =
        expiryTime -
        currentTime;


      /* EXPIRED */

      if (timeLeft <= 0) {

        dispatch(
          logoutUser()
        );

        navigate(
          "/login"
        );

        return;
      }


      /* AUTO LOGOUT TIMER */

      const timer =
        setTimeout(() => {

          dispatch(
            logoutUser()
          );

          navigate(
            "/login"
          );

        }, timeLeft);


      return () =>
        clearTimeout(
          timer
        );

    } catch (err) {

      dispatch(
        logoutUser()
      );

      navigate(
        "/login"
      );
    }

  }, [dispatch, navigate]);
}

export default useAutoLogout;