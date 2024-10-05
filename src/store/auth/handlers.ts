import { ENDPOINTS } from "./models";
import { axiosInstance, axiosPrivate } from "../../apis/axios";
import {
  ILoginResponse,
  INotification,
  INotificationParams,
} from "./types";
import { loginFailure, loginRequest, loginSuccess } from "./reducers";
import { AxiosResponse } from "axios";
import { saveAccessToken, saveRefreshToken } from "../../utils";
import { generateToken } from "../../config/firebaseConfig";
import { IMetaData } from "../rental/types";

// function* login(action: {
//   type: string;
//   payload: { email: string; password: string };
// }) {
//   try {
//     const { email, password } = action.payload;
//     yield put(loginRequest());
//     const response: AxiosResponse<ILoginResponse> = yield call(
//       axiosInstance.post,
//       ENDPOINTS.LOGIN,
//       { email, password }
//     );
//     if (response.data.code === 200) {
//       const {
//         access_token,
//         refresh_token,
//         id,
//         display_name,
//         email,
//         image_url,
//       } = response.data.data;
//       const user = {
//         id,
//         display_name,
//         email,
//         image_url,
//       };
//       saveAccessToken(access_token);
//       saveRefreshToken(refresh_token);
//       saveUserInfoToCookie(user, access_token);
//       yield put(loginSuccess(user));
//     }
//   } catch (error) {
//     const typedError = error as Error;
//     console.log("error:", typedError.message);
//     yield put(loginFailure(typedError.message));
//   }
// }

interface INotificationResponse {
  code: number;
  message: string;
  data: INotification[];
  meta: IMetaData;
}

async function login(email: string, password: string) {
  try {
    loginRequest();
    const response: AxiosResponse<ILoginResponse> =
      await axiosInstance.post(ENDPOINTS.LOGIN, { email, password });
    if (response.data.code === 200) {
      const {
        access_token,
        refresh_token,
        id,
        display_name,
        email,
        image_url,
      } = response.data.data;
      const user = {
        id,
        display_name,
        email,
        image_url,
      };
      saveAccessToken(access_token);
      saveRefreshToken(refresh_token);
      loginSuccess(user);
      return {
        success: response.data.code === 200,
        token: access_token,
      };
    }
  } catch (error) {
    const typedError = error as Error;
    loginFailure(typedError.message);
    return { success: false, token: null };
  }
}

async function subscribeDevice() {
  const token = await generateToken();
  if (token) {
    const response = await axiosInstance.post(
      ENDPOINTS.SUBSCRIBE_DEVICE(token)
    );
    return response.data;
  }
}

async function getListNotifications(payload: INotificationParams) {
  try {
    const response: AxiosResponse<INotificationResponse> =
      await axiosPrivate.get(ENDPOINTS.GET_NOTIFICATIONS, {
        params: payload,
      });
    const { code, data, meta } = response.data;
    if (code === 200) {
      return { success: true, data, meta };
    }
  } catch (error) {
    const typedError = error as Error;
    console.log("getListNotifications ~ typedError:", typedError);
    return { success: false, data: [], meta: {} as IMetaData };
  }
}

async function handleMakeNotificationAsRead(id: string) {
  try {
    const response = await axiosPrivate.put(
      ENDPOINTS.MAKE_AS_READ(id)
    );
    if (response.data.code === 200) {
      return {
        success: true,
        data: response.data.data as INotification,
      };
    }
  } catch (error) {
    console.log("handleMakeNotificationAsRead ~ error:", error);
    return { success: false, data: {} as INotification };
  }
}

export {
  login,
  subscribeDevice,
  getListNotifications,
  handleMakeNotificationAsRead,
};
