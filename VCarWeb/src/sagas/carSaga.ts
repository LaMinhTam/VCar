import { call, put, takeEvery } from "redux-saga/effects";
import {
  fetchCarsRequest,
  fetchCarsSuccess,
  fetchCarsFailure,
} from "../store/carSlice";
import { axiosInstance } from "../apis/axios";
import { toast } from "react-toastify";

function buildQueryString(filters) {
  const params = new URLSearchParams();

  params.append("province", "Ho_Chi_Minh");
  params.append("page", "1");
  params.append("size", "10");

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
    const response = yield call(
      axiosInstance.get,
      `/cars/search?${queryString}`
    );

    if (response.status === 200) {
      yield put(fetchCarsSuccess(response.data.data));
    } else {
      yield put(
        fetchCarsFailure(response.data.message || "Failed to fetch cars.")
      );
      toast.error(response.data.message || "Failed to fetch cars.");
    }
  } catch (error: any) {
    console.log(error);
    yield put(
      fetchCarsFailure(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch cars."
      )
    );
    toast.error(
      error.response?.data?.message || error.message || "Failed to fetch cars."
    );
  }
}

function* carSaga() {
  yield takeEvery(fetchCarsRequest.type, fetchCars);
}

export default carSaga;
