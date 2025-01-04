import { useEffect, useState } from 'react';
import { isBrowser } from '../util/const.js';
import { off, on } from '../util/misc.js';
const navigator = isBrowser ? globalThis.navigator : undefined;
const conn = navigator && (navigator.connection ?? navigator.mozConnection ?? navigator.webkitConnection);
function getConnectionState(previousState) {
    const online = navigator?.onLine;
    const previousOnline = previousState?.online;
    return {
        online,
        previous: previousOnline,
        since: online === previousOnline ? previousState?.since : new Date(),
        downlink: conn?.downlink,
        downlinkMax: conn?.downlinkMax,
        effectiveType: conn?.effectiveType,
        rtt: conn?.rtt,
        saveData: conn?.saveData,
        type: conn?.type,
    };
}
/**
 * Tracks the state of browser's network connection.
 */
export function useNetworkState(initialState) {
    const [state, setState] = useState(initialState ?? getConnectionState);
    useEffect(() => {
        const handleStateChange = () => {
            setState(getConnectionState);
        };
        on(globalThis, 'online', handleStateChange, { passive: true });
        on(globalThis, 'offline', handleStateChange, { passive: true });
        if (conn) {
            on(conn, 'change', handleStateChange, { passive: true });
        }
        return () => {
            off(globalThis, 'online', handleStateChange);
            off(globalThis, 'offline', handleStateChange);
            if (conn) {
                off(conn, 'change', handleStateChange);
            }
        };
    }, []);
    return state;
}
