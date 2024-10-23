import {AxiosResponse} from 'axios';
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
