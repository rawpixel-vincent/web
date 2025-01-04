export function on(object, ...args) {
    object?.addEventListener?.(...args);
}
export function off(object, ...args) {
    object?.removeEventListener?.(...args);
}
export const hasOwnProperty = (object, property) => Object.hasOwn(object, property);
export const yieldTrue = () => true;
export const yieldFalse = () => false;
export const basicDepsComparator = (d1, d2) => {
    if (d1 === d2) {
        return true;
    }
    if (d1.length !== d2.length) {
        return false;
    }
    for (const [i, element] of d1.entries()) {
        if (element !== d2[i]) {
            return false;
        }
    }
    return true;
};
