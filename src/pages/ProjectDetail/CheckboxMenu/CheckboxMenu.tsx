import { Checkbox, Row, Col, Popover } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { UserByKeywordResponse } from '../../../redux/user/user.model';

interface CheckboxMenuProps {
  isDelete: boolean;
  setIsDelete: Dispatch<SetStateAction<boolean>>;
  options: { view: JSX.Element; item: UserByKeywordResponse }[];
  onChange: (a?: unknown) => void;
  name: JSX.Element;
}
const CheckboxMenu: FC<CheckboxMenuProps> = (props) => {
  const [state, setState] = useState<{ selectedItems: CheckboxValueType[] }>({
    selectedItems: [],
  });

  const onChange = (selection: CheckboxValueType[]): void => {
    setState({ ...state, selectedItems: [...selection] });
    props.onChange(selection);
  };

  const checkboxRender = (): JSX.Element => {
    const groups = props.options
      .map(function (_, i: number) {
        return i % 10 === 0 ? props.options.slice(i, i + 10) : null;
      })
      .filter((a) => a);

    return (
      <Checkbox.Group onChange={onChange} value={state.selectedItems}>
        <Row>
          {groups.map((group, i) => {
            return (
              <Col key={'checkbox-group-' + i} span={Math.floor(24 / groups?.length)}>
                {group?.map((label, i) => {
                  return (
                    <Checkbox key={i} value={label.item} className="check-box-item">
                      {label.view}
                    </Checkbox>
                  );
                })}
              </Col>
            );
          })}
        </Row>
      </Checkbox.Group>
    );
  };

  const CheckboxRender = checkboxRender;
  return (
    <Popover content={<CheckboxRender />} placement="bottomLeft">
      {props.name}
    </Popover>
  );
};

export default CheckboxMenu;
