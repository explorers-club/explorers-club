// On writing good selector functions
// https://redux.js.org/usage/deriving-data-selectors
// and
// https://medium.com/swlh/building-efficient-reselect-selectors-759800f8ed7f

// Ideally, only your reducer functions and selectors
// should know the exact state structure, so if you
// change where some state lives, you would only need
// to update those two pieces of logic.
import { AppState } from './app.machine';

export const selectAppContext = (state: AppState) => state.context;
