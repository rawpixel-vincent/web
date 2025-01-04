import { useCallback, useState } from 'react';
import { useSyncedRef } from '../useSyncedRef/index.js';
import { resolveHookState } from '../util/resolve-hook-state.js';
/**
 * Like `useState`, but every value set is passed through a mediator function.
 */
export function useMediatedState(initialState, mediator) {
    const [state, setState] = useState(() => mediator ? mediator(resolveHookState(initialState)) : initialState);
    const mediatorRef = useSyncedRef(mediator);
    return [
        state,
        useCallback((value) => {
            if (mediatorRef.current) {
                setState(previousState => mediatorRef.current?.(resolveHookState(value, previousState)));
            }
            else {
                setState(value);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []),
    ];
}
