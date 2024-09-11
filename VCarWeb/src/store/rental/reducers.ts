import { IContractData, IRentalData, IRentalState } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IRentalState = {
  loading: false,
  error: null,
  lesseeRequest: {} as IRentalData,
  lessorListRequest: [],
  lesseeListRequest: [],
  lesseeListContract: [],
  lessorListContract: [],
};

const rentalSlice = createSlice({
  name: "rental",
  initialState,
  reducers: {
    rentRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    rentRequestSuccess: (
      state,
      action: PayloadAction<IRentalData>
    ) => {
      state.loading = false;
      state.lesseeRequest = action.payload;
    },
    rentRequestFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    getLesseeRentRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getLesseeRentRequestSuccess(
      state,
      action: PayloadAction<IRentalData[]>
    ) {
      state.loading = false;
      state.lesseeListRequest = action.payload;
    },
    getLesseeRentRequestFailure(
      state,
      action: PayloadAction<string>
    ) {
      state.loading = false;
      state.error = action.payload;
    },
    getLessorRentRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getLessorRentRequestSuccess(
      state,
      action: PayloadAction<IRentalData[]>
    ) {
      state.loading = false;
      state.lessorListRequest = action.payload;
    },
    getLessorRentRequestFailure(
      state,
      action: PayloadAction<string>
    ) {
      state.loading = false;
      state.error = action.payload;
    },
    getLesseeContract (state) {
      state.loading = true;
      state.error = null;
    },
    getLesseeContractSuccess (
      state,
      action: PayloadAction<IContractData[]>
    ) {
      state.loading = false;
      state.lesseeListContract = action.payload;
    },
    getLesseeContractFailure (
      state,
      action: PayloadAction<string>
    ) {
      state.loading = false;
      state.error = action.payload;
    },
    getLessorContract (state) {
      state.loading = true;
      state.error = null;
    },
    getLessorContractSuccess (
      state,
      action: PayloadAction<IContractData[]>
    ) {
      state.loading = false;
      state.lessorListContract = action.payload;
    },
    getLessorContractFailure (
      state,
      action: PayloadAction<string>
    ) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  rentRequest,
  rentRequestSuccess,
  rentRequestFailure,
  getLesseeRentRequest,
  getLesseeRentRequestSuccess,
  getLesseeRentRequestFailure,
  getLessorRentRequest,
  getLessorRentRequestSuccess,
  getLessorRentRequestFailure,
  getLesseeContract,
  getLesseeContractSuccess,
  getLesseeContractFailure,
  getLessorContract,
  getLessorContractSuccess,
  getLessorContractFailure,
} = rentalSlice.actions;

export default rentalSlice.reducer;
