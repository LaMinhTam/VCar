import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: string | null;
  token: string | null;
  refreshToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.status = "loading";
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; refreshToken: string }>
    ) => {
      state.status = "succeeded";
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.status = "idle";
      state.error = null;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;
