import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define async actions for logging in and registering
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }) => {
    // Simulate an API call for login
    const response = await new Promise<{ email: string; token: string }>((resolve) =>
      setTimeout(() => resolve({ email, token: "mocked_token" }), 500)
    );
    return response;
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password }: { email: string; password: string }) => {
    // Simulate an API call for registration
    const response = await new Promise<{ email: string; token: string }>((resolve) =>
      setTimeout(() => resolve({ email, token: "mocked_token" }), 500)
    );
    return response;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null as string | null,
    token: null as string | null,
    status: "idle" as "idle" | "loading" | "succeeded" | "failed",
    error: null as string | null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.email;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to login";
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.email;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to register";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
