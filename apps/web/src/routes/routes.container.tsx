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
