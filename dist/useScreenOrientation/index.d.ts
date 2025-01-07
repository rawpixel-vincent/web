export type ScreenOrientation = 'portrait' | 'landscape';
type UseScreenOrientationOptions = {
    initializeWithValue?: boolean;
    enabled?: boolean;
};
/**
 * Checks if screen is in `portrait` or `landscape` orientation.
 *
 * As `Screen Orientation API` is still experimental and not supported by Safari, this
 * hook uses CSS3 `orientation` media-query to check screen orientation.
 * @param options Hook options:
 * `initializeWithValue` (default: `true`) - Determine screen orientation on first render. Setting
 * this to false will make the hook yield `undefined` on first render.
 * `enabled` (default: `true`) - Enable or disable the hook.
 */
export declare function useScreenOrientation(options?: UseScreenOrientationOptions): ScreenOrientation | undefined;
export {};
