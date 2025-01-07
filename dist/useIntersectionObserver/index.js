import { useEffect, useState } from 'react';
const DEFAULT_THRESHOLD = [0];
const DEFAULT_ROOT_MARGIN = '0px';
const observers = new Map();
const getObserverEntry = (options) => {
    const root = options.root ?? document;
    let rootObservers = observers.get(root);
    if (!rootObservers) {
        rootObservers = new Map();
        observers.set(root, rootObservers);
    }
    const opt = JSON.stringify([options.rootMargin, options.threshold]);
    let observerEntry = rootObservers.get(opt);
    if (!observerEntry) {
        const callbacks = new Map();
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                const cbs = callbacks.get(entry.target);
                if (cbs === undefined || cbs.size === 0) {
                    continue;
                }
                for (const cb of cbs) {
                    setTimeout(() => {
                        cb(entry);
                    }, 0);
                }
            }
        }, options);
        observerEntry = {
            observer,
            observe(target, callback) {
                let cbs = callbacks.get(target);
                if (!cbs) {
                    // If target has no observers yet - register it
                    cbs = new Set();
                    callbacks.set(target, cbs);
                    observer.observe(target);
                }
                // As Set is duplicate-safe - simply add callback on each call
                cbs.add(callback);
            },
            unobserve(target, callback) {
                const cbs = callbacks.get(target);
                // Else branch should never occur in case of normal execution
                // because callbacks map is hidden in closure - it is impossible to
                // simulate situation with non-existent `cbs` Set
                if (cbs) {
                    // Remove current observer
                    cbs.delete(callback);
                    if (cbs.size === 0) {
                        // If no observers left unregister target completely
                        callbacks.delete(target);
                        observer.unobserve(target);
                        // If not tracked elements left - disconnect observer
                        if (callbacks.size === 0) {
                            observer.disconnect();
                            rootObservers.delete(opt);
                            if (rootObservers.size === 0) {
                                observers.delete(root);
                            }
                        }
                    }
                }
            },
        };
        rootObservers.set(opt, observerEntry);
    }
    return observerEntry;
};
/**
 * Tracks intersection of a target element with an ancestor element or with a
 * top-level document's viewport.
 *
 * @param target React reference or Element to track.
 * @param options Like `IntersectionObserver` options but `root` can also be
 * react reference
 */
export function useIntersectionObserver(target, { threshold = DEFAULT_THRESHOLD, root: r, rootMargin = DEFAULT_ROOT_MARGIN, } = {}) {
    const [state, setState] = useState();
    useEffect(() => {
        const tgt = target && 'current' in target ? target.current : target;
        if (!tgt) {
            return;
        }
        let subscribed = true;
        const observerEntry = getObserverEntry({
            root: r && 'current' in r ? r.current : r,
            rootMargin,
            threshold,
        });
        const handler = (entry) => {
            // It is reinsurance for the highly asynchronous invocations, almost
            // impossible to achieve in tests, thus excluding from LOC
            if (subscribed) {
                setState(entry);
            }
        };
        observerEntry.observe(tgt, handler);
        return () => {
            subscribed = false;
            observerEntry.unobserve(tgt, handler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, r, rootMargin, ...threshold]);
    return state;
}
