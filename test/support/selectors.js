
export function within(parent) {
    return function(child) {
        return `${parent}//${child}`;
    };
}
