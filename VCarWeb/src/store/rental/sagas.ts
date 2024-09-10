import { takeLatest } from "redux-saga/effects";
import {
  getLesseeRentRequests,
  lessorGetRentRequests,
} from "./handlers";
import { GET_LESSEE_REQUESTS, GET_LESSOR_REQUESTS } from "./action";

function* rentalSaga() {
  yield takeLatest(GET_LESSEE_REQUESTS, getLesseeRentRequests);
  yield takeLatest(GET_LESSOR_REQUESTS, lessorGetRentRequests);
}

export default rentalSaga;
