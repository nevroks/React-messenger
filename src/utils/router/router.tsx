import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { APP_PATHS } from "../consts/AppConsts.ts";


// -----Route middlewares-----
import ProtectedRoute from "./ProtectedRoute.tsx";
import PublicRoute from "./PublicRoute.tsx";
import UnAuthorizedRoute from "./UnAuthorizedRoute.tsx";
// -----Route middlewares-----

// -----Layout-----
import Layout from "../../components/Layout/Layout.tsx";
// -----Layout-----

// -----Pages-----
const ChatsPage = lazy(() => import("../../pages/ChatsPage/ChatsPage.tsx"))
const SingleChatPage = lazy(() => import("../../pages/SingleChatPage/SingleChatPage.tsx"))
const SingleChatSearchPage = lazy(() => import("../../pages/SingleChatSearchPage/SingleChatSearchPage.tsx"))
const AuthPage = lazy(() => import("../../pages/AuthPage/AuthPage.tsx"))
// -----Pages-----

const router = createBrowserRouter([
  {
    path: APP_PATHS.ROOT,
    element: <Layout />,
    children: [
      {
        path: APP_PATHS.CHAT_PAGE,
        element: <ProtectedRoute element={<ChatsPage />} />,
        children: [
          {
            path: APP_PATHS.SINGLE_CHAT_PAGE,
            element: <ProtectedRoute element={<SingleChatPage />} />,
            children: [
              {
                path: APP_PATHS.SINGLE_CHAT_SEARCH_PAGE,
                element: <ProtectedRoute element={<SingleChatSearchPage />} />,
              }
            ],
          },
        ],
      },

    ],
  },
  {
    path: APP_PATHS.AUTH_PAGE,
    element: <UnAuthorizedRoute element={<AuthPage />} />,
  },
  {
    path: "*",
    element: <PublicRoute element={<div>404 - Page Not Found</div>} />,
  },
]);

export default router;

