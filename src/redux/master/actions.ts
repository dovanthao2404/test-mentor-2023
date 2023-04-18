import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { MasterService } from '../../services/MasterService/MasterService';

export const getAllPriority = createAsyncThunk('master/getAllPriority', async (_, { rejectWithValue }) => {
  try {
    const response = await MasterService.getAllPriority();
    return response.content;
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err);
  }
});

export const getProjectCategory = createAsyncThunk(
  'master/getAllProjectCategory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await MasterService.getAllProjectCategory();
      return response.content;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err);
    }
  },
);

export const getAllStatus = createAsyncThunk('master/getAllStatus', async (_, { rejectWithValue }) => {
  try {
    const response = await MasterService.getAllStatus();
    return response.content;
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err);
  }
});

export const getAllTaskType = createAsyncThunk('master/getAllTaskType', async (_, { rejectWithValue }) => {
  try {
    const response = await MasterService.getAllTaskType();
    return response.content;
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err);
  }
});
