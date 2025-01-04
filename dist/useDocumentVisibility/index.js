import { useState } from 'react';
import { useEventListener } from '../useEventListener/index.js';
import { useMountEffect } from '../useMountEffect/index.js';
import { isBrowser } from '../util/const.js';
const isDocumentVisible = () => document.visibilityState === 'visible';
/**
 * Returns a boolean indicating whether the document is visible or not.
 *
 * @param initializeWithValue Whether to initialize with the document visibility state or
 * `undefined`. _Set this to `false` during SSR._
 */
export function useDocumentVisibility(initializeWithValue = true) {
    const [isVisible, setIsVisible] = useState(isBrowser && initializeWithValue ? isDocumentVisible() : undefined);
    useMountEffect(() => {
        if (!initializeWithValue) {
            setIsVisible(isDocumentVisible());
        }
    });
    useEventListener(isBrowser ? document : null, 'visibilitychange', () => {
        setIsVisible(isDocumentVisible());
    });
    return isVisible;
}
