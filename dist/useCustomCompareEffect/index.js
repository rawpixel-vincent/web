import { useEffect, useRef } from 'react';
import { isBrowser } from '../util/const.js';
import { basicDepsComparator } from '../util/misc.js';
/**
 * Like `useEffect` but uses provided comparator function to validate dependency changes.
 *
 * @param callback Function that will be passed to the underlying effect hook.
 * @param deps Dependency list like the one passed to `useEffect`.
 * @param comparator Function that compares two dependency arrays,
 * and returns `true` if they're equal.
 * @param effectHook Effect hook that will be used to run
 * `callback`. Must match the type signature of `useEffect`, meaning that the `callback` should be
 * placed as the first argument and the dependency list as second.
 * @param effectHookRestArgs Extra arguments that are passed to the `effectHook`
 * after the `callback` and the dependency list.
 */
// eslint-disable-next-line max-params
export function useCustomCompareEffect(callback, deps, comparator = basicDepsComparator, effectHook = useEffect, ...effectHookRestArgs) {
    const dependencies = useRef();
    // Effects are not run during SSR, therefore, it makes no sense to invoke the comparator
    if (dependencies.current === undefined ||
        (isBrowser && !comparator(dependencies.current, deps))) {
        dependencies.current = deps;
    }
    effectHook(callback, dependencies.current, ...effectHookRestArgs);
}
