import { useMemo } from 'react';
import { useList } from '../useList/index.js';
import { useSyncedRef } from '../useSyncedRef/index.js';
/**
 * A state hook implementing FIFO queue.
 *
 * @param initialValue The initial value. Defaults to an empty array.
 */
export function useQueue(initialValue = []) {
    const [list, { removeAt, push }] = useList(initialValue);
    const listRef = useSyncedRef(list);
    return useMemo(() => ({
        add(value) {
            push(value);
        },
        remove() {
            const value = listRef.current[0];
            removeAt(0);
            return value;
        },
        get first() {
            return listRef.current.at(0);
        },
        get last() {
            return listRef.current.at(-1);
        },
        get size() {
            return listRef.current.length;
        },
        get items() {
            return listRef.current;
        },
    }), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
}
