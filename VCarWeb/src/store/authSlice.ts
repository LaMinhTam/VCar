import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../config/apiConfig.js";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }) => {
    console.log(email, password);
    const response = await axios.post(`${BASE_URL}/auth/signin`, {
      username: email,
      password,
    });
    console.log(response);

    return response.data.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null as string | null,
    token: null as string | null,
    refreshToken: null as string | null,
    status: "idle" as "idle" | "loading" | "succeeded" | "failed",
    error: null as string | null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to login";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
