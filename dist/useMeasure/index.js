import { useState } from 'react';
import { useHookableRef } from '../useHookableRef/index.js';
import { useRafCallback } from '../useRafCallback/index.js';
import { useResizeObserver } from '../useResizeObserver/index.js';
/**
 * Uses ResizeObserver to track element dimensions and re-render component when they change.
 *
 * @param enabled Whether resize observer is enabled or not.
 */
export function useMeasure(enabled = true) {
    const [element, setElement] = useState(null);
    const elementRef = useHookableRef(null, (v) => {
        setElement(v);
        return v;
    });
    const [measures, setMeasures] = useState();
    const [observerHandler] = useRafCallback((entry) => {
        setMeasures({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    useResizeObserver(element, observerHandler, enabled);
    return [measures, elementRef];
}
