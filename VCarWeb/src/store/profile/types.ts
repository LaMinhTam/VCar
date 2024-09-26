import { IUser } from "../auth/types";

export interface UpdateProfilePayload {
    display_name: string;
    phone_number: string;
}

export interface UpdateLicensePayload {
    id: string; // id of the license
    full_name: string;
    dob: string;
    license_image_url: string;
}

export interface UpdateCitizenIdentificationPayload {
    identification_number: string;
    issued_date: string;
    issued_location: string;
    permanent_address: string;
    contact_address: string;
    identification_image_url: string
}

export type ProfileState = {
    user: IUser,
    loading: boolean,
    error: string | null
}