/* @flow */
import React from "react"
import type {Node as ReactNode, AbstractComponent} from "react"

import Link from "./base/Link"

type Props = {
    children: ReactNode,
    paragraphWrapperElement?: string | AbstractComponent<{}, mixed>
}

function FormatText({children, paragraphWrapperElement: ParagraphWrapper = "p"}: Props): ReactNode {
    // We match any url that starts with "http(s)://" or "www." and we ignore any full stops at the end
    // eslint-disable-next-line  max-len
    const urlRegex = /((?:https?:\/\/|www\.)[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*[-a-zA-Z0-9()@:%_+~#?&//=])?)/gi
    const singleNewLineRegex = /((?:\r\n|\n|\r))/
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
