const initialState = {
  token: localStorage.getItem("token")
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload);
      return { token: action.payload };

    case "LOGOUT":
      localStorage.removeItem("token");
      return { token: null };

    default:
      return state;
  }
};

export default authReducer;
