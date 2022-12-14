/**
 * Escape an XPath string.
 *
 * XPath string literals cannot escape quotes. This workaround deals with that
 * see http://stackoverflow.com/a/13483496/4391298
 *
 * @param {string} stringToEscape - string literal
 * @returns {string} XPath string literal expression
 */
export function escapeXPathString(stringToEscape) {
    if (stringToEscape.match("'")) {
        return `concat('${stringToEscape.replace(`'`, `', "'", '`)}')`;
    }
    return `'${stringToEscape}'`
}

// Selects the predicate or if multiple nodes nested within each other match
// then select the deepest one.
export function deepestPossible(
    predicate,
    elementType = "*"
) {
    return `//${elementType}[
        ${predicate}
        and
        not(./${elementType}[${predicate}])
    ]`;
}

export function elementWithText(
    textToMatch,
    elementType = "*"
) {
    const escapedTextToMatch = escapeXPathString(textToMatch);

    // Either match nodes where it's string value (the text of all of it's
    // descendant nodes concatenated together) is equal to the text value
    // we're searching for or match any nodes which have a single direct
    // dependent text node which is equal to the text we're searching for.
    // And even if a node matches those conditions we ignore it if it has
    // a descendant node who also matches the same conditions since we want
    // to find the deepest possible match.
    //
    // For example text "foo bar" would...
    // match:
    //    <div>
    //        <span>foo</span>
    //        <span>bar</span>
    //    </div>
    //
    // match:
    //    <div>
    //        <span>other text</span>
    //        foo bar
    //    </div>
    //
    // not match:
    //    <div>
    //        foo
    //        <span>other text</span>
    //        bar
    //    </div>
    //
    // not match:
    //    <div>
    //        <span>foo bar</span>
    //    </div>
    // (but the <span> would match)
    return deepestPossible(`
        (normalize-space(.) = normalize-space(${escapedTextToMatch}))
        or
        (
            (normalize-space(text()) = normalize-space(${escapedTextToMatch}))
            and
            not(text()[2])
        )
    `, elementType)
}

export function elementWithTextSubstring(
    textToMatch,
    elementType = "*"
) {
    const escapedTextToMatch = escapeXPathString(textToMatch);

    return deepestPossible(
        `contains(normalize-space(.), normalize-space(${escapedTextToMatch}))`,
        elementType
    )
}

export function matchClass(className) {
    return `contains(concat(' ', normalize-space(@class), ' '), ` +
        `' ${className} ')`;
}
