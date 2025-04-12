import {FC, ReactElement} from 'react';
import {useJWTTokenStore} from "../../stores/JWTStore";
import {Navigate} from "react-router-dom";
import {APP_PATHS} from "../consts/AppConsts.ts";

type UnAuthorizedRoutePropsType = {
    element: ReactElement
}

const UnAuthorizedRoute: FC<UnAuthorizedRoutePropsType> = ({element}) => {
    // return useJWTTokenStore.getState().JWT ? <Navigate to={APP_PATHS.CHAT_PAGE} replace/> : element;
    return element
};

export default UnAuthorizedRoute;