import axios, { AxiosInstance } from "axios";
import { useJWTTokenStore } from "../../stores/JWTStore";
import { APP_PATHS } from "../consts/AppConsts";
import router from "../router/router";
import { refreshJWTTokenFunc } from "../services/tokenRest.service";

export const secureAxiosApi = (api: AxiosInstance) => {
    api.interceptors.request.use(
        (config) => {
            const token = useJWTTokenStore.getState().JWT.accessToken
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            // If the error status is 401 and there is no originalRequest._retry flag,
            // it means the token has expired and we need to refresh it
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const refreshToken = useJWTTokenStore.getState().JWT.refreshToken;
                    const response = await refreshJWTTokenFunc(refreshToken);
                    const token = response.data;
                    useJWTTokenStore.setState({ JWT: token });
                    // Update the original request headers with the new token
                    // Retry the original request with the new token
                    originalRequest.headers.Authorization = `Bearer ${token.accessToken}`;
                    return axios(originalRequest);
                } catch (error) {
                    // Handle refresh token error or redirect to login
                    originalRequest._retry = false;
                    router.navigate(APP_PATHS.AUTH_PAGE, { replace: true })
                }
            }
            return Promise.reject(error);
        }
    );
}