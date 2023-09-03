/* @flow */
import React from "react"
import type {Node as ReactNode, AbstractComponent} from "react"

import Link from "./base/Link"

type Props = {
    children: ReactNode,
    paragraphWrapperElement?: string | AbstractComponent<{}, mixed>
}

function FormatText({children, paragraphWrapperElement: ParagraphWrapper = "p"}: Props): ReactNode {
    /* We match any url that starts with "http(s)://" or "www." and we ignore any full stops at the end.

    Honestly I don't full know how this regex works. Why is there two "/" in the last two custom character
    classes? Why does the TLD allow parenthesise? (That appears to be valid in URIs but not URLs.) I have
    lots of questions. However this regex comes from the UrlsToLinks component when it was rewritten to
    the current FormatText component. And the UrlsToLinks component got it from Cleanskins
    (https://github.com/InfoxchangeTS/cleanskin/commit/7f6a20202ea16cdd6c1c9fed0e20e495ab09f23b#diff-a3bf80c556a9b2c91b0574f4e3278d927ff63ea050dc2534c61c57b2ebf12183)
    which in turn got it from oneplace
    (https://github.com/InfoxchangeTS/oneplace/commit/9bcc051b1de692502b8f769658231dbf12fcc67c#diff-824f8bde41a2083a0ffe37bd13b2ff1451b2a1fea6245bb237dd2c4ebef0b53a)
    and I have no idea where oneplace got it from.
    Ideally I'd rewrite it to make a bit more sense and be easier to read but this has already been though
    testing and it appears to work so probably best leave it for now. If it gives us any trouble tho just
    rewrite.
    */
    // eslint-disable-next-line  max-len
    const urlRegex = /((?:https?:\/\/|www\.)[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*[-a-zA-Z0-9()@:%_+~#?&//=])?)/gi
    // Matches a unix or windows new-line
    const singleNewLineRegex = /((?:\r\n|\n|\r))/
    // This also appears to have some flaws as far as I can tell. Like there are a bunch of
    // special chars that are valid in parts of an email address like "+" chars that this
    // does not match. But we're not validating user submitted email addresses, just attempting
    // to detect email addresses in iss text descriptions and make them into handy links so not
    // the end of the world if this fails to catch some and since we haven't had any issues with
    // it yet probs best not to mess with something that is working at the mo.
    const emailRegex = /([a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*)/g

    children = ensureReactNodeIsAnArray(children)
    children = children
        // Firstly break string in paragraphs by splitting along the boundary of multiple sequential newlines
        .flatMap(
            child => typeof child === "string" ?
                child.split(/(?:\r\n|\n|\r){2,}/)
                : child
        )
        // For each paragraph replace certain parts
        .map((child, i) => matchAndReplaceWithElement(
            child,
            urlRegex,
            (url, index) => (
                <Link
                    to={url.match(/^https?:\/\//i) ? url : "https://" + url}
                    key={`${i} ${index}`}
                >
                    {url.replace(/^https?:\/\//, "")}
                </Link>
            )
        ))
        .map((child, i) => matchAndReplaceWithElement(
            child,
            emailRegex,
            (email, index) => (
                <Link
                    to={"mailto:" + email}
                    key={`${i} ${index}`}
                >
                    {email}
                </Link>
            )
        ))
        .map((child, i) => matchAndReplaceWithElement(
            child,
            singleNewLineRegex,
            (url, index) => <br key={`${i} ${index}`} />
        ))
        // Wrap paragraphs in paragraph tag
        .map((child, i) => <ParagraphWrapper key={i}>{child}</ParagraphWrapper>)

    // Note that regexMatcher must include a capture group around the whole matched output to ensure .split()
    // retains the matched text
    function matchAndReplaceWithElement(
        children: ReactNode,
        regexMatcher: RegExp,
        replacer: (matchingText: string, index: number) => ReactNode
    ) {
        children = ensureReactNodeIsAnArray(children)
        return children
            .flatMap(textOrElement => (typeof textOrElement === "string") ?
                textOrElement.split(regexMatcher)
                : textOrElement
            )
            .map((textOrElement, i) => (typeof textOrElement === "string" && textOrElement.match(regexMatcher)) ?
                replacer(textOrElement, i)
                : textOrElement
            )
    }

    // Rather than a mix of single children by themselves and multiple inside of an array, normalise them by
    // making children are always inside an array.
    function ensureReactNodeIsAnArray(value: ReactNode): Array<ReactNode> {
        return Array.isArray(value) ? value : [value]
    }

    return children
}

export default FormatText
