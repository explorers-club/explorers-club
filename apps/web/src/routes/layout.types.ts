// These types specify the shape of the metadata used in xstate machines
// to power header and footer changes
export type HeaderState = {
  headerText?: string;
  subheaderText?: string;
};

export type FooterState =
  | { visible: false }
  | { visible: true; primaryLabel: string };

export interface LayoutMeta {
  header: HeaderState;
  footer: FooterState;
}
