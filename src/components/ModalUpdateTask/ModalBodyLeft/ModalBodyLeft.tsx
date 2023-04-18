import { Editor } from '@tinymce/tinymce-react';
import { Dispatch, FC, SetStateAction, useRef, useState } from 'react';
import { useEffect } from 'react';
import { TaskDetailResponse, UpdateTaskRequest } from '../../../redux/project/project.model';
import { Editor as TinyMCEEditor } from 'tinymce';
import useDebounce from '../../../hooks/useDebounce/useDebounce';
interface ModalBodyLeftProps {
  taskDetailReal: TaskDetailResponse;
  setTaskDetailReal: Dispatch<SetStateAction<TaskDetailResponse>>;
  handleUpdateTask: (
    request: UpdateTaskRequest,
    fn?: (a: 'error' | 'success') => void,
  ) => Promise<void>;
}

const ModalBodyLeft: FC<ModalBodyLeftProps> = (props) => {
  const { taskDetailReal, setTaskDetailReal, handleUpdateTask } = props;

  const [taskName, setTaskName] = useState<string>('');
  const debouncedValue = useDebounce<string>(taskName, 500);
  const [initComp, setInitComp] = useState<boolean>(true);
  const [isHeaderChange, setIsHeaderChange] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');

  const editorRef = useRef<TinyMCEEditor | null>(null);
  const inputDescriptionRefReal = useRef<HTMLDivElement>(null);
  const inputDescriptionRefFake = useRef<HTMLDivElement>(null);

  useEffect((): void => {
    if (taskDetailReal?.description) {
      setDescription(taskDetailReal?.description);
    }
  }, [taskDetailReal?.description]);

  useEffect((): void => {
    if (taskDetailReal?.taskName) {
      setTaskName(taskDetailReal?.taskName);
    }
  }, [taskDetailReal?.taskName]);

  useEffect(() => {
    if (!initComp && isHeaderChange) {
      setTaskDetailReal({
        ...taskDetailReal,
        taskName,
      });
      const info: UpdateTaskRequest = {
        ...taskDetailReal,
        listUserAsign: taskDetailReal?.assigness?.map((item) => item.id),
        taskName: taskName,
      };
      handleUpdateTask(info, callBackUpdateTask);
    } else {
      setInitComp(false);
    }
  }, [debouncedValue]);

  const handleOnEditorChange = (value): void => {
    setDescription(value);
  };

  const callBackUpdateTask = (type: 'success' | 'error'): void => {
    if (type === 'success') {
      if (inputDescriptionRefReal.current) {
        inputDescriptionRefReal.current.style.display = 'none';
      }
      if (inputDescriptionRefFake.current) {
        inputDescriptionRefFake.current.style.display = 'block';
      }
    }
  };

  const handleChangeDescription = (): void => {
    setTaskDetailReal({
      ...taskDetailReal,
      description: description,
    });
    const info: UpdateTaskRequest = {
      ...taskDetailReal,
      listUserAsign: taskDetailReal?.assigness?.map((item) => item.id),
      description: description,
    };
    handleUpdateTask(info, callBackUpdateTask);
  };

  const handleCancelDescription = (): void => {
    if (inputDescriptionRefReal.current) {
      inputDescriptionRefReal.current.style.display = 'none';
    }
    if (inputDescriptionRefFake.current) {
      inputDescriptionRefFake.current.style.display = 'block';
    }
    setDescription(taskDetailReal?.description);
  };
  return (
    <div className="modal-body-update-left">
      <div className="modal-body-update-left-container">
        <div className="header">
          <input
            className="task-name input-task-name"
            type="text"
            value={taskName}
            onChange={(e): void => {
              setIsHeaderChange(true);
              setTaskName(e.target.value);
            }}
          />
        </div>
        <div className="modal-left-content">
          <div className="description">
            <span className="title">Description</span>
            <div
              ref={inputDescriptionRefFake}
              className="description-fake"
              onClick={(): void => {
                if (inputDescriptionRefFake.current) {
                  inputDescriptionRefFake.current.style.display = 'none';
                }
                if (inputDescriptionRefReal.current) {
                  inputDescriptionRefReal.current.style.display = 'block';
                }
              }}
            >
              {taskDetailReal?.description.length ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: description,
                  }}
                />
              ) : (
                <span>Add a description...</span>
              )}
            </div>
            <div ref={inputDescriptionRefReal} style={{ display: 'none' }}>
              <Editor
                id="description-update-task"
                onInit={(_, editor): TinyMCEEditor => (editorRef.current = editor)}
                value={description}
                apiKey="z6e682u7ukhhcpgkzar00ubmsr3c199g6srypf55jr6vkksh"
                init={{
                  height: 300,
                  menubar: false,
                  theme: 'silver',
                  toolbar:
                    'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | media | table',
                  //paste Core plugin options
                  paste_block_drop: false,
                  paste_data_images: true,
                  paste_as_text: true,
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
                onEditorChange={handleOnEditorChange}
              />
              <div>
                <div className="action-common">
                  <button className="btn-save" onClick={handleChangeDescription}>
                    <span>Save</span>
                  </button>
                  <button onClick={handleCancelDescription} className="btn-cancel">
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ModalBodyLeft;
