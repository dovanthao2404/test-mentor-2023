// import { Navigate } from "react-router-dom";

import { Navigate } from "react-router-dom";
import { LocalStorage } from "../common/enum/localstorage";

interface Props {
  element: React.FC
}
function PrivateRoute({  element: Element }: Props): JSX.Element {
  const isAuthenticated = localStorage.getItem(LocalStorage.UserLogin);

  if (!isAuthenticated) {
    localStorage.clear()
    return <Navigate to="/login" replace />
  }

  return <Element/>;
}

export default PrivateRoute;
