import { FC, useEffect, useState } from 'react';
import { AutoComplete, Button, Popover } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { AssignUserToProjectRequest, ProjectResponse } from '../../../redux/project/project.model';
import useDebounce from '../../../hooks/useDebounce/useDebounce';
import { getUserByKeyword } from '../../../redux/user/actions';
import { useAppDispatch, useAppSelector } from '../../../redux/configureStore';
import { UserByKeywordResponse } from '../../../redux/user/user.model';

interface ProjectTableProps {
  record: ProjectResponse;
  handleAssignUserToProject: (a: AssignUserToProjectRequest) => void;
}
const PopAssign: FC<ProjectTableProps> = ({ record, handleAssignUserToProject }) => {
  const dispatch = useAppDispatch();
  const userByKeyword = useAppSelector((state) => state.users.userByKeyword);

  const [state, setState] = useState({
    visible: false,
  });
  const [initComp, setInitComp] = useState<boolean>(true);

  const [value, setValue] = useState('');
  const debouncedValue = useDebounce<string>(value, 500);

  const handleVisibleChange = (visible): void => {
    setValue('');
    setState({ visible });
  };

  const recordMembers = record.members.map((member) => member.userId);

  let searDataTemp = userByKeyword ? [...userByKeyword] : [];
  if (recordMembers.length) {
    searDataTemp = searDataTemp.filter((item) => !recordMembers.includes(item.userId));
  }

  useEffect(() => {
    if (!initComp) {
      dispatch(getUserByKeyword(value));
    } else {
      setInitComp(false);
    }
  }, [debouncedValue]);

  return (
    <Popover
      content={(): JSX.Element => (
        <AutoComplete
          options={searDataTemp?.map((opts: UserByKeywordResponse) => {
            return {
              label: opts.name,
              value: opts.userId.toString(),
            };
          })}
          value={value}
          className="w-100"
          onChange={(txt): void => {
            setValue(txt);
          }}
          onSelect={(option, values): void => {
            setValue(values.label);
            setState({ visible: !state.visible });

            handleAssignUserToProject({
              projectId: record.id,
              userId: +values.value,
            });
            setValue('');
          }}
          onFocus={(): void => {
            dispatch(getUserByKeyword(value));
          }}
        />
      )}
      title="Add member"
      trigger="click"
      open={state.visible}
      onOpenChange={handleVisibleChange}
    >
      <Button shape="circle" icon={<UserAddOutlined />} />
    </Popover>
  );
};

export default PopAssign;
