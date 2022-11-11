import { Route, Routes } from 'react-router-dom';
import { routes } from './routes.constants';

export const Footer = () => {
  return (
    <Routes>
      {routes.map(({ path, FooterComponent }) => (
        <Route
          key={path}
          path={path}
          // eslint-disable-next-line react/jsx-no-useless-fragment
          element={FooterComponent ? <FooterComponent /> : <></>}
        />
      ))}
    </Routes>
  );
};
