import Cookies from "js-cookie";

import { jwtDecode } from "jwt-decode";
import { IUser } from "../store/auth/types";
import CryptoJS from "crypto-js";

const accessTokenKey = "VCAR_ACCESS_TOKEN";
const refreshTokenKey = "VCAR_REFRESH_TOKEN";
const userKey = "VCAR_USER";

const objCookies = {
  expires: 30,
  domain:
    typeof window !== "undefined"
      ? window.location.hostname
      : "localhost",
};

export const saveAccessToken = (access_token: string) => {
  if (access_token) {
    Cookies.set(accessTokenKey, access_token, {
      ...objCookies,
    });
  } else {
    Cookies.remove(accessTokenKey, {
      ...objCookies,
      path: "/",
      domain:
        typeof window !== "undefined"
          ? window.location.hostname
          : "localhost",
    });
  }
};

export const saveRefreshToken = (refresh_token: string) => {
  if (refresh_token) {
    Cookies.set(refreshTokenKey, refresh_token, {
      ...objCookies,
    });
  } else {
    Cookies.remove(refreshTokenKey, {
      ...objCookies,
      path: "/",
      domain:
        typeof window !== "undefined"
          ? window.location.hostname
          : "localhost",
    });
  }
};

export const saveUser = (id: string) => {
  if (id) {
    Cookies.set(userKey, id, {
      ...objCookies,
    });
  } else {
    Cookies.remove(userKey, {
      ...objCookies,
      path: "/",
      domain: window.location.hostname,
    });
  }
};

export const getAccessToken = () => {
  const access_token = Cookies.get(accessTokenKey);
  return access_token;
};

export const getRefreshToken = () => {
  const refresh_token = Cookies.get(refreshTokenKey);
  return refresh_token;
};

export const getUser = () => {
  const user = Cookies.get(userKey);
  return user;
};

export const isTokenExpire = (token: string) => {
  if (!token) return true;
  const decodedToken = jwtDecode(token);

  const currentTime = Math.floor(Date.now() / 1000);

  if (decodedToken.exp && decodedToken.exp < currentTime) {
    return true;
  } else {
    return false;
  }
};

export function getUserInfoFromCookie() {
  const accessToken = getAccessToken();
  const encryptedUser = getUser();
  let decryptedData = null;
  if (encryptedUser && accessToken) {
    const bytes = CryptoJS.AES.decrypt(encryptedUser, accessToken);
    decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  return decryptedData;
}

export function saveUserInfoToCookie(
  user: IUser,
  accessToken: string
) {
  const cipherText = CryptoJS.AES.encrypt(
    JSON.stringify(user),
    accessToken
  ).toString();
  saveUser(cipherText);
}
