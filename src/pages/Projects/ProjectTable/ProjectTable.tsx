import { Button, Empty, Popconfirm, Popover, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { FC, useCallback, useMemo } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '../../../redux/configureStore';
import {
  AssignUserToProjectRequest,
  ProjectMember,
  ProjectResponse,
  RemoveUserFromProjectRequest,
  UpdateProjectRequest,
} from '../../../redux/project/project.model';
import { deleteProject } from '../../../redux/project/actions';
import PopAssign from '../PopAssign/';
import { DrawerPayload, hideDrawer, showDrawer } from '../../../redux/drawer/slice';
import FormUpdateProject from '../FormUpdateProject';
interface ProjectTableProps {
  searchValue: string;
  handleAssignUserToProject: (a: AssignUserToProjectRequest) => void;
  handleDeleteUserFomProject: (a: RemoveUserFromProjectRequest) => void;
  handleUpdateProject: (a: UpdateProjectRequest) => void;
}

const ProjectTable: FC<ProjectTableProps> = ({
  searchValue,
  handleAssignUserToProject,
  handleDeleteUserFomProject,
  handleUpdateProject,
}) => {
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.users.userLogin.id);

  const data: ProjectResponse[] = useAppSelector((state) => state.project.projects);

  const content = useCallback((members: ProjectMember[], record: ProjectResponse): JSX.Element => {
    const idCreator = record.creator.id;
    const isOwn = idCreator == userId;
    return (
      <table className="table-content" style={{ width: 300 }}>
        <colgroup>
          <col style={{ width: 'calc(15%)' }} />
          <col style={{ width: 'calc(25%)' }} />
          <col style={{ width: 'calc(40%)' }} />
          <col style={{ width: 'calc(20%)' }} />
        </colgroup>
        <thead>
          <tr className="class m-0">
            <th>ID</th>
            <th>Avatar</th>
            <th>Name</th>
            {isOwn && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {members?.map((member, index) => {
            return (
              <tr key={index} className="class m-0 pop-tr">
                <td>{member.userId}</td>
                <td>
                  <img
                    className="residual-item"
                    src={member.avatar}
                    alt={member.name}
                    style={{ borderRadius: '50%', width: 30, height: 30 }}
                  />
                </td>
                <td>{member.name}</td>

                {isOwn && (
                  <td>
                    <DeleteOutlined
                      style={{ fontSize: '20px' }}
                      onClick={(): void => {
                        const infoDele: RemoveUserFromProjectRequest = {
                          projectId: record.id,
                          userId: member.userId,
                        };
                        handleDeleteUserFomProject(infoDele);
                      }}
                    />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }, []);

  const handleRenderMembers = useCallback((text, record: ProjectResponse): JSX.Element => {
    const isOwn = userId === record.creator?.id;
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar.Group maxCount={2} maxStyle={{ color: '#096dd9', backgroundColor: ' #e6f7ff' }}>
          {text.map((member, index) => {
            return (
              <Popover key={index} content={(): JSX.Element => content(text, record)}>
                <Avatar className="avatar-member " key={member.userId}>
                  <img src={member.avatar} alt="" />
                </Avatar>
              </Popover>
            );
          })}
        </Avatar.Group>
        {isOwn && (
          <PopAssign handleAssignUserToProject={handleAssignUserToProject} record={record} />
        )}
      </div>
    );
  }, []);

  const columns: ColumnsType<ProjectResponse> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        sorter: (a, b) => a.id - b.id,
        defaultSortOrder: 'descend',
      },
      {
        title: 'Project Name',
        dataIndex: 'projectName',
        render: (text, record): JSX.Element => {
          return <Link to={`/project-detail/${record.id}`}>{text + ' (Detail Here)'}</Link>;
        },
        sorter: (a, b): number => a.projectName.localeCompare(b.projectName),
        width: '25%',
        defaultSortOrder: 'ascend',
      },
      {
        title: 'Category',
        dataIndex: 'categoryName',
      },
      {
        title: 'Creator',
        dataIndex: 'creator',
        render: (text, record, index): JSX.Element => {
          return (
            <Tag color={userId === record.creator?.id ? 'red' : 'blue'} key={index}>
              {text.name.toUpperCase()}
            </Tag>
          );
        },
      },

      {
        title: 'Members',
        dataIndex: 'members',
        render: handleRenderMembers,
      },
      {
        title: 'Actions',
        render: (_, record: ProjectResponse): JSX.Element => {
          if (record.creator && record.creator.id === userId) {
            return (
              <div className="table-action">
                <Button
                  type="primary"
                  onClick={(): void => {
                    const drawerPayload: DrawerPayload = {
                      DrawerContent: (
                        <FormUpdateProject
                          handleUpdateProject={handleUpdateProject}
                          project={record}
                        />
                      ),
                      title: 'Edit Project',
                      onClose: () => {
                        return dispatch(hideDrawer());
                      },
                    };

                    dispatch(showDrawer(drawerPayload));
                  }}
                  icon={<EditOutlined />}
                />

                <Popconfirm
                  title="Are you sure to delete this project?"
                  onConfirm={(): void => {
                    confirm(record);
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </div>
            );
          }
          return <></>;
        },
      },
    ],
    [],
  );
  function confirm(record): void {
    dispatch(deleteProject(record.id));
  }

  let dataSearch = data ? [...data] : [];
  if (searchValue && data) {
    dataSearch = data.filter((item) => {
      return item.projectName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;
    });
  }
  return data ? (
    <Table
      columns={columns}
      locale={{
        emptyText: (
          <Empty description="You do not have a project or have not participated in any project yet!" />
        ),
      }}
      dataSource={dataSearch}
      rowKey={(record): number => record.id}
      key={'id'}
      bordered
      pagination={{
        position: ['bottomCenter'],
        pageSize: 8,
        showSizeChanger: false,
      }}
    />
  ) : (
    <></>
  );
};

export default ProjectTable;
