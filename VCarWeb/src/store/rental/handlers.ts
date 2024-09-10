import { call, put } from "redux-saga/effects";
import { AxiosResponse } from "axios";
import { axiosPrivate } from "../../apis/axios";
import { ENDPOINTS } from "./models";
import { IRentalData, IRentalRequestParams } from "./types";
import {
  getLesseeRentRequest,
  getLesseeRentRequestFailure,
  getLesseeRentRequestSuccess,
  getLessorRentRequest,
  getLessorRentRequestFailure,
  getLessorRentRequestSuccess,
  rentRequest,
  rentRequestFailure,
  rentRequestSuccess,
} from "./reducers";

interface IRentRequestResponse {
  code: number;
  message: string;
  data: IRentalData;
}

interface IListRentRequestResponse {
  code: number;
  message: string;
  data: IRentalData[];
}

export async function handleRentRequest(
  car_id: string,
  rental_start_date: number,
  rental_end_date: number,
  vehicle_hand_over_location: string
) {
  try {
    rentRequest();
    const response: AxiosResponse<IRentRequestResponse> =
      await axiosPrivate.post(ENDPOINTS.RENT_REQUEST, {
        car_id,
        rental_start_date,
        rental_end_date,
        vehicle_hand_over_location,
      });
    const { code, data } = response.data;
    if (code === 200) {
      rentRequestSuccess(data);
      return { success: true, data };
    }
  } catch (error) {
    const typedError = error as Error;
    rentRequestFailure(typedError.message);
    return { success: false, data: null };
  }
}

export function* getLesseeRentRequests(action: {
  type: string;
  payload: IRentalRequestParams;
}) {
  try {
    yield put(getLesseeRentRequest());
    const response: AxiosResponse<IListRentRequestResponse> =
      yield call(axiosPrivate.get, ENDPOINTS.GET_LESSEE_REQUESTS, {
        params: action.payload,
      });
    const { code, data } = response.data;
    if (code === 200) {
      yield put(getLesseeRentRequestSuccess(data));
    }
  } catch (error) {
    const typedError = error as Error;
    yield put(getLesseeRentRequestFailure(typedError.message));
  }
}

export function* lessorGetRentRequests(action: {
  type: string;
  payload: IRentalRequestParams;
}) {
  try {
    yield put(getLessorRentRequest());
    const response: AxiosResponse<IListRentRequestResponse> =
      yield call(axiosPrivate.get, ENDPOINTS.GET_LESSOR_REQUESTS, {
        params: action.payload,
      });
    const { code, data } = response.data;
    if (code === 200) {
      yield put(getLessorRentRequestSuccess(data));
    }
  } catch (error) {
    const typedError = error as Error;
    yield put(getLessorRentRequestFailure(typedError.message));
  }
}
