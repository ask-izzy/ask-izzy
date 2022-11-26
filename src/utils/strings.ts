export function regexEscape(stringToEscape: string): string {
    return stringToEscape.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// Taken from https://stackoverflow.com/a/52551910/847536
export function toCamelCase(str: string): string {
    return str.toLowerCase().replace(
        /[^a-zA-Z0-9]+(.)/g,
        (match, capture1) => capture1.toUpperCase(),
    );
}
