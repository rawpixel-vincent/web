import { type Dispatch } from 'react';
import { type InitialState, type NextState } from '../util/resolve-hook-state.js';
export declare function useMediatedState<State = undefined>(): [
    State | undefined,
    Dispatch<NextState<State | undefined>>
];
export declare function useMediatedState<State>(initialState: InitialState<State>): [State, Dispatch<NextState<State>>];
export declare function useMediatedState<State, RawState = State>(initialState: InitialState<State>, mediator?: (state: RawState) => State): [State, Dispatch<NextState<RawState, State>>];
