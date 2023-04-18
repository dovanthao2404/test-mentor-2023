import { createAsyncThunk } from '@reduxjs/toolkit';
import { SignInRequest, SignUpRequest } from './user.model';
import { hideLoading, showLoading } from '../loading/slice';
import { UserService } from '../../services/UserService';
import { MessagePayload, showMessage } from '../message/slice';
import { MessageEnum } from '../../common/enum/message';
import { LocalStorage } from '../../common/enum/localstorage';
import { AxiosError } from 'axios';
import { BaseApiResponse } from '../../common/model/BaseApiResponse';

export const loginAction = createAsyncThunk(
  'users/login',
  async (signInInformation: SignInRequest, { rejectWithValue, dispatch }) => {
    try {
      dispatch(showLoading());
      const response = await UserService.signIn(signInInformation);

      localStorage.setItem(LocalStorage.UserLogin, JSON.stringify(response.content));

      return response.content;
    } catch (error) {
      const err = error as AxiosError;
      const data = err?.response?.data as BaseApiResponse<string>;
      if (data) {
        const message: MessagePayload = {
          content: data?.message,
          type: 'warning',
        };
        dispatch(showMessage(message));
      }
      return rejectWithValue(err);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const signUpAction = createAsyncThunk(
  'users/signup',
  async (signInInformation: SignUpRequest, { rejectWithValue, dispatch }) => {
    try {
      dispatch(showLoading());
      const response = await UserService.singUp(signInInformation);
      const message: MessagePayload = {
        content: MessageEnum.S002,
        type: 'success',
      };
      dispatch(showMessage(message));
      return response.content;
    } catch (error) {
      const err = error as AxiosError;
      const data = err?.response?.data as BaseApiResponse<string>;
      if (data) {
        const message: MessagePayload = {
          content: data?.message,
          type: 'warning',
        };
        dispatch(showMessage(message));
      }
      return rejectWithValue(err);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const getUserByKeyword = createAsyncThunk(
  'users/getUserByKeyword',
  async (keyword: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await UserService.getUserByKeyword(keyword);
      return response.content;
    } catch (error) {
      const err = error as AxiosError;
      const data = err?.response?.data as BaseApiResponse<string>;
      if (data) {
        const message: MessagePayload = {
          content: data?.message,
          type: 'warning',
        };
        dispatch(showMessage(message));
      }
      return rejectWithValue(err);
    }
  },
);
