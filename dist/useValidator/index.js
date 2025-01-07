import { useCallback, useEffect, useState } from 'react';
import { useSyncedRef } from '../useSyncedRef/index.js';
/**
 * Performs validation when any of provided dependencies has changed.
 *
 * @param validator Function that performs validation.
 * @param deps Dependencies list that passed straight to underlying `useEffect`.
 * @param initialValidity Initial validity state.
 */
export function useValidator(validator, deps, initialValidity = { isValid: undefined }) {
    const [validity, setValidity] = useState(initialValidity);
    const validatorRef = useSyncedRef(() => {
        if (validator.length > 0) {
            validator(setValidity);
        }
        else {
            setValidity(validator());
        }
    });
    useEffect(() => {
        validatorRef.current();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
    return [
        validity,
        useCallback(() => {
            validatorRef.current();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []),
    ];
}
