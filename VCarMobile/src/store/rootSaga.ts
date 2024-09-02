import {all} from 'redux-saga/effects';
import authSaga from './auth/sagas';
import carSaga from './car/sagas';

export default function* rootSaga() {
  yield all([authSaga(), carSaga()]);
}
