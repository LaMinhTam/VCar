import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: {
    id: string;
    display_name: string;
    email: string;
    image_url: string;
  } | null;
  error: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: AuthState = {
  token: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  user: null,
  error: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest(state) {
      state.status = "loading";
      state.error = null;
    },
    loginSuccess(
      state,
      action: PayloadAction<{
        token: string;
        refreshToken: string;
        user: {
          id: string;
          display_name: string;
          email: string;
          image_url: string;
        };
      }>
    ) {
      state.status = "succeeded";
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.error = null;
      localStorage.setItem("accessToken", action.payload.token);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    logout(state) {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;
