import { call, put, takeEvery } from "redux-saga/effects";
import { loginRequest, loginSuccess, loginFailure } from "../store/authSlice";
import { BASE_URL } from "../config/apiConfig";

interface LoginPayload {
  email: string;
  password: string;
}

function* loginUserSaga(action: PayloadAction<LoginPayload>) {
  try {
    const response = yield call(fetch, `${BASE_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: action.payload.email,
        password: action.payload.password,
      }),
    });

    const data = yield response.json();

    if (response.ok) {
      yield put(
        loginSuccess({
          token: data.data.access_token,
          refreshToken: data.data.refresh_token,
        })
      );
    } else {
      yield put(loginFailure(data.message || "Failed to login"));
    }
  } catch (error) {
    yield put(loginFailure(error.message || "Failed to login"));
  }
}

function* authSaga() {
  yield takeEvery(loginRequest.type, loginUserSaga);
}

export default authSaga;
