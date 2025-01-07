import { type UseStorageValueOptions, type UseStorageValueResult } from '../useStorageValue/index.js';
type UseSessionStorageValue = <Type, Default extends Type = Type, Initialize extends boolean | undefined = boolean | undefined>(key: string, options?: UseStorageValueOptions<Type, Initialize>) => UseStorageValueResult<Type, Default, Initialize>;
/**
 * Manages a single sessionStorage key.
 */
export declare const useSessionStorageValue: UseSessionStorageValue;
export {};
