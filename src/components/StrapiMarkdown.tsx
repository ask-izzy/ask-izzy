/* eslint-disable react/display-name */
import React, {ReactElement} from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import Link from "@/src/components/base/Link.js"
import BlockQuote from "@/src/components/base/BlockQuote.js"
import Code from "@/src/components/base/Code.js"
import Paragraph from "@/src/components/base/Paragraph.js";

type Renderers = Record<string, (props: any) => ReactElement>;

type Props = {
    children: string,
    renderers?: Renderers
}

function StrapiMarkdown({
    children,
    renderers: additionalRenderers,
}: Props) {
    function absoluteImageUrl(uri: string): string {
        // Strapi returns a relative image url, we need to change
        // it to point to our content server.
        return process.env.NEXT_PUBLIC_STRAPI_URL + uri;
    }

    const renderers: Renderers = {
        link: ({href, children}) =>
            <Link
                to={href}
            >
                {children}
            </Link>,
        paragraph: ({children, node}) =>
            <Paragraph
                node={node}
            >
                {children}
            </Paragraph>,
        blockquote: ({children}) =>
            <BlockQuote>
                {children}
            </BlockQuote>,
        inlineCode: ({children}) =>
            <Code>
                {children}
            </Code>,
    }

    return (
        <ReactMarkdown
            plugins={[gfm]}
            transformImageUri={absoluteImageUrl}
            renderers={{...renderers, ...additionalRenderers}}
        >
            {children}
        </ReactMarkdown>
    )
}

export default StrapiMarkdown
