import { DownOutlined } from '@ant-design/icons';
import { Popover, Select, Slider, Tag } from 'antd';

import highest from '../../../assets/images/highest.svg';
import low from '../../../assets/images/low.svg';
import lowest from '../../../assets/images/lowest.svg';
import medium from '../../../assets/images/medium.svg';
import { Dispatch, FC, SetStateAction } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/configureStore';
import { getProjectById, updateStatusTask } from '../../../redux/project/actions';
import {
  MemberAssign,
  TaskDetailResponse,
  UpdateTaskRequest,
} from '../../../redux/project/project.model';
import { Status } from '../ModalUpdateTask';
import { toSlug } from '../../../utils/slug/slug';
import { unwrapResult } from '@reduxjs/toolkit';

const { Option } = Select;

function tagRender(props): JSX.Element {
  const { label, closable, onClose } = props;

  const onPreventMouseDown = (event): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  const options = [
    { value: 'gold' },
    { value: 'lime' },
    { value: 'green' },
    { value: 'cyan' },
    { value: 'red' },
    { value: 'blue' },
    { value: 'pink' },
  ];

  return (
    <Tag
      color={options[Math.floor(Math.random() * options.length)].value}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
}

const renderImgPriority = (id): JSX.Element => {
  if (id === 1) {
    return <img src={highest} alt="highest" />;
  } else if (id === 2) {
    return <img src={medium} alt="medium" />;
  } else if (id === 3) {
    return <img src={low} alt="low" />;
  } else if (id === 4) {
    return <img src={lowest} alt="lowest" />;
  }
  return <></>;
};

interface ModalBodyRightProps {
  status: Status;
  setStatus: Dispatch<SetStateAction<Status>>;
  taskDetailReal: TaskDetailResponse;
  setTaskDetailReal: Dispatch<SetStateAction<TaskDetailResponse>>;
  setTaskType: Dispatch<SetStateAction<boolean>>;
  handleUpdateTask: (
    request: UpdateTaskRequest,
    fn?: (a: 'success' | 'error') => void,
  ) => Promise<void>;
}
const ModalBodyRight: FC<ModalBodyRightProps> = (props): JSX.Element => {
  const { status, setStatus, taskDetailReal, setTaskDetailReal, handleUpdateTask } = props;
  const dispatch = useAppDispatch();
  const { status: dataStatus, priority: dataPriority } = useAppSelector((state) => state.master);
  const { projectDetail } = useAppSelector((state) => state.project);

  const renderStatus = (): string => {
    const item = dataStatus?.find((item) => {
      return item.statusId === status?.statusCurrent;
    });
    return item?.statusName || '';
  };

  const handleChangeStatus = async (item): Promise<void> => {
    const prevStatusId = status.statusCurrent;
    const id = projectDetail.id;
    setTaskDetailReal({
      ...taskDetailReal,
      statusId: item.statusId,
    });
    setStatus({
      visible: false,
      statusCurrent: item.statusId,
    });
    const info = {
      taskId: taskDetailReal?.taskId,
      statusId: item.statusId,
    };
    try {
      const response = await dispatch(updateStatusTask(info));
      unwrapResult(response);
      id && dispatch(getProjectById(id.toString()));
    } catch (err) {
      setTaskDetailReal({
        ...taskDetailReal,
        statusId: prevStatusId,
      });
      setStatus({
        visible: false,
        statusCurrent: prevStatusId,
      });
      id && dispatch(getProjectById(id.toString()));
    }
  };

  const handleChangeAssign = (value): void => {
    const info = {
      ...taskDetailReal,
      listUserAsign: value,
    };
    const userCurrent: MemberAssign[] = [];
    for (let i = 0; i < projectDetail?.members?.length; i++) {
      if (value.includes(projectDetail?.members[i].userId)) {
        userCurrent.push({
          id: projectDetail?.members[i].userId,
          avatar: projectDetail?.members[i].avatar,
          name: projectDetail?.members[i].name,
          alias: toSlug(projectDetail?.members[i].name),
        });
      }
    }
    setTaskDetailReal({
      ...taskDetailReal,
      assigness: userCurrent,
    });
    handleUpdateTask(info);
  };

  const handleChangePriority = (value): void => {
    const info = {
      ...taskDetailReal,
      listUserAsign: taskDetailReal?.assigness?.map((item) => item.id),
      priorityId: value,
    };
    const index = dataPriority.findIndex((item) => {
      return item.priorityId === value;
    });
    setTaskDetailReal({
      ...taskDetailReal,
      priorityId: value,
      priorityTask: {
        priority: dataPriority[index].alias,
        priorityId: value,
      },
    });
    handleUpdateTask(info);
  };

  const handleUpdateTimeByName = (name) => (e) => {
    setTaskDetailReal({
      ...taskDetailReal,
      [name]: +e.target.value,
    });
    const info = {
      ...taskDetailReal,
      listUserAsign: taskDetailReal?.assigness?.map((item) => item.id),
      [name]: +e.target.value,
    };
    handleUpdateTask(info);
  };

  return (
    <div className="modal-body-update-right">
      <div className="modal-body-update-right-container">
        <Popover
          content={
            <div className="popover-select">
              {dataStatus?.map((item, index) => {
                const classNotDone =
                  index !== 0 && index !== dataStatus.length - 1 ? 'not-done' : '';
                const classDone = index === dataStatus.length - 1 ? 'done' : '';
                return (
                  <div
                    onClick={(): void => {
                      handleChangeStatus(item);
                    }}
                    className="select-item"
                    key={index}
                  >
                    <span className={`content todo ${classNotDone} ${classDone}`}>
                      {item.statusName}
                    </span>
                  </div>
                );
              })}
            </div>
          }
          trigger="click"
          placement="bottomLeft"
          open={status.visible}
          onOpenChange={(value): void => {
            setStatus({ ...status, visible: value });
          }}
        >
          <div className={`btn-select blue ${status.statusCurrent === '4' ? 'done' : ''}`}>
            {renderStatus()}
            <DownOutlined className="icon-down" />
          </div>
        </Popover>
        <div className="assign">
          <span className="label">Assignee</span>
          <Select
            mode="multiple"
            showArrow
            tagRender={tagRender}
            onChange={(value): void => {
              handleChangeAssign(value);
            }}
            value={taskDetailReal?.assigness?.map((item) => {
              return item.id;
            })}
            placeholder="Unassigned"
            optionFilterProp="label"
            style={{ width: '100%' }}
            options={projectDetail?.members?.map((item) => ({
              value: item.userId,
              label: item.name,
            }))}
          />
        </div>
        <div className="priority">
          <span className="label">Priority</span>
          <Select
            value={taskDetailReal?.priorityId}
            style={{ width: '100%' }}
            onChange={handleChangePriority}
          >
            {dataPriority?.map((item, index) => {
              return (
                <Option key={index} className="priority-option" value={item.priorityId}>
                  {renderImgPriority(item.priorityId)}
                  <span>{item.priority}</span>
                </Option>
              );
            })}
          </Select>
        </div>
        <div className="time">
          <span className="label">Time Tracking</span>
          <Slider
            min={0}
            max={taskDetailReal?.timeTrackingSpent + taskDetailReal?.timeTrackingRemaining}
            value={taskDetailReal?.timeTrackingSpent}
          />
          <div className="desc">
            <span>{taskDetailReal?.timeTrackingSpent}h logged</span>
            <span>{taskDetailReal?.timeTrackingRemaining}h remaining</span>
          </div>
          <div className="time-two">
            <div className="spent">
              <span className="label">Time spent</span>
              <input
                min={0}
                onChange={handleUpdateTimeByName('timeTrackingSpent')}
                className="input-time"
                value={taskDetailReal?.timeTrackingSpent}
                type="number"
              />
            </div>
            <div className="remaining">
              <span className="label">Time remaining</span>
              <input
                min={0}
                onChange={handleUpdateTimeByName('timeTrackingRemaining')}
                className="input-time"
                value={taskDetailReal?.timeTrackingRemaining}
                type="number"
              />
            </div>
          </div>
        </div>
        <div
          className="original-estimate
"
        >
          <span className="label">Original Estimate</span>
          <input
            className="input-time"
            type="number"
            min={0}
            onChange={handleUpdateTimeByName('originalEstimate')}
            value={taskDetailReal?.originalEstimate}
          />
        </div>
      </div>
    </div>
  );
};
export default ModalBodyRight;
