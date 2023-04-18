import { FC } from 'react';
import './style.scss';
const Loading: FC = () => {
  return (
    <div className="loading-overlay">
      <div className="loader"></div>
    </div>
  );
};
export default Loading;
