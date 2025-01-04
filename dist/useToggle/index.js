import { useCallback, useState } from 'react';
import { useSyncedRef } from '../useSyncedRef/index.js';
import { resolveHookState } from '../util/resolve-hook-state.js';
/**
 * Like `useState`, but can only become `true` or `false`.
 *
 * State setter, in case called without arguments, will change the state to opposite. React
 * synthetic events are ignored by default so state setter can be used as event handler directly,
 * such behaviour can be changed by setting 2nd parameter to `false`.
 */
export function useToggle(initialState = false, ignoreReactEvents = true) {
    // We don't use useReducer (which would end up with less code), because exposed
    // action does not provide functional updates feature.
    // Therefore, we have to create and expose our own state setter with
    // toggle logic.
    const [state, setState] = useState(initialState);
    const ignoreReactEventsRef = useSyncedRef(ignoreReactEvents);
    return [
        state,
        useCallback((nextState) => {
            setState((previousState) => {
                if (nextState === undefined ||
                    (ignoreReactEventsRef.current &&
                        typeof nextState === 'object' &&
                        (nextState.constructor.name === 'SyntheticBaseEvent' ||
                            // @ts-expect-error React internals
                            typeof nextState._reactName === 'string'))) {
                    return !previousState;
                }
                return Boolean(resolveHookState(nextState, previousState));
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []),
    ];
}
