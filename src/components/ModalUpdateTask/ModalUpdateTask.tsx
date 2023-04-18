import { Dispatch, FC, SetStateAction, useState } from 'react';
import { useEffect } from 'react';
import './style.scss';

import bug from '../../assets/images/bug.svg';
import taskImg from '../../assets/images/task.svg';
import { Popover } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import loadingTaskDetail from '../../assets/images/loading-task-detail.svg';
import ModalBodyLeft from './ModalBodyLeft/ModalBodyLeft';
import ModalBodyRight from './ModalBodyRight/ModalBodyRight';
import { useAppSelector } from '../../redux/configureStore';
import { TaskDetailResponse, UpdateTaskRequest } from '../../redux/project/project.model';
import { taskDetailDefault } from '../../redux/project/slice';

const capitalizeFirstLetter = (string): string => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
};
interface ModalUpdateTask {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  handleUpdateTask: (
    request: UpdateTaskRequest,
    fn?: (a: 'success' | 'error') => void,
  ) => Promise<void>;
}
export interface Status {
  visible: boolean;
  statusCurrent: string;
}
const ModalUpdateTask: FC<ModalUpdateTask> = (props) => {
  const { isOpen, setIsOpen, handleUpdateTask } = props;

  const { taskDetail } = useAppSelector((state) => state.project);

  // status
  const [status, setStatus] = useState<Status>({
    visible: false,
    statusCurrent: '1',
  });
  const [taskType, setTaskType] = useState<boolean>(false);

  const [taskDetailReal, setTaskDetailReal] = useState<TaskDetailResponse>(taskDetailDefault);

  const { taskType: dataTaskType, status: dataStatus } = useAppSelector((state) => state.master);

  useEffect(() => {
    if (dataStatus && taskDetailReal) {
      setStatus({ ...status, statusCurrent: taskDetailReal?.statusId });
    }
  }, [taskDetailReal]);

  useEffect(() => {
    setTaskDetailReal(taskDetail);
  }, [taskDetail]);

  const handleChangeTaskType = (item): void => {
    const info: UpdateTaskRequest = {
      description: taskDetail.description,
      listUserAsign: taskDetail?.assigness?.map((item) => item.id),
      originalEstimate: taskDetail.originalEstimate,
      priorityId: taskDetail.priorityId,
      projectId: taskDetail.projectId,
      statusId: taskDetail.statusId,
      taskId: taskDetail.taskId,
      taskName: taskDetail.taskName,
      timeTrackingRemaining: taskDetail.timeTrackingRemaining,
      timeTrackingSpent: taskDetail.timeTrackingSpent,
      typeId: item.id,
    };
    setTaskType(false);
    setTaskDetailReal({
      ...taskDetailReal,
      taskTypeDetail: {
        id: item.id,
        taskType: item.taskType,
      },
      typeId: item.id,
    });
    handleUpdateTask(info);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  return (
    <div
      className="modal-update-task"
      style={{
        visibility: isOpen ? 'visible' : 'hidden',
        opacity: isOpen ? 1 : 0,
      }}
    >
      <div className="modal-wrapper">
        <div className="modal-container">
          <div className="modal-container-content">
            <div className="modal-header-update">
              <div className="tooltip-update">
                <Popover
                  placement="bottomLeft"
                  content={
                    <div className="task-type-list">
                      <p className="task-type-title">Change task type</p>
                      <div>
                        {dataTaskType?.map((item, index) => {
                          return (
                            <div
                              onClick={(): void => {
                                handleChangeTaskType(item);
                              }}
                              key={index}
                              className="type-task-item"
                            >
                              <img src={item.id === 1 ? bug : taskImg} alt={item.taskType} />{' '}
                              <span className="desc">{capitalizeFirstLetter(item.taskType)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  }
                  trigger="click"
                  open={taskType}
                  onOpenChange={(value): void => {
                    setTaskType(value);
                  }}
                >
                  <img src={taskDetailReal?.taskTypeDetail?.id === 1 ? bug : taskImg} alt="bug" />
                  <span className="desc">
                    {capitalizeFirstLetter(taskDetailReal?.taskTypeDetail?.taskType)}
                  </span>
                </Popover>
                <span className="tooltip-text">Bug - Change task type</span>
              </div>
              <div className="header-right">
                <CloseOutlined
                  className="btn-close"
                  onClick={(): void => {
                    setIsOpen(false);
                  }}
                />
              </div>
            </div>
            <div className="modal-body-update">
              <ModalBodyLeft
                taskDetailReal={taskDetailReal}
                setTaskDetailReal={setTaskDetailReal}
                handleUpdateTask={handleUpdateTask}
              />
              <ModalBodyRight
                status={status}
                handleUpdateTask={handleUpdateTask}
                setStatus={setStatus}
                taskDetailReal={taskDetailReal}
                setTaskDetailReal={setTaskDetailReal}
                setTaskType={setTaskType}
              />
            </div>
          </div>
        </div>
      </div>
      <img src={loadingTaskDetail} style={{ display: 'none', visibility: 'hidden' }} alt="" />
    </div>
  );
};

export default ModalUpdateTask;
