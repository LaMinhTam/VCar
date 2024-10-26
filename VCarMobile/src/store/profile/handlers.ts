import {AxiosError, AxiosResponse} from 'axios';
import {IUser} from './types';
import {call, put} from 'redux-saga/effects';
import {axiosPrivate} from '../../apis/axios';
import {ENDPOINTS} from './models';
import {getMeFailed, getMeSuccess} from './reducers';

interface IUserResponse {
  code: number;
  message: string;
  data: IUser;
}

interface IUpdateProfileResponse {
  data: IUser;
  code: number;
  message: string;
}

interface IUpdateMetaMaskAddressResponse {
  code: number;
  message: string;
  data?: string
}

export function* getMe() {
  try {
    const response: AxiosResponse<IUserResponse> = yield call(
      axiosPrivate.get,
      ENDPOINTS.GET_ME,
    );
    yield put(getMeSuccess(response.data.data));
  } catch (error: any) {
    yield put(getMeFailed(error.message));
  }
}

export const updateMetamaskAddress = async (metamaskAddress: string) => {
  try {
      const response: AxiosResponse<IUpdateMetaMaskAddressResponse> = await axiosPrivate.put(ENDPOINTS.UPDATE_METAMASK_ADDRESS, {address: metamaskAddress});
      const { message, code } = response.data;
      if(code === 200) {
          return {success: true, message};
      }
  } catch (error) {
      const typedError = error as AxiosError;
      console.log(typedError.response?.data);
      return {success: false, message: null};
  }
}

export const buyToken = async () => {
  try {
      const response: AxiosResponse<IUpdateMetaMaskAddressResponse> = await axiosPrivate.post(ENDPOINTS.BUY_TOKEN);
      const { data, code } = response.data;
      if(code === 200) {
          return {success: true, data};
      }
  } catch (error) {
      const typedError = error as AxiosError;
      console.log(typedError.response?.data);
      return {success: false, data: null};
  }
}
