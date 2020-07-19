import { CHECK_AUTHENTICATE, LOGOUT, TRY_AUTO_LOGIN } from "./actions";

const initialState = {
  token: null,
  userId: null,
  isTriedAutoLogin: false,
};

const authReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case CHECK_AUTHENTICATE:
      return {
        token: actions.token,
        userId: actions.userId,
      };
    case LOGOUT:
      return initialState;
    case TRY_AUTO_LOGIN:
      return { ...state, isTriedAutoLogin: true };
    default:
      return state;
  }
};

export default authReducer;
