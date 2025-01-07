function initState(initialState) {
    if (typeof initialState === 'function') {
        initialState = initialState();
    }
    return initialState;
}
function updateState(nextState, previousState) {
    if (typeof nextState === 'function') {
        return nextState(previousState);
    }
    return nextState;
}
export function resolveHookState(...args) {
    if (args.length === 1) {
        return initState(args[0]);
    }
    return updateState(args[0], args[1]);
}
