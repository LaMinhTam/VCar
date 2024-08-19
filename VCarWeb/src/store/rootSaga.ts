import { all, fork } from "redux-saga/effects";
import authSaga from "../sagas/authSaga";
import carSaga from "../sagas/carSaga";

export function* rootSaga() {
  yield all([fork(authSaga), fork(carSaga)]);
}
