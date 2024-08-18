import {combineReducers, configureStore} from '@reduxjs/toolkit';

import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
import authSlice from './auth/reducers'; // Correct the import

const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
  auth: authSlice,
});

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof reducer>;

export default store;
