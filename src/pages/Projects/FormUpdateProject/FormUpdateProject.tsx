import { useState, useRef, FC, useEffect, ChangeEvent, FocusEvent, FormEvent } from 'react';

import { Editor as TinyMCEEditor } from 'tinymce';

import { Editor } from '@tinymce/tinymce-react';
import { useAppSelector } from '../../../redux/configureStore';
import { hideDrawer } from '../../../redux/drawer/slice';
import { useDispatch } from 'react-redux';
import { Button, Space } from 'antd';
import { ProjectResponse, UpdateProjectRequest } from '../../../redux/project/project.model';
interface ProjectTableProps {
  project: ProjectResponse;
  handleUpdateProject: (a: UpdateProjectRequest) => void;
}

const FormUpdateProject: FC<ProjectTableProps> = ({ project, handleUpdateProject }) => {
  const [state, setState] = useState({
    values: {
      id: 0,
      projectName: '',
      description: '',
      category: '',
      categoryId: 0,
    },
    errors: {
      projectName: '',
    },
  });

  useEffect(() => {
    setState({
      ...state,
      values: {
        ...state.values,
        ...project,
      },
    });
  }, [project]);

  const editorRef = useRef<TinyMCEEditor | null>(null);

  const allCategory = useAppSelector((state) => state.master.projectCategory);
  const dispatch = useDispatch();

  const handleOnchange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;

    setState({
      ...state,
      values: { ...state.values, [name]: value },
      errors: { ...state.errors, [name]: '' },
    });
  };

  const handleErrors = (e: FocusEvent<HTMLInputElement>): boolean => {
    const { name, value } = e.target;
    if (!value) {
      setState({
        ...state,
        errors: { ...state.errors, [name]: 'Project name is required!' },
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
      errors: { ...state.errors },
    });
  };

  const handleValidation = (): boolean => {
    let isValid = true;
    let messageProjectName = '';
    if (!state.values.projectName) {
      messageProjectName = 'Project name is required!';
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

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const isValid = handleValidation();
    if (isValid) {
      const projectUpdate: UpdateProjectRequest = {
        categoryId: state.values.categoryId + '',
        description: state.values.description,
        id: state.values.id,
        projectName: state.values.projectName,
      };
      handleUpdateProject(projectUpdate);
    }
  };

  const handleClose = (): void => {
    dispatch(hideDrawer());
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label>ID:</label>
          <input
            className="input-global input-project disabled"
            name="id"
            placeholder="Project name"
            disabled
            value={state.values.id}
          />
        </div>
        <div className="mb-3">
          <label>Name:</label>
          <input
            className="input-global input-project"
            name="projectName"
            placeholder="Project name"
            value={state.values.projectName}
            onBlur={handleErrors}
            onChange={handleOnchange}
          />
          {state.errors.projectName ? (
            <span className="text-danger">{state.errors.projectName}</span>
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
              Update
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

export default FormUpdateProject;
