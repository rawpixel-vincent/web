import { useState } from 'react';
import { useThrottledCallback } from '../useThrottledCallback/index.js';
/**
 * Like `useState` but its state setter is throttled.
 *
 * @param initialState Initial state to pass to underlying `useState`.
 * @param delay Throttle delay.
 * @param noTrailing If `noTrailing` is true, callback will only execute every
 * `delay` milliseconds, otherwise, callback will be executed one final time
 * after the last throttled-function call.
 */
export function useThrottledState(initialState, delay, noTrailing = false) {
    const [state, setState] = useState(initialState);
    return [state, useThrottledCallback(setState, [], delay, noTrailing)];
}
