/* @flow */
export function regexEscape(stringToEscape: string): string {
    return stringToEscape.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
