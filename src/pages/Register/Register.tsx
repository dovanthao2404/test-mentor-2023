import { FC, } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import { BuildMessage } from "../../utils/build-message/BuildMessage";
import { loginAction, signUpAction } from "../../redux/user/actions";
import { useAppDispatch } from "../../redux/configureStore";
import { unwrapResult } from "@reduxjs/toolkit";
import { SignInRequest } from "../../redux/user/user.model";
const Register: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    name: yup.string().required(BuildMessage.buildMessageById('V001', ["Name"])),
    email: yup
      .string()
      .required(BuildMessage.buildMessageById('V001', ["Email"]))
      .email(BuildMessage.buildMessageById('V002', ["Email"])),
    phoneNumber: yup
      .string()
      .required(BuildMessage.buildMessageById('V001', ["Phone number"]))
      .matches(
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        "Phone number is invalid!"
      ),
    passWord: yup
      .string()
      .required(BuildMessage.buildMessageById('V001', ["Password"]))
      .min(8, BuildMessage.buildMessageById('V003', ["Password", "8", "32"]))
      .max(32, BuildMessage.buildMessageById('V003', ["Password", "8", "32"])),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      passWord: "",
      name: "",
      phoneNumber: "",
    },
    validationSchema: schema,

    onSubmit: async (values) => {
      try {
        const resultResponse = await dispatch(signUpAction(values));
        const result = unwrapResult(resultResponse);
        const signInRequest: SignInRequest = {
          email: result.email,
          passWord: result.passWord
        };
        await dispatch(loginAction(signInRequest));
        navigate('/');
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <div className="register">
      <div className="title">Sign up for your account</div>
      <div className="form">
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group-login">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={formik.values.name}
              className="input-global"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter name"
            />
            {formik.touched.name && formik.errors.name ? (
              <span className="text-danger">{formik.errors.name}</span>
            ) : (
              " "
            )}
          </div>
          <div className="form-group-login">
            <label htmlFor="phoneNumber">Phone number</label>
            <input
              id="phoneNumber"
              value={formik.values.phoneNumber}
              className="input-global"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter phone number"
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
              <span className="text-danger">{formik.errors.phoneNumber}</span>
            ) : (
              " "
            )}
          </div>
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
            Sign up
          </button>
        </form>
      </div>
      <div className="text-center my-2">or</div>
      <div className="text-center">
        <Link to="/login">Already have an Atlassian account? Log in</Link>
      </div>
    </div>
  );
};

export default Register;
