/* @flow */

/**
 * Escape an XPath string.
 *
 * XPath string literals cannot escape quotes. This workaround deals with that
 * see http://stackoverflow.com/a/13483496/4391298
 *
 * @param {string} str - string literal
 * @returns {string} XPath string literal expression
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
 * Return the deepest possible node that matches the predicate.
 *
 * @param {string} predicate - XPath predicate we're matching.
 * @returns {string} XPath query.
 */
export function deepestPossible(predicate: string): string {
    return `//*[${predicate} and not(./*[${predicate}])]`;
}

/**
 * Return any element with the given text.
 *
 * @param {string} element - Element type we're looking for.
 * @param {string} text - Text we're searching for.
 * @returns {string} XPath query.
 */
export function elementWithText(element: string, text: string): string {
    text = escapeXPathString(text);

    return `//${element}` +
        `[.//text()[normalize-space() = normalize-space(${text})]]`;
}

/**
 * Return any element with the given text.
 *
 * @param {string} element - Element type we're looking for.
 * @param {string} text - Text we're searching for.
 * @returns {string} XPath query.
 */
export function elementWithChildText(element: string, text: string): string {
    const child = `${element}//*`;

    return `${
        elementWithText(element, text)
    }|${
        elementWithText(child, text)
    }`;
}

export function matchClass(className: string): string {
    return `contains(concat(' ', normalize-space(@class), ' '), ` +
        `' ${className} ')`;
}
