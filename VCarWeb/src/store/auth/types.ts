export interface ILoginResponse {
  code: number;
  message: string;
  data: {
    id: string;
    display_name: string;
    email: string;
    image_url: string;
    access_token: string;
    refresh_token: string;
  };
}

export interface AuthState {
  user: IUser | null;
  loading: boolean;
  error: null | string;
}

export interface IUser {
  id: string;
  display_name: string;
  email: string;
  image_url: string;
  phone_number?: string;
}
