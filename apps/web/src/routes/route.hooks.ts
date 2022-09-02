import { matchRoutes, useLocation } from 'react-router-dom';
import { defaultRoute, routes, Route } from './routes.constants';

export const useCurrentRoute = () => {
  const location = useLocation();
  const match = matchRoutes(routes, location);
  let route: Route | undefined;
  if (match && match[0]) {
    const matchedPath = match[0].route.path;
    route = routes.find((route) => route.path === matchedPath);
  }

  if (!route) {
    return defaultRoute;
  }
  return route;
};
