import { FC, useEffect, useState } from 'react';
import { Button } from 'antd';
import { Input } from 'antd';
import { FileAddOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import './style.scss';
import { useAppDispatch } from '../../redux/configureStore';
import {
  assignUserToProject,
  createTask,
  deleteUserFromProject,
  getProjects,
  updateProject,
} from '../../redux/project/actions';
import ProjectTable from './ProjectTable';
import { DrawerPayload, hideDrawer, showDrawer } from '../../redux/drawer/slice';
import FormCreateProject from './FormCreateProject/index';
import {
  AssignUserToProjectRequest,
  CreateTaskRequest,
  RemoveUserFromProjectRequest,
  UpdateProjectRequest,
} from '../../redux/project/project.model';
import { unwrapResult } from '@reduxjs/toolkit';
import { showMessage } from '../../redux/message/slice';
import { Message } from '../../utils/message/Message';
import { MessageEnum } from '../../common/enum/message';
import { AxiosError } from 'axios';
import { BaseApiResponse } from '../../common/model/BaseApiResponse';
import { createPortal } from 'react-dom';
import ModalCreateTask from '../../components/ModalCreateTask';

const Projects: FC = () => {
  const dispatch = useAppDispatch();
  const [searchValue, setSetValue] = useState<string>('');
  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const [openCreateTask, setOpenCreateTask] = useState<boolean>(false);

  const handleAssignUserToProject = async (request: AssignUserToProjectRequest): Promise<void> => {
    try {
      const resultResponse = await dispatch(assignUserToProject(request));
      unwrapResult(resultResponse);

      dispatch(showMessage(new Message('success', MessageEnum.S006)));
      dispatch(getProjects());
    } catch (err) {
      const error = err as AxiosError<BaseApiResponse<string>>;
      const message = new Message('warning', '');
      if (error.response?.data?.statusCode === 403) {
        message.content = MessageEnum.E002;
      } else {
        if (error.response?.data?.message) {
          message.content = error.response?.data?.message;
        } else {
          message.content = MessageEnum.E003;
          message.type = 'error';
        }
      }
      dispatch(showMessage(message));
    }
  };

  const handleDeleteUserFomProject = async (
    request: RemoveUserFromProjectRequest,
  ): Promise<void> => {
    try {
      const resultResponse = await dispatch(deleteUserFromProject(request));
      unwrapResult(resultResponse);

      dispatch(showMessage(new Message('success', MessageEnum.S007)));
      dispatch(getProjects());
    } catch (err) {
      const error = err as AxiosError<BaseApiResponse<string>>;
      const message = new Message('warning', '');
      if (error.response?.data?.statusCode === 403) {
        message.content = MessageEnum.E002;
      } else {
        if (error.response?.data?.message) {
          message.content = error.response?.data?.message;
        } else {
          message.content = MessageEnum.E003;
          message.type = 'error';
        }
      }
      dispatch(showMessage(message));
    }
  };

  const handleUpdateProject = async (request: UpdateProjectRequest): Promise<void> => {
    try {
      const resultResponse = await dispatch(updateProject(request));
      unwrapResult(resultResponse);

      dispatch(showMessage(new Message('success', MessageEnum.S008)));
      dispatch(hideDrawer());
      dispatch(getProjects());
    } catch (err) {
      const error = err as AxiosError<BaseApiResponse<string>>;
      const message = new Message('warning', '');
      if (error.response?.data?.statusCode === 403) {
        message.content = MessageEnum.E002;
      } else {
        if (error.response?.data?.message) {
          message.content = error.response?.data?.message;
        } else {
          message.content = MessageEnum.E003;
          message.type = 'error';
        }
      }
      dispatch(showMessage(message));
    }
  };

  const handleCloseModal = (): void => {
    setOpenCreateTask(false);
  };

  const handleSubmit = async (taskRequest: CreateTaskRequest): Promise<void> => {
    try {
      const reponse = await dispatch(createTask(taskRequest));
      unwrapResult(reponse);

      dispatch(showMessage(new Message('success', MessageEnum.S009)));
      dispatch(getProjects());
      handleCloseModal();
    } catch (err) {
      const error = err as AxiosError<BaseApiResponse<string>>;
      const message = new Message('warning', '');
      if (error.response?.data?.statusCode === 403) {
        message.content = MessageEnum.E002;
      } else {
        if (error.response?.data?.message) {
          message.content = error.response?.data?.message;
        } else {
          message.content = MessageEnum.E003;
          message.type = 'error';
        }
      }
      dispatch(showMessage(message));
    }
  };

  return (
    <div className="profile">
      <div className="box-button">
        <Button
          type="primary"
          onClick={(): void => {
            const drawerPayload: DrawerPayload = {
              DrawerContent: <FormCreateProject />,
              title: 'Create Project',
              onClose: () => {
                return dispatch(hideDrawer());
              },
            };
            dispatch(showDrawer(drawerPayload));
          }}
        >
          <p>Create Project</p>
          <FileAddOutlined className="btn-icon" />
        </Button>
        <Button
          type="primary"
          onClick={(): void => {
            setOpenCreateTask(true);
          }}
        >
          <p>Create Task</p> <PlusOutlined className="btn-icon" />
        </Button>
      </div>
      <div className="profile-form">
        <Input
          className="input-search"
          placeholder="Enter your project"
          onChange={(e): void => {
            setSetValue(e.target.value);
          }}
          suffix={<SearchOutlined />}
        />
      </div>
      <div className="table-project">
        <ProjectTable
          searchValue={searchValue}
          handleAssignUserToProject={handleAssignUserToProject}
          handleDeleteUserFomProject={handleDeleteUserFomProject}
          handleUpdateProject={handleUpdateProject}
        />
      </div>
      {openCreateTask &&
        createPortal(
          <ModalCreateTask handleSubmit={handleSubmit} onClose={handleCloseModal} type="list" />,
          document.body,
        )}
    </div>
  );
};

export default Projects;
