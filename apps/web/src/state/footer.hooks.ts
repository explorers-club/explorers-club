import { ReactNode, useContext, useEffect } from "react";
import { FooterContext } from "./footer.context";

export const useFooter = (component: ReactNode) => {
  const { setFooterComponent } = useContext(FooterContext);
  useEffect(() => {
    setFooterComponent(component);
    return () => {
      setFooterComponent(undefined);
    };
  }, [component, setFooterComponent]);
};