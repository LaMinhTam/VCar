import { call, put, takeEvery } from "redux-saga/effects";
import { loginRequest, loginSuccess, loginFailure } from "../store/authSlice";
import { BASE_URL } from "../config/apiConfig";
import { toast } from "react-toastify";

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
      localStorage.setItem("access_token", data.data.access_token);
      localStorage.setItem("refresh_token", data.data.refresh_token);

      yield put(
        loginSuccess({
          token: data.data.access_token,
          refreshToken: data.data.refresh_token,
          user: {
            id: data.data.id,
            display_name: data.data.display_name,
            email: data.data.email,
            image_url: data.data.image_url,
          },
        })
      );
      toast.success("Login successful!");
    } else {
      yield put(loginFailure(data.message || "Failed to login"));
      toast.error(data.message || "Failed to login");
    }
  } catch (error) {
    yield put(loginFailure(error.message || "Failed to login"));
    toast.error(error.message || "Failed to login");
  }
}

function* authSaga() {
  yield takeEvery(loginRequest.type, loginUserSaga);
}

export default authSaga;
