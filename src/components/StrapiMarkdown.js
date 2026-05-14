/* @flow */
import React from "react";
import type {Node as ReactNode} from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import Link from "./base/Link"
import BlockQuote from "./base/BlockQuote"
import Code from "./base/Code"
import Paragraph from "./base/Paragraph";

type Renderers = {[string]: Function}

type Props = {
    children: ReactNode,
    renderers?: Renderers
}

function StrapiMarkdown({
    children,
    renderers: additionalRenderers,
}: Props): ReactNode {
    function absoluteImageUrl(uri: string): string {
        // Strapi may return a relative image url, if so we need to make sure it points to the CMS
        if (!uri.startsWith("http")) {
            return String(new URL(uri, process.env.NEXT_PUBLIC_STRAPI_URL));
        }
        return uri;
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

export default StrapiMarkdown
