import { BaseApiResponse } from '../../common/model/BaseApiResponse';
import {
  AssignUserToProjectRequest,
  CreateTaskRequest,
  CreateTaskResponse,
  GetUserByProjectIdResponse,
  ProjectCrateRequest,
  ProjectCreateResponse,
  ProjectDetail,
  ProjectResponse,
  RemoveUserFromProjectRequest,
  TaskDetailResponse,
  UpdateProjectRequest,
  UpdateProjectResponse,
  UpdateStatusTaskRequest,
  UpdateTaskRequest,
  UpdateTaskResponse,
} from '../../redux/project/project.model';
import api from '../../utils/interceptors';

export class ProjectService {
  static async getAll(): Promise<BaseApiResponse<ProjectResponse[]>> {
    return (await api.get('Project/getAllProject'))?.data;
  }

  static async createProject(
    project: ProjectCrateRequest,
  ): Promise<BaseApiResponse<ProjectCreateResponse>> {
    return (await api.post('Project/createProjectAuthorize', project))?.data;
  }

  static async deleteProject(projectId: string): Promise<BaseApiResponse<string>> {
    return (
      await api.delete('Project/deleteProject', {
        params: {
          projectId,
        },
      })
    )?.data;
  }

  static async assignUserToProject(
    request: AssignUserToProjectRequest,
  ): Promise<BaseApiResponse<string>> {
    return (await api.post('Project/assignUserProject', request))?.data;
  }

  static async deleteUserFromProject(
    request: RemoveUserFromProjectRequest,
  ): Promise<BaseApiResponse<string>> {
    return (await api.post('Project/removeUserFromProject', request))?.data;
  }

  static async updateProject(
    request: UpdateProjectRequest,
  ): Promise<BaseApiResponse<UpdateProjectResponse>> {
    return (await api.put(`Project/updateProject?projectId=${request.id}`, request))?.data;
  }

  static async getUserByProjectId(
    id: string,
  ): Promise<BaseApiResponse<GetUserByProjectIdResponse[]>> {
    return (await api.get(`Users/getUserByProjectId?idProject=${id}`))?.data;
  }

  static async createTask(
    request: CreateTaskRequest,
  ): Promise<BaseApiResponse<CreateTaskResponse>> {
    return (await api.post(`Project/createTask`, request))?.data;
  }

  static async getProjectById(id: string): Promise<BaseApiResponse<ProjectDetail>> {
    return (await api.get(`Project/getProjectDetail?id=${id}`))?.data;
  }

  static async updateStatusTask(
    request: UpdateStatusTaskRequest,
  ): Promise<BaseApiResponse<string>> {
    return (await api.put(`Project/updateStatus`, request))?.data;
  }

  static async deleteTask(id: string): Promise<BaseApiResponse<string>> {
    return (await api.delete(`Project/removeTask?taskId=${id}`))?.data;
  }

  static async getTaskDetail(id: string): Promise<BaseApiResponse<TaskDetailResponse>> {
    return (await api.get(`Project/getTaskDetail?taskId=${id}`))?.data;
  }

  static async updateTask(
    request: UpdateTaskRequest,
  ): Promise<BaseApiResponse<UpdateTaskResponse>> {
    return (await api.post(`Project/updateTask`, request))?.data;
  }
}
