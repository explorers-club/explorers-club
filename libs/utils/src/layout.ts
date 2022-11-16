import { AnyState } from 'xstate';

type HiddenFooterProps = {
  visible: false;
};
type VisibleFooterProps = {
  visible: true;
  label: string;
};
export type FooterProps = HiddenFooterProps | VisibleFooterProps;

export const seletFooterProps = (state: AnyState) => state.context.footerProps as FooterProps | undefined;
