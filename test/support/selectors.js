/* @flow */

"use strict";

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
    return `//${element}` +
        `[normalize-space(.//text()) = normalize-space('${text}')]`;
}
