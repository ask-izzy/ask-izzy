/* @flow */
import React from "react";
import type {Node as ReactNode} from "react"

import Link from "./base/Link";

type Props = {
    children: string
}

export default function UrlsToLink({children}: Props): ReactNode {
    // We match any url that starts with "http(s)://" or "www." and we ignore any full stops at the end
    // eslint-disable-next-line  max-len
    const urlRegex = /(?:(https?:\/\/)|www\.)[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*[-a-zA-Z0-9()@:%_+~#?&//=])?/gi

    function findLinks() {
        const modifiedChildrenString = children.replace(
            urlRegex,
            (url, protocol) =>
                `<a><url>${url}<a>`
        )
        const childrenArray = modifiedChildrenString.split(
            "<a>"
        )
        return childrenArray
    }
    return (
        <p>
            {findLinks().map(string => {
                if (string.includes("<url>")) {
                    const url = string.replace("<url>", "");
                    return (<Link to={url}>{url}</Link>)
                }
                return (<span>{string}</span>)
            })}
        </p>
    );
}
