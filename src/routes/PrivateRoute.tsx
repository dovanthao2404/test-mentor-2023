import { Navigate } from "react-router-dom";

interface Props {
  element: React.FC
}
function PrivateRoute({  element: Element }: Props): JSX.Element {
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Element/>;
}

export default PrivateRoute;
