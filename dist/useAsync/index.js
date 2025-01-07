import { useMemo, useRef, useState } from 'react';
import { useSyncedRef } from '../useSyncedRef/index.js';
/**
 * Tracks the result and errors of the provided async function and provides handles to control its execution.
 *
 * @param asyncFn Function that returns a promise.
 * @param initialValue Value that will be set on initialisation before the async function is
 * executed.
 */
export function useAsync(asyncFn, initialValue) {
    const [state, setState] = useState({
        status: 'not-executed',
        error: undefined,
        result: initialValue,
    });
    const promiseRef = useRef();
    const argsRef = useRef();
    const methods = useSyncedRef({
        execute(...params) {
            argsRef.current = params;
            const promise = asyncFn(...params);
            promiseRef.current = promise;
            setState(s => ({ ...s, status: 'loading' }));
            // eslint-disable-next-line promise/catch-or-return
            promise.then((result) => {
                // We dont want to handle result/error of non-latest function
                // this approach helps to avoid race conditions
                if (promise === promiseRef.current) {
                    setState(s => ({ ...s, status: 'success', error: undefined, result }));
                }
            }, 
            // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
            (error) => {
                // We don't want to handle result/error of non-latest function
                // this approach helps to avoid race conditions
                if (promise === promiseRef.current) {
                    setState(previousState => ({ ...previousState, status: 'error', error }));
                }
            });
            return promise;
        },
        reset() {
            setState({
                status: 'not-executed',
                error: undefined,
                result: initialValue,
            });
            promiseRef.current = undefined;
            argsRef.current = undefined;
        },
    });
    return [
        state,
        useMemo(() => ({
            reset() {
                methods.current.reset();
            },
            execute: (...params) => methods.current.execute(...params),
        }), 
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []),
        { promise: promiseRef.current, lastArgs: argsRef.current },
    ];
}
