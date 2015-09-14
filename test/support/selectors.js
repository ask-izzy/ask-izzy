/* @flow */

"use strict";

/**
 * escapeXPathString:
 *
 * XPath string literals cannot escape quotes. This workaround deals with that
 * see http://stackoverflow.com/a/13483496/4391298
 */
export function escapeXPathString(str: string): string {
    str = str.replace(`'`, `', "'", '`);

    return `concat('${str}', '')`;
}

export function within(parent: string): Function {
    return function(child: string): string {
        return `${parent}//${child}`;
    };
}

/**
 * deepestPossible:
 *
 * Return the deepest possible node that matches the predicate.
 */
export function deepestPossible(predicate: string): string {
    return `//*[${predicate} and not(./*[${predicate}])]`;
}

/**
 * elementWithText:
 *
 * Return any element with the given text.
 */
export function elementWithText(element: string, text: string): string {
    text = escapeXPathString(text);

    return `//${element}` +
        `[normalize-space(.//text()) = normalize-space(${text})]`;
}
