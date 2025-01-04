import { type DependencyList } from 'react';
import { type DependenciesComparator } from '../types.js';
import { type EffectCallback, type EffectHook } from '../util/misc.js';
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
export declare function useCustomCompareEffect<Callback extends EffectCallback = EffectCallback, Deps extends DependencyList = DependencyList, HookRestArgs extends any[] = any[], R extends HookRestArgs = HookRestArgs>(callback: Callback, deps: Deps, comparator?: DependenciesComparator<Deps>, effectHook?: EffectHook<Callback, Deps, HookRestArgs>, ...effectHookRestArgs: R): void;
