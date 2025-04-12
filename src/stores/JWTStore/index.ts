import {immer} from "zustand/middleware/immer";
import {create} from "zustand";
import {JWTTokenType} from "../../utils/types";
import {persist} from "zustand/middleware";


interface IJWTTokenStoreState {
    JWT: JWTTokenType;
    setCurrentJWTTokenAction:(newJWT: JWTTokenType)=>void;
    setCurrentJWTAccessTokenAction: (newAccessToken: string) => void
}

export const useJWTTokenStore = create<IJWTTokenStoreState>()(persist(immer((set) => ({
    JWT: {
        accessToken: "",
        refreshToken: ""
    },
    setCurrentJWTTokenAction: (newJWT: JWTTokenType) => {
        set((state) => {
            state.JWT = newJWT
        })
    },
    setCurrentJWTAccessTokenAction: (newAccessToken: string) => {
        set((state) => {
            state.JWT.accessToken = newAccessToken
        })
    }
})),{
    name:"st"
}))


