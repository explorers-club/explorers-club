import { FC, ReactNode } from 'react';
import { createSelector } from 'reselect';
import { AnyState } from 'xstate';

const selectMetaValue = (state: AnyState) =>
  Object.assign({}, ...Object.values(state?.meta || {}));

export const selectFooterComponent = createSelector(
  selectMetaValue,
  (meta) => meta?.footer as FC<unknown>
);

export const selectHeaderComponent = createSelector(
  selectMetaValue,
  (meta) => meta?.footer as ReactNode | undefined
);
