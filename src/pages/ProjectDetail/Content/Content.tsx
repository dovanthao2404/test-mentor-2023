import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from 'react-beautiful-dnd';
import { useAppDispatch, useAppSelector } from '../../../redux/configureStore';
import { getProjectById, updateStatusTask } from '../../../redux/project/actions';
import { useParams } from 'react-router-dom';
import type {
  MemberAssign,
  Task,
  TaskDetail as TaskDetailType,
} from '../../../redux/project/project.model';
import TaskDetail from '../TaskDetail';
import { DropResult } from 'react-beautiful-dnd';

interface ContentProps {
  arrUserFilter: number[];
  valueSearch: string;
  setListTask: Dispatch<SetStateAction<Task[]>>;
  listTask: Task[];
  setOpenUpdateTask: Dispatch<SetStateAction<boolean>>;
}

const Content: FC<ContentProps> = (props) => {
  const { listTask, setListTask, setOpenUpdateTask } = props;
  const dispatch = useAppDispatch();
  const { arrUserFilter, valueSearch } = props;
  const { id } = useParams();

  const { projectDetail: data } = useAppSelector((state) => state.project);

  useEffect(() => {
    if (data) {
      setListTask(data?.lstTask);
    }
  }, [data]);

  const handleDragEnd = async (result: DropResult): Promise<void> => {
    const listTaskPrev = listTask;
    const { destination, source } = result;
    if (destination) {
      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
      }
      if (destination.droppableId === source.droppableId && destination.index !== source.index) {
        return;
      }

      const listTaskTemp = [...listTask];
      const indexDropSource = +source.droppableId - 1;
      const indexDropDestination = +destination.droppableId - 1;
      const arrTempSource = [...listTask[indexDropSource].lstTaskDeTail];
      const arrTempDestination = [...listTask[indexDropDestination].lstTaskDeTail];
      const tempSource = { ...arrTempSource[source.index] };

      arrTempSource.splice(source.index, 1);
      listTaskTemp.splice(indexDropSource, 1, {
        ...listTaskTemp[indexDropSource],
        lstTaskDeTail: arrTempSource,
      });
      arrTempDestination.push(tempSource);

      listTaskTemp.splice(indexDropDestination, 1, {
        ...listTaskTemp[indexDropDestination],
        lstTaskDeTail: [...arrTempDestination],
      });
      setListTask(listTaskTemp);

      try {
        await dispatch(
          updateStatusTask({
            taskId: tempSource.taskId,
            statusId: destination.droppableId,
          }),
        );
        id && dispatch(getProjectById(id));
      } catch (err) {
        setListTask(listTaskPrev);
      }
    }
  };

  const handleRenderCol = (
    lstTaskDeTail: TaskDetailType[],
    provided: DroppableProvided,
    taskListDetail: Task,
  ): JSX.Element[] => {
    let lstTaskDeTailTemp = [...lstTaskDeTail];

    if (arrUserFilter.length) {
      lstTaskDeTailTemp = lstTaskDeTailTemp.filter((item: TaskDetailType) => {
        const assigness = item.assigness.filter((item: MemberAssign) => {
          return arrUserFilter.includes(item.id);
        });
        if (assigness.length) {
          return item;
        }
      });
    }

    if (valueSearch) {
      lstTaskDeTailTemp = lstTaskDeTailTemp.filter((item: TaskDetailType) => {
        return item.taskName.trim().toLowerCase().includes(valueSearch.trim().toLowerCase());
      });
    }

    return lstTaskDeTailTemp.map((task: TaskDetailType, index: number) => {
      return (
        <Draggable
          key={task.taskId + ''}
          draggableId={task.taskId + ''}
          {...provided.droppableProps}
          index={index}
        >
          {(provided: DraggableProvided): JSX.Element => {
            return (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="project-content-content"
              >
                <TaskDetail
                  listTask={listTask}
                  setOpenUpdateTask={setOpenUpdateTask}
                  setListTask={setListTask}
                  task={task}
                  taskListDetail={taskListDetail}
                />
              </div>
            );
          }}
        </Draggable>
      );
    });
  };

  return (
    <div className="project-content">
      <div className="project-content-wrapper">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="project-content-list">
            {listTask?.map((taskListDetail: Task, index: number) => {
              return (
                <div key={index} className="project-content-col">
                  <div className="project-content-container">
                    <div className="project-content-item-title">{taskListDetail.statusName}</div>
                    <Droppable key={index} droppableId={taskListDetail.statusId}>
                      {(provided: DroppableProvided): JSX.Element => {
                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="content-list"
                          >
                            {handleRenderCol(
                              taskListDetail.lstTaskDeTail,
                              provided,
                              taskListDetail,
                            )}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Content;
