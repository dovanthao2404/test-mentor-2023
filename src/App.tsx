import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

function App(): React.ReactElement {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
