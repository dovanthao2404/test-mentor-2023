import { useFormik } from 'formik';
import * as yup from 'yup';

import { Link, useNavigate } from 'react-router-dom';
import './style.scss';
import { useAppDispatch } from '../../redux/configureStore';
import { BuildMessage } from '../../utils/build-message/BuildMessage';
import { SignInRequest } from '../../redux/user/user.model';
import { loginAction } from '../../redux/user/actions';
import { MessagePayload, showMessage } from '../../redux/message/slice';
import { MessageEnum } from '../../common/enum/message';
import { unwrapResult } from '@reduxjs/toolkit';

function Login(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const schema = yup.object().shape({
    email: yup
      .string()
      .required(BuildMessage.buildMessageById('V001', ['Email']))
      .email(BuildMessage.buildMessageById('V002', ['Email'])),

    passWord: yup
      .string()
      .required(BuildMessage.buildMessageById('V001', ['Password']))
      .min(8, BuildMessage.buildMessageById('V003', ['Password', '8', '32']))
      .max(32, BuildMessage.buildMessageById('V003', ['Password', '8', '32'])),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      passWord: '',
    },
    validationSchema: schema,

    onSubmit: async (values) => {
      const signInRequest: SignInRequest = {
        email: values.email,
        passWord: values.passWord,
      };
      try {
        const response = await dispatch(loginAction(signInRequest));
        unwrapResult(response);
        const message: MessagePayload = {
          content: MessageEnum.S001,
          type: 'success',
        };
        dispatch(showMessage(message));
        navigate('/');
      } catch (err) {}
    },
  });

  return (
    <div className="login">
      <div className="title">Log in to your account</div>
      <div className="form">
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
              ' '
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
              ' '
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
