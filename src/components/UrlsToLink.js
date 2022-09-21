/* @flow */
import React from "react"
import type {Node as ReactNode} from "react"

import Link from "./base/Link"

type Props = {
    children: string
}

function UrlsToLink({children}: Props): ReactNode {
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
            /(\r\n|\n|\r|<a>)/gm
        )
        return childrenArray
    }
    return (
        <div>
            {findLinks().map((string, index) => {
                string = string.replace(/(\r\n|\n|\r)/gm, "<br />")
                if (string.includes("<url>")) {
                    let url = string.replace("<url>", "")
                    return (
                        <Link to={url.indexOf("https://") < 0 ? "https://" + url : url}>
                            {url}
                        </Link>
                    )
                }
                if (string.includes("<br />")) {
                    return (<br key={index}/>)
                }
                if (string.includes("<a>")) {
                    return null
                }
                return (string)
            })}
        </div>
    );
}

export default UrlsToLink
