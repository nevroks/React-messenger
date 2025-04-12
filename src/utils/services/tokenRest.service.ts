import { JWTTokenType } from '../types/index';
import axios, { AxiosResponse } from "axios";
import { validateOtpUtil } from "../helpers/validateOtpUtil.ts";
import { TokenResponse } from "../types/index.ts";


const tokensApi = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/tokens`,
    headers: {
        "Content-Type": "application/json",
    },
});

export const createJwtToken = (email: string): Promise<AxiosResponse<TokenResponse>> => {
    return tokensApi.post("/get-code", { email });
};

export const validateOtp = (email: string, otp: number): Promise<AxiosResponse<TokenResponse>> => {
    if (!validateOtpUtil(otp.toString())) {
        return Promise.reject(new Error("Invalid OTP format"));
    }

    return tokensApi.post("/validate-code", { email, otp });
};

export const setRequiredData = (
    data: {
        email: string;
        firstName: string;
        lastName: string;
        companyCode?: string;
        companyName?: string;
        otp: number
    }
): Promise<AxiosResponse<TokenResponse>> => {
    return tokensApi.post("/set-required-data", data);
};

export const refreshJWTTokenFunc = (refreshJWTToken: string): Promise<AxiosResponse<JWTTokenType>> => {
    try {
        return tokensApi.post(`/refresh-token`, { refreshToken: refreshJWTToken });
    } catch (err) {
        return Promise.reject(err);
    }
};
