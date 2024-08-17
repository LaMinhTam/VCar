import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Car {
  id: string;
  image_url: string[];
  name: string;
  province: string;
  location: string;
  daily_rate: number;
  seats: number;
  transmission: string;
  fuel: string;
  fuel_consumption: number;
  features: string[];
  license_plate: string;
  registration_number: string;
  registration_date: string;
  registration_location: string;
}

interface CarState {
  cars: Car[];
  loading: boolean;
  error: string | null;
}

const initialState: CarState = {
  cars: [],
  loading: false,
  error: null,
};

const carSlice = createSlice({
  name: "car",
  initialState,
  reducers: {
    fetchCarsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCarsSuccess: (state, action: PayloadAction<Car[]>) => {
      state.cars = action.payload;
      state.loading = false;
    },
    fetchCarsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchCarsRequest, fetchCarsSuccess, fetchCarsFailure } =
  carSlice.actions;
export default carSlice.reducer;
