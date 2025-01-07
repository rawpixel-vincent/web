type UseMediaQueryOptions = {
    initializeWithValue?: boolean;
    enabled?: boolean;
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
export declare function useMediaQuery(query: string, options?: UseMediaQueryOptions): boolean | undefined;
export {};
