import { type DependencyList, type Dispatch } from 'react';
import { type InitialState, type NextState } from '../util/resolve-hook-state.js';
export type ValidityState = {
    isValid: boolean | undefined;
} & Record<any, any>;
export type ValidatorImmediate<V extends ValidityState = ValidityState> = () => V;
export type ValidatorDeferred<V extends ValidityState = ValidityState> = (done: Dispatch<NextState<V>>) => any;
export type Validator<V extends ValidityState = ValidityState> = ValidatorImmediate<V> | ValidatorDeferred<V>;
export type UseValidatorReturn<V extends ValidityState> = [V, () => void];
/**
 * Performs validation when any of provided dependencies has changed.
 *
 * @param validator Function that performs validation.
 * @param deps Dependencies list that passed straight to underlying `useEffect`.
 * @param initialValidity Initial validity state.
 */
export declare function useValidator<V extends ValidityState>(validator: Validator<V>, deps: DependencyList, initialValidity?: InitialState<V>): UseValidatorReturn<V>;
