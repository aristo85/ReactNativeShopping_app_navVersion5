import { AsyncStorage } from "react-native";

export const CHECK_AUTHENTICATE = "CHECK_AUTHENTICATE";
export const LOGOUT = "LOGOUT";
export const TRY_AUTO_LOGIN = "TRY_AUTO_LOGIN";

let timer;
//authentication action creator 
export const authentication = (token, userId, expirytime) => {
  return (dispatch) => {
    dispatch(expireSetTimeout(expirytime));
    dispatch({ type: CHECK_AUTHENTICATE, token: token, userId, userId });
  };
};

export const singupUser = (authData) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC9cWNNPiObMzZj817zS6AamvFk9fIi_oc`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...authData, returnSecureToken: true }), //from object to json
        }
      );
      const data = await response.json(); //from json to object
      if (!response.ok) {
        const errMesage =
          data.error.message == "EMAIL_EXISTS"
            ? "The email address is already in use by another account"
            : "something went wrong with the server";
        throw new Error(errMesage);
      }

      dispatch(
        authentication(
          data.idToken,
          data.localId,
          parseInt(data.expiresIn) * 1000
        )
      );

      //after signingup saving data in device storage
      const expirationDate = new Date(
        new Date().getTime() + parseInt(data.expiresIn) * 1000
      ).toISOString();
      saveDatatOnDevice(data.idToken, data.localId, expirationDate);
    } catch (err) {
      throw err;
    }
  };
};

export const loginUser = (authData) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC9cWNNPiObMzZj817zS6AamvFk9fIi_oc`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...authData, returnSecureToken: true }), //from object to json
        }
      );

      const data = await response.json(); //from json to object

      if (!response.ok) {
        const errMesage =
          data.error.message == "EMAIL_NOT_FOUND"
            ? "There is no user record corresponding to this Email"
            : data.error.message == "INVALID_PASSWORD"
            ? "The password is invalid or the user does not have a password."
            : "something went wrong with the server";
        throw new Error(errMesage);
      }

      dispatch(
        authentication(
          data.idToken,
          data.localId,
          parseInt(data.expiresIn) * 1000
        )
      );

      //after signingup saving data in device storage
      const expirationDate = new Date(
        new Date().getTime() + parseInt(data.expiresIn) * 1000
      ).toISOString();
      saveDatatOnDevice(data.idToken, data.localId, expirationDate);
    } catch (err) {
      throw err;
    }
  };
};

export const tryAuotLogin = () =>{
  return { type: TRY_AUTO_LOGIN}
}

//logout action creator
export const logOut = () => {
  clearTimeoutTimer();
  AsyncStorage.removeItem("authData");
  return { type: LOGOUT };
};
//clear the timer
const clearTimeoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};
//setting timer and auto logout when duration finished
const expireSetTimeout = (timeToExpiration) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logOut());
    }, timeToExpiration);
  };
};

//saving data on device locally with 'AsyncStorage'
const saveDatatOnDevice = (token, userId, expiry) => {
  AsyncStorage.setItem(
    "authData",
    JSON.stringify({ token: token, userId: userId, expireDate: expiry })
  );
};


