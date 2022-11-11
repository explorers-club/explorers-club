import { AnyState } from 'xstate';
import { LayoutMeta } from './layout.types';

export const selectLayoutMetadata = (state: AnyState) => {
  if (!state.meta) {
    return undefined;
  }
  const layoutMetadata = Object.assign({}, ...Object.values(state.meta));
  return layoutMetadata as LayoutMeta; // trust
};
