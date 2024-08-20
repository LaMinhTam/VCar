import { call, put, takeEvery } from "redux-saga/effects";
import { loginRequest, loginSuccess, loginFailure } from "../store/authSlice";
import { axiosInstance } from "../apis/axios";
import { toast } from "react-toastify";

interface LoginPayload {
  email: string;
  password: string;
}

function* loginUserSaga(action: PayloadAction<LoginPayload>) {
  try {
    const response = yield call(axiosInstance.post, "/auth/signin", {
      email: action.payload.email,
      password: action.payload.password,
    });

    if (response.status === 200) {
      const data = response.data;

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
      yield put(loginFailure(response.data.message || "Failed to login"));
      toast.error(response.data.message || "Failed to login");
    }
  } catch (error: any) {
    yield put(
      loginFailure(
        error.response?.data?.message || error.message || "Failed to login"
      )
    );
    toast.error(
      error.response?.data?.message || error.message || "Failed to login"
    );
  }
}

function* authSaga() {
  yield takeEvery(loginRequest.type, loginUserSaga);
}

export default authSaga;
