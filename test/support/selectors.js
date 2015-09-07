
export function within(parent) {
    return function(child) {
        return `${parent}//${child}`;
    };
}

/**
 * deepestPossible:
 *
 * Return the deepest possible node that matches the predicate.
 */
export function deepestPossible(predicate) {
    return `//*[${predicate} and not(./*[${predicate}])]`;
}
