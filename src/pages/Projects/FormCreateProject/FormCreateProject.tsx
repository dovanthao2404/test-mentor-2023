import { useState, useRef, FC, ChangeEvent, SyntheticEvent } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';

import { Editor } from '@tinymce/tinymce-react';
import { useAppDispatch, useAppSelector } from '../../../redux/configureStore';
import { Button, Space } from 'antd';
import { hideDrawer } from '../../../redux/drawer/slice';
import { ProjectCrateRequest } from '../../../redux/project/project.model';
import { BuildMessage } from '../../../utils/build-message/BuildMessage';
import { createProject } from '../../../redux/project/actions';

const formInit: ProjectCrateRequest = {
  projectName: '',
  description: '',
  categoryId: 0,
  alias: '',
};

const FormCreateProject: FC = () => {
  const dispatch = useAppDispatch();
  const allCategory = useAppSelector((state) => state.master.projectCategory);

  const [state, setState] = useState({
    values: formInit,
    errors: {
      projectName: '',
    },
  });

  const editorRef = useRef<TinyMCEEditor | null>(null);

  const handleOnchange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;

    setState({
      ...state,
      values: { ...state.values, [name]: value },
      errors: { ...state.errors, [name]: '' },
    });
  };

  const handleErrors = (e: ChangeEvent<HTMLInputElement>): boolean => {
    const { name, value } = e.target;
    if (!value) {
      setState({
        ...state,
        errors: { ...state.errors, [name]: BuildMessage.buildMessageById('V001', ['Project']) },
      });
      return false;
    } else {
      setState({
        ...state,
        errors: { ...state.errors, [name]: '' },
      });
      return true;
    }
  };

  const handleOnEditorChange = (value: string): void => {
    setState({
      ...state,
      values: { ...state.values, description: value },
    });
  };

  const handleValidation = (): boolean => {
    let isValid = true;
    let messageProjectName = '';
    if (!state.values.projectName) {
      messageProjectName = BuildMessage.buildMessageById('V001', ['Project']);
      isValid = false;
    }

    setState({
      ...state,
      errors: {
        projectName: messageProjectName,
      },
    });
    return isValid;
  };

  const handleCreateProject = (e: SyntheticEvent): void => {
    e.preventDefault();
    const isValid = handleValidation();
    if (isValid) {
      dispatch(createProject(state.values));
    }
  };

  const handleClose = (): void => {
    dispatch(hideDrawer());
  };

  return (
    <div className="container">
      <form onSubmit={handleCreateProject}>
        <div className="mb-3">
          <label>Name:</label>
          <input
            value={state.values.projectName}
            className="input-global input-project"
            name="projectName"
            placeholder="Project name"
            onBlur={handleErrors}
            onChange={handleOnchange}
          />
          {state.errors.projectName ? (
            <p className="text-danger">{state.errors.projectName}</p>
          ) : (
            ' '
          )}
        </div>
        <div className="mb-3">
          <label>Category:</label>
          <select
            className="input-global input-project"
            aria-label="Default select example"
            name="categoryId"
            value={state.values.categoryId}
            onChange={handleOnchange}
          >
            {allCategory?.map((category, index) => {
              return (
                <option key={index} value={category.id}>
                  {category.projectCategoryName}
                </option>
              );
            })}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="description">Descriptions:</label>

          <Editor
            id="description"
            onInit={(_, editor): TinyMCEEditor => (editorRef.current = editor)}
            value={state.values.description}
            initialValue=""
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
        </div>

        <div className="mb-3 text-right">
          <Space>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
            <Button onClick={handleClose} type="primary" danger ghost>
              Cancel
            </Button>
          </Space>
        </div>
      </form>
    </div>
  );
};

export default FormCreateProject;
