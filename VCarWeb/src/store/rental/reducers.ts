import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
};

const rentalSlice = createSlice({
  name: "rental",
  initialState,
  reducers: {
    rentRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
  },
});

export const { rentRequest } = rentalSlice.actions;

export default rentalSlice.reducer;
