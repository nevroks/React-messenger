import {FC, ReactElement} from "react";


type PublicRoutePropsType = {
    element: ReactElement;
}

const PublicRoute: FC<PublicRoutePropsType> = ({element}) => {
    return element;
};

export default PublicRoute;
