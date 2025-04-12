import { FC, ReactNode, useRef, useEffect } from "react";
import { useJWTTokenStore } from "../../../stores/JWTStore";
import { io, Socket } from "socket.io-client";
import {  APP_PATHS } from "../../consts/AppConsts";
import router from "../../router/router";
import AppSocketContext from "./AppSocketContext";
import { refreshJWTTokenFunc } from "../../services/tokenRest.service";

type AppSocketProviderPropsType = {
    children: ReactNode;
};

const AppSocketProvider: FC<AppSocketProviderPropsType> = ({ children }) => {
    const JWTToken = useJWTTokenStore(state => state.JWT);
    const { setCurrentJWTTokenAction } = useJWTTokenStore();
    
    const appSocketRef = useRef<Socket>(io(`${import.meta.env.VITE_BACKEND_URL}`, { 
        autoConnect: false,
        extraHeaders: {
            token: JWTToken.accessToken,
        },
    }));

    const initializeSocket = () => {
        if (!appSocketRef.current.connected) {
            appSocketRef.current.connect();

            appSocketRef.current.on("connect", () => {
                console.log("Socket connected");
            });

            appSocketRef.current.on("connect_error", (err) => {
                if (err.message === "Unauthorized") {
                    refreshJWTTokenFunc(JWTToken.refreshToken).then((newJWTToken) => {
                        if (newJWTToken.status !== 201) {
                            router.navigate({ pathname: APP_PATHS.AUTH_PAGE });
                        } else {
                            setCurrentJWTTokenAction(newJWTToken.data);
                            appSocketRef.current.auth = {
                                token: newJWTToken.data.accessToken,
                            };
                            appSocketRef.current.connect(); 
                        }
                    }).catch(() => {
                        router.navigate({ pathname: APP_PATHS.AUTH_PAGE });
                    });;
                }
            });
        }
    };

    useEffect(() => {
        const currentSocket = appSocketRef.current;
    
        if (currentSocket) {
            if (!currentSocket.io.opts.extraHeaders) {
                currentSocket.io.opts.extraHeaders = {};
            }
            currentSocket.io.opts.extraHeaders.token = JWTToken.accessToken;
    
            if (!currentSocket.connected) {
                initializeSocket();
            }
    
            return () => {
                currentSocket.off("connect_error");
                currentSocket.disconnect();
            };
        }
    }, [JWTToken.accessToken, JWTToken.refreshToken]);


    return (
        <AppSocketContext.Provider value={{ appSocket: appSocketRef.current }}>
            {children}
        </AppSocketContext.Provider>
    );
};

export default AppSocketProvider;