export interface PriorityResponse {
  priorityId: number;
  priority: string;
  description: string;
  deleted: boolean;
  alias: string;
}

export interface ProjectCategoryResponse {
  id: number;
  projectCategoryName: string;
}

export interface StatusResponse {
  statusId: string;
  statusName: string;
  alias: string;
  deleted: string;
}

export interface TaskTypeResponse {
  id: number;
  taskType: string;
}
