import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login/Login";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    //   {
    //     path: "/detail",
    //     element: <Detail />,
    //   },
    //   {
    //     path: "/admin",
    //     element: <PrivateRoute element={AdminTemplate }/>,
    //     children: [
    //       {
    //         path: '/admin',
    //         element: <DashBoard/>
    //       },
    //       {
    //         path: '/admin/dashboard',
    //         element: <DashBoard/>
    //       },
    //       {
    //         path: '/admin/users',
    //         element: <Users/>
    //       }
    //     ]
    //   },
    //   {
    //     path: "*",
    //     element: <NotFoundTemplate/>
    //   }
]);
