import {all} from 'redux-saga/effects';
import authSaga from './auth/sagas';
import carSaga from './car/sagas';
import profileSagas from './profile/sagas';
import rentalSaga from './rental/sagas';

export default function* rootSaga() {
  yield all([authSaga(), carSaga(), profileSagas(), rentalSaga()]);
}
