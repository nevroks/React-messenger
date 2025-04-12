import {FC, ReactElement} from 'react';
import { Navigate} from 'react-router-dom';
import { APP_PATHS } from '../consts/AppConsts';
import {useJWTTokenStore} from "../../stores/JWTStore";

type ProtectedRoutePropsType={
  element:ReactElement;
}

const ProtectedRoute: FC<ProtectedRoutePropsType> = ({element}) => {
  return useJWTTokenStore.getState().JWT ? element : <Navigate to={APP_PATHS.AUTH_PAGE} replace />;
};

export default ProtectedRoute;