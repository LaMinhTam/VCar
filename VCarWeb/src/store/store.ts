import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const reducer = combineReducers({
  auth: authReducer,
});

const store = configureStore({
  reducer,
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export default store;
