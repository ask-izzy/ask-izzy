/* @flow */
export function regexEscape(stringToEscape: string) {
    return stringToEscape.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
