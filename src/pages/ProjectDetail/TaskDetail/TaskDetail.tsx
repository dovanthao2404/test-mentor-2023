import { Dispatch, FC, SetStateAction, SyntheticEvent, useState } from 'react';
import { Popover, Tooltip } from 'antd';

import bug from '../../../assets/images/bug.svg';
import highest from '../../../assets/images/highest.svg';
import low from '../../../assets/images/low.svg';
import lowest from '../../../assets/images/lowest.svg';
import medium from '../../../assets/images/medium.svg';
import taskImg from '../../../assets/images/task.svg';

import { CheckOutlined, EllipsisOutlined } from '@ant-design/icons';
import { ProjectService } from '../../../services/ProjectService/ProjectService';
import { AxiosError } from 'axios';
import { BaseApiResponse } from '../../../common/model/BaseApiResponse';
import { Message } from '../../../utils/message/Message';
import { MessageEnum } from '../../../common/enum/message';
import { showMessage } from '../../../redux/message/slice';
import { useAppDispatch } from '../../../redux/configureStore';
import { getTaskDetailById } from '../../../redux/project/actions';
import { showLoading } from '../../../redux/loading/slice';
import { Task, TaskDetail as TaskDetailType } from '../../../redux/project/project.model';
interface TaskDetailProps {
  task: TaskDetailType;
  taskListDetail: Task;
  setListTask: Dispatch<SetStateAction<Task[]>>;
  listTask: Task[];
  setOpenUpdateTask: Dispatch<SetStateAction<boolean>>;
}
const TaskDetail: FC<TaskDetailProps> = (props) => {
  const dispatch = useAppDispatch();
  const { task, taskListDetail, setListTask, listTask, setOpenUpdateTask } = props;
  const [visible, setVisible] = useState(false);

  const renderPriority = (priorityTask): JSX.Element => {
    if (priorityTask?.priorityId === 1) {
      return <img className="priority" src={highest} alt="highest" />;
    } else if (priorityTask?.priorityId === 2) {
      return <img className="priority" src={medium} alt="medium" />;
    } else if (priorityTask?.priorityId === 3) {
      return <img className="priority" src={low} alt="low" />;
    } else if (priorityTask?.priorityId === 4) {
      return <img className="priority" src={lowest} alt="lowest" />;
    }
    return <></>;
  };

  const renderTaskType = (): JSX.Element => {
    if (task?.taskTypeDetail.id === 1) {
      return <img className="task-type" src={bug} alt="bug" />;
    } else if (task?.taskTypeDetail.id === 2) {
      return <img className="task-type" src={taskImg} alt="task" />;
    }
    return <></>;
  };

  const renderStatus = (): JSX.Element => {
    if (+task?.statusId === 4) {
      return <CheckOutlined className="icon-done" />;
    }
    return <></>;
  };

  const renderAvatar = (): JSX.Element[] => {
    return task?.assigness?.slice(0, 1).map((item, index) => {
      return (
        <Tooltip key={index} placement="top" title={item.name}>
          <img
            className="avatar"
            src={item.avatar}
            alt=""
            onError={(e: SyntheticEvent<HTMLImageElement, Event>): void => {
              e.currentTarget.src = `https://i.pravatar.cc/150?u=https://ui-avatars.com/api/?name=${item.name}`;
            }}
          />
        </Tooltip>
      );
    });
  };

  const renderAvatarResidual = (): JSX.Element => {
    if (task?.assigness.length - 1 > 0) {
      return (
        <div className="img-residual">
          <span>+{task?.assigness.length - 1}</span>
        </div>
      );
    }
    return <></>;
  };

  const handleDeleteTask = async (e): Promise<void> => {
    e.stopPropagation();

    const prevProject = [...listTask];
    const listItemByStatusCurrent = [...taskListDetail?.lstTaskDeTail];

    const indexItemRemove = listItemByStatusCurrent?.findIndex(
      (item) => item.taskId === task.taskId,
    );

    listItemByStatusCurrent.splice(indexItemRemove, 1);

    const listTaskTemp = [...listTask];
    listTaskTemp.splice(+taskListDetail.statusId - 1, 1, {
      ...taskListDetail,
      lstTaskDeTail: listItemByStatusCurrent,
    });
    setListTask(listTaskTemp);
    try {
      await ProjectService.deleteTask(task.taskId.toString());
    } catch (err) {
      const error = err as AxiosError<BaseApiResponse<string>>;
      const message = new Message('warning', '');
      if (error.response?.data?.statusCode === 403) {
        message.content = MessageEnum.E002;
      } else {
        if (error.response?.data?.message) {
          message.content = error.response?.data?.message;
        } else {
          message.content = MessageEnum.E003;
          message.type = 'error';
        }
      }
      dispatch(showMessage(message));
      setListTask(prevProject);
    }
  };

  return (
    <div
      className="project-content-item"
      onClick={(): void => {
        setOpenUpdateTask(true);
        dispatch(showLoading());
        dispatch(getTaskDetailById(task.taskId.toString()));
      }}
    >
      <div className="task-header">
        <p className="task-name">{task.taskName}</p>
        <div>
          <Popover
            placement="bottomRight"
            content={<a onClick={handleDeleteTask}>Delete task</a>}
            trigger="click"
            open={visible}
            onOpenChange={setVisible}
          >
            <EllipsisOutlined
              className={`icon-dot ${visible ? 'active' : ''}`}
              onClick={(e): void => {
                e.stopPropagation();
              }}
            />
          </Popover>
        </div>
      </div>
      <div className="task-detail-footer">
        {renderTaskType()}
        <div className="right">
          {renderStatus()}
          {renderPriority(task.priorityTask)}
          <div className="avatar-group">
            {renderAvatar()}
            {renderAvatarResidual()}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TaskDetail;
