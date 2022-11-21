import { ReactNode, useContext, useEffect, useRef } from 'react';
import { FooterContext } from './footer.context';

export const useFooter = (component: ReactNode) => {
  const componentRef = useRef(component);
  const { setFooterComponent } = useContext(FooterContext);
  useEffect(() => {
    setFooterComponent(componentRef.current);
    return () => {
      setFooterComponent(undefined);
    };
  }, [component, setFooterComponent]);
};
