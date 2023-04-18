import { BaseApiResponse } from '../../common/model/BaseApiResponse';
import {
  PriorityResponse,
  ProjectCategoryResponse,
  StatusResponse,
  TaskTypeResponse,
} from '../../redux/master/master.model';
import api from '../../utils/interceptors';

export class MasterService {
  static async getAllTaskType(): Promise<BaseApiResponse<TaskTypeResponse[]>> {
    return (await api.get('TaskType/getAll'))?.data;
  }

  static async getAllStatus(): Promise<BaseApiResponse<StatusResponse[]>> {
    return (await api.get('Status/getAll'))?.data;
  }

  static async getAllProjectCategory(): Promise<BaseApiResponse<ProjectCategoryResponse[]>> {
    return (await api.get('ProjectCategory'))?.data;
  }

  static async getAllPriority(): Promise<BaseApiResponse<PriorityResponse[]>> {
    return (await api.get('Priority/getAll?id=0'))?.data;
  }
}
