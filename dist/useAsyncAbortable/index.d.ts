import { type AsyncState, type UseAsyncActions, type UseAsyncMeta } from '../useAsync/index.js';
export type UseAsyncAbortableActions<Result, Args extends unknown[] = unknown[]> = {
    /**
     *  Abort the currently running async function invocation.
     */
    abort: () => void;
    /**
     * Abort the currently running async function invocation and reset state to initial.
     */
    reset: () => void;
} & UseAsyncActions<Result, Args>;
export type UseAsyncAbortableMeta<Result, Args extends unknown[] = unknown[]> = {
    /**
     * Currently used `AbortController`. New one is created on each execution of the async function.
     */
    abortController: AbortController | undefined;
} & UseAsyncMeta<Result, Args>;
export type ArgsWithAbortSignal<Args extends unknown[] = unknown[]> = [AbortSignal, ...Args];
export declare function useAsyncAbortable<Result, Args extends unknown[] = unknown[]>(asyncFn: (...params: ArgsWithAbortSignal<Args>) => Promise<Result>, initialValue: Result): [
    AsyncState<Result>,
    UseAsyncAbortableActions<Result, Args>,
    UseAsyncAbortableMeta<Result, Args>
];
export declare function useAsyncAbortable<Result, Args extends unknown[] = unknown[]>(asyncFn: (...params: ArgsWithAbortSignal<Args>) => Promise<Result>, initialValue?: Result): [
    AsyncState<Result | undefined>,
    UseAsyncAbortableActions<Result, Args>,
    UseAsyncAbortableMeta<Result, Args>
];
