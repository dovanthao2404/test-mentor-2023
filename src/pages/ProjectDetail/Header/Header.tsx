import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { SearchOutlined, UserAddOutlined, PlusOutlined } from '@ant-design/icons';
import { AutoComplete, Breadcrumb, Button, Input, Popover } from 'antd';

import { Tooltip } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../redux/configureStore';
import { AssignUserToProjectRequest, ProjectDetail } from '../../../redux/project/project.model';
import { Link, useParams } from 'react-router-dom';
import CheckboxMenu from '../CheckboxMenu';
import { getUserByKeyword } from '../../../redux/user/actions';
import useDebounce from '../../../hooks/useDebounce/useDebounce';
import { UserByKeywordResponse } from '../../../redux/user/user.model';

interface HeaderProps {
  arrUserFilter: number[];
  setArrUserFilter: Dispatch<SetStateAction<number[]>>;
  arrUserFilterCheckbox: number[];
  setArrUserFilterCheckbox: Dispatch<SetStateAction<number[]>>;
  arrUserFilterFirst: number[];
  setArrUserFilterFirst: Dispatch<SetStateAction<number[]>>;
  valueSearch: string;
  setValueSearch: Dispatch<SetStateAction<string>>;
  handleAssignUserToProject: (a: AssignUserToProjectRequest) => void;
  setOpenCreateTask: Dispatch<SetStateAction<boolean>>;
}

const Header: FC<HeaderProps> = (props) => {
  const {
    arrUserFilter,
    arrUserFilterCheckbox,
    arrUserFilterFirst,
    setArrUserFilter,
    setArrUserFilterCheckbox,
    setArrUserFilterFirst,
    valueSearch,
    setValueSearch,
    handleAssignUserToProject,
    setOpenCreateTask,
  } = props;

  const dispatch = useAppDispatch();

  const [value, setValue] = useState<string>('');
  const debouncedValue = useDebounce<string>(value, 500);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [initComp, setInitComp] = useState<boolean>(true);
  const [detail, setDetail] = useState<ProjectDetail | null>(null);

  const { projectDetail: details } = useAppSelector((state) => state.project);
  const userByKeyword = useAppSelector((state) => state.users.userByKeyword);
  const { id } = useParams();

  useEffect(() => {
    setDetail(details);
  }, [details]);

  const onCheckboxChange = (selection): void => {
    const listUserId = selection.reduce((total, item) => [...total, item.userId], []);
    setArrUserFilterCheckbox(listUserId);
    setArrUserFilter([...arrUserFilterFirst, ...listUserId]);
  };

  const handleClickAvatarFirst = (itemUser: UserByKeywordResponse): void => {
    if (arrUserFilterFirst.length) {
      const index = arrUserFilterFirst.findIndex((item) => {
        return item === itemUser.userId;
      });

      if (index === -1) {
        const listUserIdFirst = [...arrUserFilterFirst, itemUser.userId];
        setArrUserFilterFirst(listUserIdFirst);
        setArrUserFilter([...listUserIdFirst, ...arrUserFilterCheckbox]);
      } else {
        const arrUserFilterFirstTemp = [...arrUserFilterFirst];
        arrUserFilterFirstTemp.splice(index, 1);
        setArrUserFilterFirst([...arrUserFilterFirstTemp]);
        setArrUserFilter([...arrUserFilterFirstTemp, ...arrUserFilterCheckbox]);
      }
    } else {
      setArrUserFilterFirst([itemUser.userId]);
      setArrUserFilter([itemUser.userId, ...arrUserFilterCheckbox]);
    }
  };

  const handleAssignProject = (values: { label: string; value: string }): void => {
    if (id) {
      handleAssignUserToProject({
        projectId: +id,
        userId: +values.value,
      });
    }
  };

  const handleGetListOptions = (): { label: string; value: string }[] => {
    const listIdMember = detail?.members.map((item) => item.userId);
    const listFilter = userByKeyword?.filter((opts) => !listIdMember?.includes(opts.userId));
    return listFilter?.map((item) => ({
      label: item.name,
      value: item.userId.toString(),
    }));
  };

  const handleVisibleChange = (visible: boolean): void => {
    setValue('');
    setVisible(visible);
  };

  useEffect(() => {
    if (!initComp) {
      dispatch(getUserByKeyword(value));
    } else {
      setInitComp(false);
    }
  }, [debouncedValue]);

  return (
    <div className="project-header">
      <div className="project-header-content">
        <Breadcrumb
          items={[{ title: <Link to="/">Project</Link> }, { title: detail?.projectName }]}
        />

        <div className="box-input">
          <Input
            onFocus={(): void => {
              const el = document.querySelector<HTMLElement>('.input-search');
              if (el) {
                el.style.width = '200px';
              }
            }}
            className="input-search"
            onChange={(e): void => {
              setValueSearch(e.target.value);
            }}
            onBlur={(): void => {
              if (!valueSearch) {
                const el = document.querySelector<HTMLElement>('.input-search');
                if (el) {
                  el.style.width = '120px';
                }
              }
            }}
            suffix={<SearchOutlined />}
          />
          <div className="list-avatar-user">
            {detail?.members?.slice(0, 4).map((item, index) => {
              const active = arrUserFilter.includes(item.userId) ? 'active' : '';
              return (
                <div key={index} className="list-avatar-user-item">
                  <Tooltip placement="top" title={item.name}>
                    <img
                      onClick={(): void => {
                        handleClickAvatarFirst(item);
                      }}
                      src={item.avatar}
                      alt={item.name}
                      className={`img-avatar ${active}`}
                    />
                  </Tooltip>
                </div>
              );
            })}

            <div className="list-avatar-user-item">
              {detail?.members?.length && detail?.members.length - 4 > 0 ? (
                <CheckboxMenu
                  isDelete={isDelete}
                  setIsDelete={setIsDelete}
                  options={detail?.members?.slice(4).map((item, index) => {
                    const active = arrUserFilter.includes(item.userId) ? 'active' : '';

                    return {
                      view: (
                        <div className="member-options" key={index}>
                          <img src={item.avatar} alt="" className={`${active}`} />
                          {item.name}
                        </div>
                      ),
                      item,
                    };
                  })}
                  onChange={onCheckboxChange}
                  name={
                    <div className={`more-user ${arrUserFilterCheckbox?.length ? 'active' : ''}`}>
                      <span>+{detail?.members?.length && detail?.members.length - 4}</span>
                    </div>
                  }
                />
              ) : (
                ''
              )}{' '}
              <div className={`more-user`}>
                <Popover
                  content={(): JSX.Element => (
                    <AutoComplete
                      options={handleGetListOptions()}
                      value={value}
                      className="w-100"
                      onChange={(txt): void => {
                        setValue(txt);
                      }}
                      onSelect={(_, values): void => {
                        setVisible(!visible);

                        handleAssignProject(values);

                        setValue('');
                      }}
                      onFocus={(): void => {
                        dispatch(getUserByKeyword(value));
                      }}
                    />
                  )}
                  title="Add member"
                  trigger="click"
                  open={visible}
                  onOpenChange={handleVisibleChange}
                >
                  <Button shape="circle" icon={<UserAddOutlined />} />
                </Popover>
              </div>
            </div>
          </div>
          <div className="btn-wrapper-header">
            <div className="create-task">
              <Button
                type="primary"
                onClick={(): void => {
                  setOpenCreateTask(true);
                }}
              >
                <p>Create Task</p> <PlusOutlined className="btn-icon" />
              </Button>
            </div>
            {arrUserFilter?.length ? (
              <div className="create-task">
                <button
                  onClick={(): void => {
                    setIsDelete(true);
                    setArrUserFilter([]);
                    setArrUserFilterCheckbox([]);
                    setArrUserFilterFirst([]);
                  }}
                  className="btn-create-task priority"
                >
                  <span>Clear filters</span>
                </button>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
