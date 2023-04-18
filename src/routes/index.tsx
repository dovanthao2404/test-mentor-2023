import { RouteObject, createBrowserRouter } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import LoggedTemplate from '../template/LoggedTemplate';
import LoginTemplate from '../template/LoginTemplate';
import Login from '../pages/Login/Login';
import Register from '../pages/Register';
import Projects from '../pages/Projects';
import ProjectDetail from '../pages/ProjectDetail';

const routers: RouteObject[] = [
  {
    path: '/',
    element: <PrivateRoute element={LoggedTemplate} />,
    children: [
      {
        path: '/',
        element: <Projects />,
      },
      {
        path: '/project-detail/:id',
        element: <ProjectDetail />,
      },
    ],
  },
  {
    path: '/',
    element: <LoginTemplate />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
];

export const router = createBrowserRouter(routers);
