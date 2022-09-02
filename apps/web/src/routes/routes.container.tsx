import { Route, Routes } from 'react-router-dom';
import { Home } from './home';
import { NewParty } from './new-party';
import { Party } from './party';
import { PlayerSetup } from './player-setup';
import { routes } from './routes.constants';

export const RoutesContainer = () => {
  return (
    <Routes>
      {routes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      <Route path="/" element={<Home />} />
      <Route path="/player-setup" element={<PlayerSetup />} />
      <Route path="/party/new" element={<NewParty />} />
      <Route path="/party/:code" element={<Party />} />
    </Routes>
  );
};
