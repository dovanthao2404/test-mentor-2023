import { FC, useEffect, useRef } from 'react';
import './style.scss';
import { Button, Select, Space } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { Tag } from 'antd';
import { Slider } from 'antd';
import * as yup from 'yup';

import { useFormik } from 'formik';

import { useAppDispatch, useAppSelector } from '../../redux/configureStore';
import { BuildMessage } from '../../utils/build-message/BuildMessage';
import { CreateTaskRequest } from '../../redux/project/project.model';
import { getUserByProjectId } from '../../redux/project/actions';

const options = [
  { value: 'gold' },
  { value: 'lime' },
  { value: 'green' },
  { value: 'cyan' },
  { value: 'red' },
  { value: 'blue' },
  { value: 'pink' },
];

const { Option } = Select;
interface ModalCreateTaskProps {
  type: 'detail' | 'list';
  onClose: () => void;
  handleSubmit: (a: CreateTaskRequest) => void;
}
const ModalCreateTask: FC<ModalCreateTaskProps> = ({ type, onClose, handleSubmit }) => {
  const dispatch = useAppDispatch();
  const { id: userId } = useAppSelector((state) => state.users.userLogin);
  const userByProjectId = useAppSelector((state) => state.project.userByProjectId);
  const { projectDetail: detail } = useAppSelector((state) => state.project);
  const projects = useAppSelector((state) => state.project.projects);
  const modalBodyRef = useRef<HTMLDivElement>(null);

  const isList = (): boolean => {
    return type === 'list';
  };

  useEffect(() => {
    if (!isList()) {
      dispatch(getUserByProjectId(detail.id.toString()));
      setFieldValue('projectId', detail.id);
    }
  }, []);

  const schema = yup.object().shape({
    taskName: yup.string().required(BuildMessage.buildMessageById('V001', ['Task name'])),

    projectId: yup.string().required(BuildMessage.buildMessageById('V001', ['Project'])),
  });

  const formik = useFormik({
    initialValues: {
      listUserAsign: [],
      taskName: '',
      description: '',
      statusId: '1',
      originalEstimate: 0,
      timeTrackingSpent: 0,
      timeTrackingRemaining: 0,
      projectId: undefined,
      typeId: 2,
      priorityId: 2,
    },
    validationSchema: schema,

    onSubmit: async (values) => {
      const taskRequest: CreateTaskRequest = {
        description: values.description,
        listUserAsign: values.listUserAsign,
        originalEstimate: values.originalEstimate,
        priorityId: values.priorityId,
        projectId: values.projectId,
        statusId: values.statusId,
        taskName: values.taskName,
        timeTrackingRemaining: values.timeTrackingRemaining,
        timeTrackingSpent: values.timeTrackingSpent,
        typeId: values.typeId,
      };
      handleSubmit(taskRequest);
    },
  });
  const {
    values,
    touched,
    errors,
    setFieldError,
    setFieldTouched,
    setFieldValue,
    handleChange,
    handleBlur,
  } = formik;

  const {
    priority,
    taskType,
    status,
    priority: [],
    projectCategory: [],
    status: [],
    taskType: [],
  } = useAppSelector((state) => state.master);

  function tagRender(props: {
    label: React.ReactNode;
    onClose: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    closable: boolean;
  }): JSX.Element {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = (event): void => {
      event.preventDefault();
      event.stopPropagation();
    };

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

  function capitalizeFirstLetter(string): string {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
  }

  const onChangeByName = (name) => (value) => {
    if (value.target) setFieldValue(name, +value.target.value);
    else setFieldValue(name, value);
  };

  const changeSelectProject = (name) => (value) => {
    if (value) {
      setFieldTouched('projectId', false);
      setFieldError('projectId', '');
    }
    dispatch(getUserByProjectId(value));

    setFieldValue(name, value);
    setFieldValue('listUserAsign', []);
  };

  const handleRenderErrorFooter = (): string => {
    if (Object.keys(errors).length === 1) {
      if (touched.taskName && errors.taskName) {
        return 'Error: Task Name';
      }
      if (touched.projectId && errors.projectId) {
        return 'Error: Project';
      }
    } else if (Object.keys(errors).length === 2) {
      if (touched.taskName && errors.taskName && touched.projectId && errors.projectId) {
        return 'Error: Task Name, Project';
      }
      if (touched.taskName && errors.taskName) {
        return 'Error: Task Name';
      }
      if (touched.projectId && errors.projectId) {
        return 'Error: Project';
      }
    }
    return '';
  };

  return (
    <div className="modal-create-issue">
      <div className="modal-wrapper">
        <div className="modal-header">
          <h3>Create Task</h3>
        </div>
        <div ref={modalBodyRef} className="modal-body">
          <form onSubmit={formik.submitForm}>
            <div className="modal-body-container">
              <div className="modal-body-top">
                <div className="project-select">
                  <span className="label">
                    Project <span className="text-danger">*</span>
                  </span>
                  <Select
                    disabled={!isList()}
                    value={isList() ? values?.projectId : detail?.id}
                    onBlur={(): void => {
                      if (!values?.projectId) {
                        setFieldTouched('projectId');
                        setFieldError('projectId', '* Project is a required field!');
                      }
                    }}
                    onChange={changeSelectProject('projectId')}
                  >
                    {projects
                      ?.filter((item) => userId === item.creator.id)
                      .map((item, index) => (
                        <Option value={item.id} key={index}>
                          {item.projectName}{' '}
                        </Option>
                      ))}
                  </Select>
                  {touched.projectId && errors.projectId ? (
                    <div className="message-error">{errors.projectId}</div>
                  ) : (
                    ''
                  )}
                </div>
                <div className="type">
                  <div className="issue-type-select">
                    <span className="label">
                      Task Type <span className="text-danger">*</span>
                    </span>
                    <Select value={values?.typeId} onChange={onChangeByName('typeId')}>
                      {taskType?.map((item, index) => {
                        return (
                          <Option value={item.id} key={index}>
                            {capitalizeFirstLetter(item.taskType)}
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                  <div className="issue-type-select">
                    <span className="label">
                      Priority <span className="text-danger">*</span>
                    </span>
                    <Select value={values?.priorityId} onChange={onChangeByName('priorityId')}>
                      {priority?.map((item, index) => {
                        return (
                          <Option value={item.priorityId} key={index}>
                            {item.priority}
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                </div>

                <div className="issue-type-select">
                  <label className="label">
                    Status Task <span className="text-danger">*</span>
                  </label>
                  <Select value={values?.statusId} onChange={onChangeByName('statusId')}>
                    {status?.map((item, index) => {
                      return (
                        <Option value={item.statusId} key={index}>
                          {capitalizeFirstLetter(item.statusName)}
                        </Option>
                      );
                    })}
                  </Select>
                </div>

                <div className="time">
                  <span className="label">Time Tracking</span>

                  <Slider
                    className="time-tracking"
                    defaultValue={0}
                    value={values?.timeTrackingSpent}
                    max={Number(values?.timeTrackingSpent) + Number(values?.timeTrackingRemaining)}
                  />
                  <div className="time-tracking-desc">
                    <span>{values?.timeTrackingSpent}h logged</span>
                    <span>{values?.timeTrackingRemaining}h remaining</span>
                  </div>
                  <div className="box-input-time">
                    <div className="left">
                      <label htmlFor="">Time spent</label>
                      <input
                        name="timeTrackingSpent"
                        type="number"
                        className="input-custom"
                        value={values?.timeTrackingSpent}
                        min={0}
                        onChange={onChangeByName('timeTrackingSpent')}
                      />
                    </div>
                    <div className="right">
                      <label htmlFor="">Time remaining</label>
                      <input
                        type="number"
                        name="timeTrackingRemaining"
                        className="input-custom"
                        value={values?.timeTrackingRemaining}
                        min={0}
                        onChange={onChangeByName('timeTrackingRemaining')}
                      />
                    </div>
                  </div>
                  <div className="original-estimate">
                    <label className="label">Original Estimate</label>
                    <input
                      name="originalEstimate"
                      onChange={onChangeByName('originalEstimate')}
                      className="input-custom"
                      value={values?.originalEstimate}
                      type="number"
                      min={0}
                    />
                  </div>
                </div>
                <div className="assign">
                  <span className="label">Assignee</span>
                  <Select
                    mode="multiple"
                    showArrow
                    tagRender={tagRender}
                    onChange={onChangeByName('listUserAsign')}
                    value={values?.listUserAsign}
                    optionFilterProp="label"
                    style={{ width: '100%' }}
                    options={
                      userByProjectId?.map((item) => ({
                        value: item.userId,
                        label: item.name,
                      })) || []
                    }
                  />
                </div>
              </div>
              <div className="modal-body-mid">
                <div className="task-name">
                  <span className="label">
                    Task name <span className="text-danger">*</span>
                  </span>
                  <input
                    name="taskName"
                    onChange={handleChange}
                    value={values?.taskName}
                    onBlur={handleBlur}
                    type="text"
                    className="input-custom"
                  />
                  {touched.taskName && errors.taskName ? (
                    <div className="message-error">{errors.taskName}</div>
                  ) : (
                    ''
                  )}
                </div>
                <div className="description-hi">
                  <span className="label">Description</span>
                  <Editor
                    id="description-hi"
                    init={{
                      height: 250,
                      menubar: false,
                      theme: 'silver',
                      toolbar:
                        'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | media | table',
                      //paste Core plugin options
                      paste_block_drop: false,
                      paste_data_images: true,
                      paste_as_text: true,
                      content_style:
                        'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    }}
                    onEditorChange={onChangeByName('description')}
                    value={values?.description}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <div className="text-red">{handleRenderErrorFooter()}</div>
          <div className="box-create">
            <Space>
              <Button type="primary" onClick={formik.submitForm} htmlType="submit">
                Create
              </Button>
              <Button
                onClick={(): void => {
                  onClose();
                }}
                type="primary"
                danger
                ghost
              >
                Cancel
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateTask;
