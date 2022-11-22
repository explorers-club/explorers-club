import { ReactNode, useContext, useEffect, useRef } from 'react';
import { FooterContext } from './footer.context';

export const useFooter = (component: ReactNode) => {
  // console.log('use footer', component);
  const componentRef = useRef(component);
  const { setFooterComponent } = useContext(FooterContext);
  useEffect(() => {
    console.log('SETTING FOOTER COMP', component, componentRef.current);
    setFooterComponent(componentRef.current);
    return () => {
      setFooterComponent(undefined);
    };
  }, [component, setFooterComponent]);
};
