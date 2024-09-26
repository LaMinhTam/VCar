import { AxiosError } from "axios";
import { axiosPrivate } from "../../apis/axios";
import { UpdateProfilePayload } from "./types";
import { IUser } from "../auth/types";
import { ENDPOINTS } from "./models";

interface IUpdateProfileResponse {
    data: IUser;
    code: number;
    message: string;
}

export const getMe = async () => {
    try {
        const response = await axiosPrivate.get(ENDPOINTS.GET_ME);
        const { data, code } = response.data as IUpdateProfileResponse;
        if(code === 200) {
            return {success: true, data};
        }
    } catch (error) {
        const typedError = error as AxiosError;
        console.log(typedError.response?.data);
        return {success: false, data: null};
    }
}

export const updateProfile = async (payload: UpdateProfilePayload) => {
    try {
        const response = await axiosPrivate.put(ENDPOINTS.UPDATE_PROFILE, payload);
        const { data, code } = response.data as IUpdateProfileResponse;
        if(code === 200) {
            return {success: true, data};
        }
    } catch (error) {
        const typedError = error as AxiosError;
        console.log(typedError.response?.data);
        return {success: false, data: null};
    }
}