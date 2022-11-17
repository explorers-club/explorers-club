import { createContext, ReactNode } from 'react';

export const FooterContext = createContext({
  FooterComponent: {} as ReactNode | undefined,
  setFooterComponent: {} as (component?: ReactNode) => void,
});
