import { Route, Routes } from 'react-router-dom';
import { routes } from './routes.constants';

export const Header = () => {
  return (
    <Routes>
      {routes.map(({ path, HeaderComponent }) => (
        <Route
          key={path}
          path={path}
          // eslint-disable-next-line react/jsx-no-useless-fragment
          element={HeaderComponent ? <HeaderComponent /> : <></>}
        />
      ))}
    </Routes>
  );
};
