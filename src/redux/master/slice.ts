import { createSlice } from '@reduxjs/toolkit';
import {
  PriorityResponse,
  ProjectCategoryResponse,
  StatusResponse,
  TaskTypeResponse,
} from './master.model';
import { getAllPriority, getAllStatus, getAllTaskType, getProjectCategory } from './actions';

interface ProjectState {
  priority: PriorityResponse[];
  projectCategory: ProjectCategoryResponse[];
  status: StatusResponse[];
  taskType: TaskTypeResponse[];
}

const initialState: ProjectState = {
  priority: [],
  projectCategory: [],
  status: [],
  taskType: [],
};

const masterState = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllPriority.fulfilled, (state, { payload }) => {
      state.priority = payload;
    });
    builder.addCase(getAllPriority.rejected, (state) => {
      state.priority = [];
    });
    builder.addCase(getProjectCategory.fulfilled, (state, { payload }) => {
      state.projectCategory = payload;
    });
    builder.addCase(getProjectCategory.rejected, (state) => {
      state.projectCategory = [];
    });

    builder.addCase(getAllStatus.fulfilled, (state, { payload }) => {
      state.status = payload;
    });
    builder.addCase(getAllStatus.rejected, (state) => {
      state.status = [];
    });
    builder.addCase(getAllTaskType.fulfilled, (state, { payload }) => {
      state.taskType = payload;
    });
    builder.addCase(getAllTaskType.rejected, (state) => {
      state.taskType = [];
    });
  },
});

export default masterState.reducer;
