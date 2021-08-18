/* @flow */
import React from "react";
import type {Node as ReactNode} from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import Link from "./Link"
import BlockQuote from "./base/BlockQuote"
import Code from "./base/Code"
import Paragraph from "./base/Paragraph";

type Renderers = {[string]: Function}

type Props = {
    children: ReactNode,
    renderers?: Renderers
}

export default function StrapiMarkdown({
    children,
    renderers: additionalRenderers,
}: Props): ReactNode {
    function absoluteImageUrl(uri: string): string {
        // Strapi returns a relative image url, we need to change
        // it to point to our content server.
        return window.STRAPI_URL + uri;
    }

    const renderers: Renderers = {
        link: ({href, children}) =>
            <Link
                to={href}
                children={children}
            />,
        paragraph: ({children, node}) =>
            <Paragraph
                children={children}
                node={node}
            />,
        blockquote: ({children}) =>
            <BlockQuote children={children} />,
        inlineCode: ({children}) =>
            <Code children={children} />,
    }

    return (
        <ReactMarkdown
            plugins={[gfm]}
            source={children}
            transformImageUri={absoluteImageUrl}
            renderers={{...renderers, ...additionalRenderers}}
        />
    )
}