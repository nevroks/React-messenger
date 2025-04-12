import axios from "axios";
import { CompanyDataType } from "../types/CompanyTypes.ts";
import { secureAxiosApi } from "../helpers/secureAxiosApi.ts";


const companiesApi = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/companies`,
    headers: {
        "Content-Type": "application/json",
    },
});
secureAxiosApi(companiesApi)
export const getCompanyDataById = async (id: number): Promise<CompanyDataType> => {
    const { data } = await companiesApi.get(`/${id}`);
    return data
};