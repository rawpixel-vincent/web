import { useStorageValue, } from '../useStorageValue/index.js';
import { isBrowser, noop } from '../util/const.js';
let IS_SESSION_STORAGE_AVAILABLE;
try {
    IS_SESSION_STORAGE_AVAILABLE = isBrowser && Boolean(globalThis.sessionStorage);
}
catch {
    IS_SESSION_STORAGE_AVAILABLE = false;
}
/**
 * Manages a single sessionStorage key.
 */
export const useSessionStorageValue = IS_SESSION_STORAGE_AVAILABLE ?
    (key, options) => useStorageValue(sessionStorage, key, options) :
    (_key, _options) => {
        if (isBrowser && process.env.NODE_ENV === 'development') {
            console.warn('SessionStorage is not available in this environment');
        }
        return { value: undefined, set: noop, remove: noop, fetch: noop };
    };
