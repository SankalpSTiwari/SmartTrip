import { SET_ALERT, REMOVE_ALERT } from "./types";
import { v4 as uuidv4 } from "uuid";

export const setAlert =
  (msg, alertType, timeout = 5000) =>
  (dispatch) => {
    const id = uuidv4();
    //   const id = Math.random().toString(36).substring(7);
    dispatch({
      type: SET_ALERT,
      payload: {
        msg,
        alertType,
        id,
      },
    });

    // Add class to container element
    const container = document.querySelector(".container");
    container.classList.add("alert-shown");

    setTimeout(() => {
      // Remove class after 5 seconds
      container.classList.remove("alert-shown");

      dispatch({
        type: REMOVE_ALERT,
        payload: id,
      });
    }, timeout);
  };
