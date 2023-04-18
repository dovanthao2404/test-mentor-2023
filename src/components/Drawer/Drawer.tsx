import { FC } from 'react';
import { Drawer as DrawerAnt } from 'antd';
import { useAppSelector } from '../../redux/configureStore';
const Drawer: FC = () => {
  const { open, DrawerContent, onClose, title } = useAppSelector((state) => state.drawer);
  return (
    <DrawerAnt
      title={<h4 style={{ margin: 0 }}>{title}</h4>}
      width={720}
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
    >
      {DrawerContent}
    </DrawerAnt>
  );
};

export default Drawer;
