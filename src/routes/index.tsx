import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import LoggedTemplate from "../template/LoggedTemplate";
import Dashboard from "../pages/Dashboard";
import LoginTemplate from "../template/LoginTemplate";
import Login from "../pages/Login/Login";
import Register from "../pages/Register";

const routers: RouteObject[] = [

    {
        path: "/",
        element: <PrivateRoute element={LoggedTemplate} />,
        children: [
            {
                path: '/',
                element: <Dashboard />
            },
            {
                path: '/dashboard',
                element: <Dashboard />
            },
        ]
    },
    {
        path: "/",
        element: <LoginTemplate />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to="/dashboard" replace />
    }
];

export const router = createBrowserRouter(routers);
