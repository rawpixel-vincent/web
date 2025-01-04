import { type DependencyList } from 'react';
import { type ConditionsList, type ConditionsPredicate } from '../types.js';
import { type EffectCallback, type EffectHook } from '../util/misc.js';
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
export declare function useConditionalEffect<Cond extends ConditionsList, Callback extends EffectCallback = EffectCallback, Deps extends DependencyList | undefined = DependencyList | undefined, HookRestArgs extends any[] = any[], R extends HookRestArgs = HookRestArgs>(callback: Callback, deps: Deps, conditions: Cond, predicate?: ConditionsPredicate<Cond>, effectHook?: EffectHook<Callback, Deps, HookRestArgs>, ...effectHookRestArgs: R): void;
