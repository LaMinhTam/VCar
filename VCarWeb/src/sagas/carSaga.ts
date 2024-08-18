import { call, put, takeEvery } from "redux-saga/effects";
import {
  fetchCarsRequest,
  fetchCarsSuccess,
  fetchCarsFailure,
} from "../store/carSlice";
import { BASE_URL } from "../config/apiConfig.js";

function buildQueryString(filters) {
  const params = new URLSearchParams();

  // Add static parameters
  params.append("province", "Ho_Chi_Minh");
  params.append("page", "1");
  params.append("size", "10");

  // Add filter parameters if they exist
  if (filters.transmission && filters.transmission.length > 0) {
    params.append("transmission", filters.transmission.join(","));
  }

  if (filters.seats && filters.seats.length > 0) {
    params.append("seats", filters.seats.join(","));
  }

  if (
    filters.minConsumption !== undefined &&
    filters.maxConsumption !== undefined
  ) {
    params.append("minConsumption", filters.minConsumption);
    params.append("maxConsumption", filters.maxConsumption);
  }

  if (filters.maxRate !== undefined) {
    params.append("maxRate", filters.maxRate);
  }

  return params.toString();
}

function* fetchCars(action) {
  try {
    const queryString = buildQueryString(action.payload);
    const response = yield call(fetch, `${BASE_URL}/cars?${queryString}`);
    console.log(`${BASE_URL}/cars?${queryString}`);

    const data = yield response.json();
    yield put(fetchCarsSuccess(data));
  } catch (error) {
    console.log(error);
    yield put(fetchCarsFailure("Failed to fetch cars."));
  }
}

function* carSaga() {
  yield takeEvery(fetchCarsRequest.type, fetchCars);
}

export default carSaga;
