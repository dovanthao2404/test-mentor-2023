import { createSlice } from '@reduxjs/toolkit';
import {
  GetUserByProjectIdResponse,
  PriorityTask,
  ProjectCreateResponse,
  ProjectDetail,
  ProjectResponse,
  TaskDetailResponse,
  TaskTypeDetail,
  UpdateProjectResponse,
} from './project.model';
import {
  assignUserToProject,
  createProject,
  deleteProject,
  deleteUserFromProject,
  getProjectById,
  getProjects,
  getTaskDetailById,
  getUserByProjectId,
  updateProject,
} from './actions';
type StatusDeleteProject = 'start' | 'success' | 'error' | '';
type StatusAssignProject = StatusDeleteProject;
type DeleteUserProject = StatusDeleteProject;

interface ProjectState {
  projects: ProjectResponse[];
  newProject: ProjectCreateResponse;
  statusDeleteProject: StatusDeleteProject;
  statusAssignUserToProject: StatusAssignProject;
  deleteUserFromProject: DeleteUserProject;
  projectUpdated: UpdateProjectResponse;
  userByProjectId: GetUserByProjectIdResponse[];
  projectDetail: ProjectDetail;
  taskDetail: TaskDetailResponse;
}
export const taskDetailDefault = {
  priorityTask: {} as PriorityTask,
  taskTypeDetail: {} as TaskTypeDetail,
  assigness: [],
  lstComment: [],
  taskId: 0,
  taskName: '',
  alias: '',
  description: '',
  statusId: '2',
  originalEstimate: 0,
  timeTrackingSpent: 0,
  timeTrackingRemaining: 0,
  typeId: 2,
  priorityId: 4,
  projectId: 0,
};
const initialState = {
  projects: [],
  newProject: {} as ProjectCreateResponse,
  statusDeleteProject: '',
  statusAssignUserToProject: '',
  deleteUserFromProject: '',
  projectUpdated: {} as UpdateProjectResponse,
  userByProjectId: [],
  projectDetail: {} as ProjectDetail,
  taskDetail: taskDetailDefault,
} as ProjectState;

const projectsState = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjects.fulfilled, (state, { payload }) => {
      state.projects = payload;
    });
    builder.addCase(getProjects.rejected, (state) => {
      state.projects = [];
    });
    builder.addCase(createProject.fulfilled, (state, { payload }) => {
      state.newProject = payload;
    });
    builder.addCase(createProject.rejected, (state) => {
      state.newProject = {} as ProjectCreateResponse;
    });

    builder.addCase(deleteProject.pending, (state) => {
      state.statusDeleteProject = 'start';
    });
    builder.addCase(deleteProject.fulfilled, (state) => {
      state.statusDeleteProject = 'success';
    });
    builder.addCase(deleteProject.rejected, (state) => {
      state.statusDeleteProject = 'error';
    });
    builder.addCase(assignUserToProject.pending, (state) => {
      state.statusAssignUserToProject = 'start';
    });
    builder.addCase(assignUserToProject.fulfilled, (state) => {
      state.statusAssignUserToProject = 'success';
    });
    builder.addCase(assignUserToProject.rejected, (state) => {
      state.statusAssignUserToProject = 'error';
    });
    builder.addCase(deleteUserFromProject.pending, (state) => {
      state.deleteUserFromProject = 'start';
    });
    builder.addCase(deleteUserFromProject.fulfilled, (state) => {
      state.deleteUserFromProject = 'success';
    });
    builder.addCase(deleteUserFromProject.rejected, (state) => {
      state.deleteUserFromProject = 'error';
    });
    builder.addCase(updateProject.pending, (state) => {
      state.projectUpdated = {} as UpdateProjectResponse;
    });
    builder.addCase(updateProject.fulfilled, (state, { payload }) => {
      state.projectUpdated = payload;
    });
    builder.addCase(updateProject.rejected, (state) => {
      state.projectUpdated = {} as UpdateProjectResponse;
    });

    builder.addCase(getUserByProjectId.pending, (state) => {
      state.userByProjectId = [];
    });
    builder.addCase(getUserByProjectId.fulfilled, (state, { payload }) => {
      state.userByProjectId = payload;
    });
    builder.addCase(getUserByProjectId.rejected, (state) => {
      state.userByProjectId = [];
    });

    builder.addCase(getProjectById.fulfilled, (state, { payload }) => {
      state.projectDetail = payload;
    });
    builder.addCase(getProjectById.rejected, (state) => {
      state.projectDetail = {} as ProjectDetail;
    });

    builder.addCase(getTaskDetailById.fulfilled, (state, { payload }) => {
      state.taskDetail = payload;
    });
    builder.addCase(getTaskDetailById.rejected, (state) => {
      state.taskDetail = taskDetailDefault as TaskDetailResponse;
    });
  },
});

export default projectsState.reducer;
