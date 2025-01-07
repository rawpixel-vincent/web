import { useCallback, useState } from 'react';
import { useSyncedRef } from '../useSyncedRef/index.js';
/**
 * Like `useState` but instead of raw state, state getter returned.
 */
export function useFunctionalState(initialState) {
    const [state, setState] = useState(initialState);
    const stateRef = useSyncedRef(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return [useCallback(() => stateRef.current, []), setState];
}
