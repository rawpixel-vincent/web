import { useEffect } from 'react';
import { truthyAndArrayPredicate } from '../util/const.js';
/**
 * Like `useEffect` but its callback is invoked only if all given conditions match a given predicate.
 *
 * @param callback Function that will be passed to the underlying effect hook.
 * @param deps Dependency list like the one passed to `useEffect`. If not
 * `undefined`, the effect will be triggered when the dependencies change and the given `conditions`
 * satisfy the `predicate`.
 * @param conditions List of conditions.
 * @param predicate Predicate that should be satisfied by every condition in `conditions`. By
 * default, the predicate checks that every condition in `conditions` is truthy.
 * @param effectHook Effect hook that will be used to run `callback`. Must match the type signature
 * of `useEffect`, meaning that the `callback` should be placed as the first argument and the
 * dependency list as second.
 * @param effectHookRestArgs Extra arguments that are passed to the `effectHook` after the
 * `callback` and the dependency list.
 */
// eslint-disable-next-line max-params
export function useConditionalEffect(callback, deps, conditions, predicate = truthyAndArrayPredicate, effectHook = useEffect, ...effectHookRestArgs) {
    effectHook((() => {
        if (predicate(conditions)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return callback();
        }
    }), deps, ...effectHookRestArgs);
}
