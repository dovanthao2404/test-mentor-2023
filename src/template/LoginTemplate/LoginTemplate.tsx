import "./style.scss";
import logoJira from "./../../assets/images/login-jira-screen-short.png";
import imgFooterLeft from "./../../assets/images/jira-left.d0ab0e98.svg";
import imgFooterRight from "./../../assets/images/jira-right.9746753a.svg";
import { Location, Navigate, Outlet, useLocation } from "react-router-dom";
import { FC } from "react";
import { LocalStorage } from "../../common/enum/localstorage";

// import Loading from "../../components/Loading/index";
 const LoginTemplate: FC = (): JSX.Element => {
  const location: Location = useLocation();
  const isAuthenticated = localStorage.getItem(LocalStorage.UserLogin);

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return (
    <div className="login-template">
      <div
        className="top"
        style={{
          display: location.pathname === "/register" ? "none" : "block",
        }}
      >
        <img srcSet={`${logoJira} 2x`} alt="" />
      </div>
      <div className="login-container">
        <div className="login-content">
          <Outlet />
        </div>
      </div>
      <footer>
        <img src={imgFooterLeft} alt="" />
        <img src={imgFooterRight} alt="" />
      </footer>
    </div>
  );


};
export default LoginTemplate