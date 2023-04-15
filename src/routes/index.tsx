import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import LoggedTemplate from "../template/LoggedTemplate";
import Dashboard from "../pages/Dashboard";

const routers: RouteObject[] = [
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/login",
        element: <Login />,
    },

    {
        path: "/",
        element: <PrivateRoute element={LoggedTemplate} />,
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />
            },
        ]
    },
    {
        path: "*",
        element: <Navigate to="/dashboard" replace />
    }
];

export const router = createBrowserRouter(routers);
