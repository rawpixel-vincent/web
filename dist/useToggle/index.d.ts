import { type BaseSyntheticEvent } from 'react';
import { type InitialState, type NextState } from '../util/resolve-hook-state.js';
export declare function useToggle(initialState: InitialState<boolean>, ignoreReactEvents: false): [boolean, (nextState?: NextState<boolean>) => void];
export declare function useToggle(initialState?: InitialState<boolean>, ignoreReactEvents?: true): [boolean, (nextState?: NextState<boolean> | BaseSyntheticEvent) => void];
