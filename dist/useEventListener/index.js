import { useEffect, useMemo } from 'react';
import { useIsMounted } from '../useIsMounted/index.js';
import { useSyncedRef } from '../useSyncedRef/index.js';
import { hasOwnProperty, off, on } from '../util/misc.js';
/**
 *  An HTML element or ref object containing an HTML element.
 *
 * @param target An HTML element or ref object containing an HTML element.
 * @param params Parameters specific to the target element's `addEventListener` method. Commonly
 * something like `[eventName, listener, options]`.
 */
export function useEventListener(target, ...params) {
    const isMounted = useIsMounted();
    // Create static event listener
    const listenerRef = useSyncedRef(params[1]);
    const eventListener = useMemo(() => 
    // As some event listeners designed to be used through `this`
    // it is better to make listener a conventional function as it
    // infers call context
    function (...args) {
        if (!isMounted()) {
            return;
        }
        // We dont care if non-listener provided, simply dont do anything
        if (typeof listenerRef.current === 'function') {
            listenerRef.current.apply(this, args);
        }
        else if (typeof listenerRef.current.handleEvent === 'function') {
            listenerRef.current.handleEvent.apply(this, args);
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    useEffect(() => {
        const tgt = isRefObject(target) ? target.current : target;
        if (!tgt) {
            return;
        }
        const restParams = params.slice(2);
        on(tgt, params[0], eventListener, ...restParams);
        return () => {
            off(tgt, params[0], eventListener, ...restParams);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, params[0]]);
}
function isRefObject(target) {
    return target !== null && typeof target === 'object' && hasOwnProperty(target, 'current');
}
