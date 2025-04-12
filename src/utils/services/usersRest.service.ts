import axios, {AxiosResponse} from "axios";

import {useJWTTokenStore} from "../../stores/JWTStore/index.ts";
import { ChatUserType } from "../types/ChatTypes.ts";
import { secureAxiosApi } from "../helpers/secureAxiosApi.ts";

const usersApi = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/users`,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${useJWTTokenStore.getState().JWT.accessToken}`
    },
});
secureAxiosApi(usersApi)
export const getCompanyUsersList = async (companyId: number):Promise<ChatUserType[]> => {
    const {data} = await usersApi.get('', {params: {company: companyId}});
    return data
};
export const getUserData = (userId: string): Promise<AxiosResponse<string>> => {
    return usersApi.get(`/${userId}`);
};