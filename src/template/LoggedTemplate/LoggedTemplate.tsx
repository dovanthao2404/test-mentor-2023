import React, { useEffect } from 'react';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import logoJira from '../../assets/images/sd-integrations-logo-jira.png';
import './style.scss';

import { ProjectOutlined, PoweroffOutlined } from '@ant-design/icons';
import Drawer from '../../components/Drawer';
import { useAppDispatch } from '../../redux/configureStore';
import {
  getAllPriority,
  getAllStatus,
  getAllTaskType,
  getProjectCategory,
} from '../../redux/master/actions';
import { signOut } from '../../redux/user/slice';
type Sidebar = {
  key: string;
  icon: React.ElementType;
  label: string;
};

const { Header, Content, Sider } = Layout;

const sidebars: Sidebar[] = [
  {
    key: '/',
    icon: ProjectOutlined,
    label: 'Projects',
  },
  {
    key: '/logout',
    icon: PoweroffOutlined,
    label: 'Logout',
  },
];

const sidebar: MenuProps['items'] = sidebars.map((item) => {
  return {
    key: item.key,
    icon: React.createElement(item.icon),
    label: item.label,
  };
});

const App: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // call data master
  useEffect(() => {
    dispatch(getAllTaskType());
    dispatch(getAllStatus());
    dispatch(getProjectCategory());
    dispatch(getAllPriority());
  }, []);

  return (
    <div className="logged-template-common">
      <Layout hasSider>
        <Sider
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <img src={logoJira} alt="" className="logo-jira-common" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[`${window.location.pathname}`]}
            items={sidebar}
            onClick={(item): void => {
              if (item.key !== '/logout') {
                navigate(item.key);
              } else {
                dispatch(signOut());
              }
            }}
          />
        </Sider>
        <Layout className="site-layout" style={{ marginLeft: 200 }}>
          <Header
            className="header"
            style={{
              background: '#fff',
              padding: '0 1rem',
              justifyContent: ' space-between',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <div>
              <img
                src={''}
                onError={({ currentTarget }): void => {
                  currentTarget.onerror = null;
                  currentTarget.src =
                    'https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png';
                }}
                alt="avatar"
                className="header-avatar"
                style={{
                  width: '40px',
                  height: '40px',
                }}
              />
            </div>
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      <Drawer />
    </div>
  );
};

export default App;
