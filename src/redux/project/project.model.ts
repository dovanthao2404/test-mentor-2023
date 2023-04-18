import { PriorityResponse, TaskTypeResponse } from '../master/master.model';
import { UserByKeywordResponse } from '../user/user.model';

export interface ProjectMember {
  userId: number;
  name: string;
  avatar: string;
}
interface ProjectCreator {
  id: number;
  name: string;
}

export interface ProjectResponse {
  members: ProjectMember[];
  creator: ProjectCreator;
  id: number;
  projectName: string;
  description: string;
  categoryId: number;
  categoryName: string;
  alias: string;
  deleted: boolean;
}

export interface ProjectCrateRequest {
  projectName: string;
  description: string;
  categoryId: number;
  alias: string;
}

export interface ProjectCreateResponse {
  id: number;
  projectName: string;
  description: string;
  categoryId: number;
  alias: string;
  deleted: boolean;
  creator: number;
}

export interface AssignUserToProjectRequest {
  projectId: number;
  userId: number;
}

export interface UpdateProjectRequest {
  categoryId: string;
  description: string;
  id: number;
  projectName: string;
}

export interface UpdateProjectResponse {
  alias: string;
  categoryId: number;
  creator: number;
  deleted: boolean;
  description: string;
  id: number;
  projectName: string;
}

export interface CreateTaskRequest {
  description: string;
  listUserAsign: number[];
  originalEstimate: number;
  priorityId: number;
  projectId: number | undefined;
  statusId: string;
  taskName: string;
  timeTrackingRemaining: number;
  timeTrackingSpent: number;
  typeId: number;
}

export interface CreateTaskResponse {
  alias: string;
  deleted: boolean;
  description: string;
  originalEstimate: number;
  priorityId: number;
  projectId: number;
  reporterId: number;
  statusId: string;
  taskId: number;
  taskName: string;
  timeTrackingRemaining: number;
  timeTrackingSpent: number;
  typeId: number;
}

export type GetUserByProjectIdResponse = UserByKeywordResponse;
type ProjectMemberDetail = GetUserByProjectIdResponse;
type ProjectCategory = {
  id: number;
  name: string;
};
type Comment = {
  avatar: string;
  commentContent: string;
  id: number;
  idUser: number;
  name: string;
};

export type MemberAssign = {
  alias: string;
  avatar: string;
  id: number;
  name: string;
};

export type TaskDetail = {
  alias: string;
  description: string;
  assigness: MemberAssign[];
  lstComment: Comment[];
  originalEstimate: number;
  priorityId: number;
  priorityTask: PriorityResponse;
  projectId: number;
  statusId: string;
  taskId: number;
  taskName: string;
  taskTypeDetail: TaskTypeResponse;
  timeTrackingRemaining: number;
  timeTrackingSpent: number;
  typeId: number;
};
export type Task = {
  alias: string;
  lstTaskDeTail: TaskDetail[];
  statusId: string;
  statusName: string;
};

export interface ProjectDetail {
  alias: string;
  creator: ProjectCreator;
  description: string;
  id: number;
  lstTask: Task[];
  members: ProjectMemberDetail[];
  projectCategory: ProjectCategory;
  projectName: string;
}

export interface UpdateStatusTaskRequest {
  taskId: number;
  statusId: string;
}
export type AssignedUser = {
  alias: string;
  avatar: string;
  id: number;
  name: string;
};
export type PriorityTask = {
  priority: string;
  priorityId: number;
};
export type TaskTypeDetail = {
  id: number;
  taskType: string;
};
export interface TaskDetailResponse {
  alias: string;
  assigness: AssignedUser[];
  description: string;
  lstComment: Array<any>;
  originalEstimate: number;
  priorityId: number;
  priorityTask: PriorityTask;
  projectId: number;
  statusId: string;
  taskId: number;
  taskName: string;
  taskTypeDetail: TaskTypeDetail;
  timeTrackingRemaining: number;
  timeTrackingSpent: number;
  typeId: number;
}

export interface UpdateTaskRequest {
  description: string;
  listUserAsign: number[];
  originalEstimate: number;
  priorityId: number;
  projectId: number;
  statusId: string;
  taskId: number;
  taskName: string;
  timeTrackingRemaining: number;
  timeTrackingSpent: number;
  typeId: number;
}

export interface UpdateTaskResponse {
  alias: string;
  deleted: boolean;
  description: string;
  originalEstimate: number;
  priorityId: number;
  projectId: number;
  reporterId: number;
  statusId: string;
  taskId: number;
  taskName: string;
  timeTrackingRemaining: number;
  timeTrackingSpent: number;
  typeId: number;
}

export type RemoveUserFromProjectRequest = AssignUserToProjectRequest;
