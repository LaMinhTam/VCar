import { configureStore, combineReducers } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import authReducer from "./authSlice";
import carReducer from "./carSlice";
import { rootSaga } from "./rootSaga"; // Import the combined sagas

const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
  auth: authReducer,
  car: carReducer,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
