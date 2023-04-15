import './App.scss';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useAppSelector } from './redux/configureStore';
import { createPortal } from 'react-dom';
import Loading from './components/Loading';
import { message } from 'antd';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hideMessage } from './redux/message/slice';
// import { UserService } from './services/UserService';
// import { signOut } from './redux/user/slice';

function App(): React.ReactElement {
  const dispatch = useDispatch();
  const { isLoading } = useAppSelector((state) =>
    state.loading,
  );
  const messageInfo = useAppSelector((state) => state.message);
  // const userLogin = useAppSelector((state) => state.users.userLogin);

  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    if (messageInfo.isShow) {
      messageApi.open({
        type: messageInfo.type,
        content: messageInfo.content,
      }).then(() => {
        dispatch(hideMessage());
      });
    } else {

    }
  }, [messageInfo]);

  // useEffect(() => {
  //   if (userLogin && userLogin.accessToken) {
  //     UserService.testToken().then(() => {
  //       if(true) {}
  //     }).catch((err) => {
  //       if (!(err.response.data.message === 'Đăng nhập thành công!')) {
  //         dispatch(signOut())
  //       }
  //     })
  //   }
  // }, [userLogin]);


  return (
    <>
      {contextHolder}
      {isLoading &&
        createPortal(
          <Loading />,
          document.body
        )
      }
      <RouterProvider router={router} />
    </>
  );
}

export default App;
