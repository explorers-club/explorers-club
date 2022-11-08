// Routing setup inspired by https://blog.logrocket.com/complete-guide-authentication-with-react-router-v6/
import { Route, Routes } from 'react-router-dom';
import { routes } from './routes.constants';

export const RoutesContainer = () => {
  return (
    <Routes>
      {routes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </Routes>
  );
};
