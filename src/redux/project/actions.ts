import { createAsyncThunk } from '@reduxjs/toolkit';
import { hideLoading, showLoading } from '../loading/slice';
import { AxiosError } from 'axios';
import { BaseApiResponse } from '../../common/model/BaseApiResponse';
import { MessagePayload, showMessage } from '../message/slice';
import { ProjectService } from '../../services/ProjectService/ProjectService';
import { RootState } from '../configureStore';
import {
  AssignUserToProjectRequest,
  CreateTaskRequest,
  ProjectCrateRequest,
  ProjectResponse,
  RemoveUserFromProjectRequest,
  UpdateProjectRequest,
  UpdateStatusTaskRequest,
  UpdateTaskRequest,
} from './project.model';
import { Message } from '../../utils/message/Message';
import { MessageEnum } from '../../common/enum/message';
import { hideDrawer } from '../drawer/slice';

export const getProjects = createAsyncThunk(
  'project/getall',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      dispatch(showLoading());
      const response = await ProjectService.getAll();
      const state = getState() as RootState;
      const { id } = state.users.userLogin;
      let resultsTemp: ProjectResponse[] = [...response.content];

      resultsTemp = resultsTemp.filter((item) => {
        if (item.creator && item.creator.id === id) {
          return true;
        }
        const result = item.members.find((item) => item.userId === id);
        return result;
      });
      return resultsTemp;
    } catch (error) {
      const err = error as AxiosError;
      const data = err?.response?.data as BaseApiResponse<string>;
      if (data) {
        const message: MessagePayload = new Message('warning', data?.message);
        dispatch(showMessage(message));
      }
      return rejectWithValue(err);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const createProject = createAsyncThunk(
  'project/create',
  async (project: ProjectCrateRequest, { rejectWithValue, dispatch }) => {
    try {
      dispatch(showLoading());
      const response = await ProjectService.createProject(project);

      dispatch(showMessage(new Message('success', MessageEnum.S004)));
      dispatch(hideDrawer());
      dispatch(getProjects());
      return response.content;
    } catch (error) {
      const err = error as AxiosError;
      const data = err?.response?.data as BaseApiResponse<string>;
      if (data) {
        dispatch(showMessage(new Message('warning', data?.message)));
      }
      return rejectWithValue(err);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const deleteProject = createAsyncThunk(
  'project/deleteProject',
  async (projectId: string, { rejectWithValue, dispatch }) => {
    try {
      dispatch(showLoading());
      const response = await ProjectService.deleteProject(projectId);
      dispatch(showMessage(new Message('success', MessageEnum.S005)));
      dispatch(getProjects());
      return response.content;
    } catch (error) {
      const err = error as AxiosError;
      const data = err?.response?.data as BaseApiResponse<string>;
      if (data) {
        dispatch(showMessage(new Message('warning', data?.message)));
      }
      return rejectWithValue(err);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const assignUserToProject = createAsyncThunk(
  'project/assignUserToProject',
  async (request: AssignUserToProjectRequest, { rejectWithValue, dispatch }) => {
    try {
      dispatch(showLoading());
      const response = await ProjectService.assignUserToProject(request);
      return response.content;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const deleteUserFromProject = createAsyncThunk(
  'project/deleteUserFromProject',
  async (request: RemoveUserFromProjectRequest, { rejectWithValue, dispatch }) => {
    try {
      dispatch(showLoading());
      const response = await ProjectService.deleteUserFromProject(request);
      return response.content;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const updateProject = createAsyncThunk(
  'project/updateProject',
  async (request: UpdateProjectRequest, { rejectWithValue, dispatch }) => {
    try {
      dispatch(showLoading());
      const response = await ProjectService.updateProject(request);
      return response.content;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const getUserByProjectId = createAsyncThunk(
  'project/getUserByProjectId',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await ProjectService.getUserByProjectId(id);
      return response.content;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err);
    }
  },
);

export const createTask = createAsyncThunk(
  'project/createTask',
  async (request: CreateTaskRequest, { rejectWithValue, dispatch }) => {
    try {
      dispatch(showLoading());
      const response = await ProjectService.createTask(request);
      return response.content;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const getProjectById = createAsyncThunk(
  'project/getProjectById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await ProjectService.getProjectById(id);
      return response.content;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err);
    }
  },
);

export const updateStatusTask = createAsyncThunk(
  'project/updateStatusTask',
  async (request: UpdateStatusTaskRequest, { rejectWithValue }) => {
    try {
      const response = await ProjectService.updateStatusTask(request);
      return response.content;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err);
    }
  },
);

export const getTaskDetailById = createAsyncThunk(
  'project/getTaskDetailById',
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await ProjectService.getTaskDetail(id);
      return response.content;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const updateTask = createAsyncThunk(
  'project/updateTask',
  async (request: UpdateTaskRequest, { rejectWithValue }) => {
    try {
      const response = await ProjectService.updateTask(request);
      return response.content;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err);
    }
  },
);
