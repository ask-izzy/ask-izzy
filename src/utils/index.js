/* @flow */

// Taken from https://stackoverflow.com/a/52551910/847536
export function toCamelCase(str: string) {
    return str.toLowerCase().replace(
        /[^a-zA-Z0-9]+(.)/g,
        (match, chr) => chr.toUpperCase()
    );
}

export function wait(timeToWait: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, timeToWait))
}
