import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";

import { Link } from "react-router-dom";
import "./style.scss";
// import { actLoginApi, actResetReducer } from "./modules/actions";
function Login(): JSX.Element {
  // const dispatch = useDispatch();
  // const { error } = useSelector((state) => state.loginReducer);

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Email is a required field!")
      .email("Email is invalid!"),

    passWord: yup
      .string()
      .required("Password is a required field!")
      .min(8, "Password must be between 8 and 32 characters!")
      .max(32, "Password must be between 8 and 32 characters!"),
  });

  useEffect(() => {
    return () => {
      // dispatch(actResetReducer());
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      passWord: "",
      email: "",
    },
    validationSchema: schema,

    onSubmit: () => {
      // dispatch(actLoginApi(values, props.history));
    },
  });

  return (
    <div className="login">
      <div className="title">Log in to your account</div>
      <div className="form">
        {/* {error ? (
          <span className="text-danger">{error.response?.data.message}</span>
        ) : (
          ""
        )} */}
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group-login">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              value={formik.values.email}
              className="input-global"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter email"
            />
            {formik.touched.email && formik.errors.email ? (
              <span className="text-danger">{formik.errors.email}</span>
            ) : (
              " "
            )}
          </div>
          <div className="form-group-login">
            <label htmlFor="passWord">Password</label>
            <input
              className="input-global"
              type="passWord"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.passWord}
              id="passWord"
              placeholder="Enter password"
            />
            {formik.touched.passWord && formik.errors.passWord ? (
              <span className="text-danger">{formik.errors.passWord}</span>
            ) : (
              " "
            )}
          </div>
          <button type="submit" className="btn-submit-login-template btn-login">
            Login
          </button>
        </form>
      </div>
      <div className="text-center my-2">or</div>
      <div className="text-center">
        <Link to="/register">Sign up for an account</Link>
      </div>
    </div>
  );
}

export default Login;