import { useEffect, useState } from 'react';
import { isBrowser } from '../util/const.js';
const queriesMap = new Map();
const createQueryEntry = (query) => {
    const mql = matchMedia(query);
    if (!mql) {
        if (typeof process === 'undefined' ||
            process.env === undefined ||
            process.env.NODE_ENV === 'development' ||
            process.env.NODE_ENV === 'test') {
            console.error(`error: matchMedia('${query}') returned null, this means that the browser does not support this query or the query is invalid.`);
        }
        return {
            mql: {
                onchange: null,
                matches: undefined,
                media: query,
                addEventListener: () => undefined,
                addListener: () => undefined,
                removeListener: () => undefined,
                removeEventListener: () => undefined,
                dispatchEvent: () => false,
            },
            dispatchers: new Set(),
            listener: () => undefined,
        };
    }
    const dispatchers = new Set();
    const listener = () => {
        for (const d of dispatchers) {
            d(mql.matches);
        }
    };
    mql.addEventListener('change', listener, { passive: true });
    return {
        mql,
        dispatchers,
        listener,
    };
};
const querySubscribe = (query, setState) => {
    let entry = queriesMap.get(query);
    if (!entry) {
        entry = createQueryEntry(query);
        queriesMap.set(query, entry);
    }
    entry.dispatchers.add(setState);
    setState(entry.mql.matches);
};
const queryUnsubscribe = (query, setState) => {
    const entry = queriesMap.get(query);
    // Else path is impossible to test in normal situation
    if (entry) {
        const { mql, dispatchers, listener } = entry;
        dispatchers.delete(setState);
        if (dispatchers.size === 0) {
            queriesMap.delete(query);
            if (mql.removeEventListener) {
                mql.removeEventListener('change', listener);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                mql.removeListener(listener);
            }
        }
    }
};
/**
 * Tracks the state of CSS media query.
 *
 * @param query CSS media query to track.
 * @param options Hook options:
 * `initializeWithValue` (default: `true`) - Determine media query match state on first render. Setting
 * this to false will make the hook yield `undefined` on first render.
 * `enabled` (default: `true`) - Enable or disable the hook.
 */
export function useMediaQuery(query, options = {}) {
    let { initializeWithValue = true, enabled = true } = options;
    if (!isBrowser) {
        initializeWithValue = false;
    }
    const [state, setState] = useState(() => {
        if (initializeWithValue && enabled) {
            let entry = queriesMap.get(query);
            if (!entry) {
                entry = createQueryEntry(query);
                queriesMap.set(query, entry);
            }
            return entry.mql.matches;
        }
    });
    useEffect(() => {
        if (!enabled) {
            return;
        }
        querySubscribe(query, setState);
        return () => {
            queryUnsubscribe(query, setState);
        };
    }, [query, enabled]);
    return state;
}
