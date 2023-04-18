import { FC, useEffect, useState } from 'react';

import './style.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/configureStore';
import {
  assignUserToProject,
  createTask,
  getProjectById,
  getTaskDetailById,
  updateTask,
} from '../../redux/project/actions';
import Header from './Header';
import Content from './Content';
import {
  AssignUserToProjectRequest,
  CreateTaskRequest,
  Task,
  UpdateTaskRequest,
} from '../../redux/project/project.model';
import { hideLoading, showLoading } from '../../redux/loading/slice';
import { showMessage } from '../../redux/message/slice';
import { Message } from '../../utils/message/Message';
import { MessageEnum } from '../../common/enum/message';
import { unwrapResult } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { BaseApiResponse } from '../../common/model/BaseApiResponse';
import { createPortal } from 'react-dom';
import ModalCreateTask from '../../components/ModalCreateTask';
import ModalUpdateTask from '../../components/ModalUpdateTask';
const ProjectDetail: FC = () => {
  const [openCreateTask, setOpenCreateTask] = useState<boolean>(false);
  const [openUpdateTask, setOpenUpdateTask] = useState<boolean>(false);

  const [listTask, setListTask] = useState<Task[]>([]);
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.loading.isLoading);

  const [arrUserFilter, setArrUserFilter] = useState<number[]>([]);
  const [arrUserFilterCheckbox, setArrUserFilterCheckbox] = useState<number[]>([]);
  const [arrUserFilterFirst, setArrUserFilterFirst] = useState<number[]>([]);
  const [valueSearch, setValueSearch] = useState<string>('');
  const { id } = useParams();
  const { userLogin } = useAppSelector((state) => state.users);
  const navigate = useNavigate();

  useEffect(() => {
    (async (): Promise<void> => {
      if (id) {
        try {
          dispatch(showLoading());
          const response = await dispatch(getProjectById(id));
          const result = unwrapResult(response);
          if (result) {
            if (
              result.creator &&
              result.creator.id !== userLogin.id &&
              !result.members.find((item) => item.userId != userLogin.id)
            ) {
              navigate('/');
            }
          }
        } catch (err) {
          const error = err as AxiosError;
          if (error.response?.status === 404) {
            dispatch(showMessage(new Message('warning', MessageEnum.E004)));
          } else {
            dispatch(showMessage(new Message('error', MessageEnum.E003)));
          }
          navigate('/');
        } finally {
          dispatch(hideLoading());
        }
      }
    })();
  }, [id]);

  const handleAssignUserToProject = async (request: AssignUserToProjectRequest): Promise<void> => {
    try {
      const resultResponse = await dispatch(assignUserToProject(request));
      unwrapResult(resultResponse);
      dispatch(showMessage(new Message('success', MessageEnum.S006)));
      dispatch(getProjectById(request.projectId.toString()));
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
      const response = await dispatch(createTask(taskRequest));
      unwrapResult(response);

      dispatch(showMessage(new Message('success', MessageEnum.S009)));
      taskRequest.projectId && dispatch(getProjectById(taskRequest.projectId.toString()));
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

  const handleUpdateTask = async (request: UpdateTaskRequest, callback): Promise<void> => {
    try {
      const response = await dispatch(updateTask(request));
      unwrapResult(response);
      callback && callback('success');
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
      callback && callback('error');
      request.taskId && dispatch(getTaskDetailById(request.taskId.toString()));
      dispatch(showMessage(message));
    } finally {
      request.projectId && dispatch(getProjectById(request.projectId.toString()));
    }
  };

  return (
    <>
      <div className="project-detail">
        <Header
          arrUserFilter={arrUserFilter}
          setArrUserFilter={setArrUserFilter}
          arrUserFilterCheckbox={arrUserFilterCheckbox}
          setArrUserFilterCheckbox={setArrUserFilterCheckbox}
          arrUserFilterFirst={arrUserFilterFirst}
          setArrUserFilterFirst={setArrUserFilterFirst}
          valueSearch={valueSearch}
          setValueSearch={setValueSearch}
          handleAssignUserToProject={handleAssignUserToProject}
          setOpenCreateTask={setOpenCreateTask}
        />
        <Content
          arrUserFilter={arrUserFilter}
          valueSearch={valueSearch}
          setOpenUpdateTask={setOpenUpdateTask}
          setListTask={setListTask}
          listTask={listTask}
        />
      </div>
      {openUpdateTask &&
        !isLoading &&
        createPortal(
          <ModalUpdateTask
            handleUpdateTask={handleUpdateTask}
            isOpen={openUpdateTask}
            setIsOpen={setOpenUpdateTask}
          />,
          document.body,
        )}
      {openCreateTask &&
        createPortal(
          <ModalCreateTask handleSubmit={handleSubmit} onClose={handleCloseModal} type="detail" />,
          document.body,
        )}
    </>
  );
};

export default ProjectDetail;
