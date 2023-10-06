/* @flow */

import * as React from "react";
import type {Node as ReactNode} from "React";

import StaticPage from "@/components/pages/StaticPage";
import Accordion from "@/src/components/Accordion";
import StrapiMarkdown from "@/src/components/StrapiMarkdown";
import CalloutBox from "@/src/components/CalloutBox";
import type {CmsCalloutBoxFragmentType} from "@/queries/content/callout";
import type {CmsPage} from "@/queries/content/page";
import BlockQuote from "@/src/components/base/BlockQuote";

type ReactMarkdownQuoteProps = {
    children: React.Node,
}
type Props = {|
    pageDetails: CmsPage,
    embeddedCallouts: Array<CmsCalloutBoxFragmentType>
|}

function DynamicPage({pageDetails, embeddedCallouts}: Props): ReactNode {
    /**
     * This is used to render any embedded callouts that are written as
     * > [callout(code)] - where it uses the blockquote tag
     * @param props - Thr Markdown props of a blockquote
     * @returns {JSX.Element} - returns either a callout or blockqupte
     */
    const renderEmbCallout: (props: ReactMarkdownQuoteProps) => ReactNode =
        (props: ReactMarkdownQuoteProps) => {
            // Get the text content of the children
            const textContent = React.Children.map(props.children,
                paragraphElm => (
                    React.Children.map(paragraphElm.props.children,
                        textElm => textElm.type(textElm.props))
                )).join("")

            const [, calloutKey] = textContent.match(/\[callout\((.+)\)]/) || [];
            const callout = embeddedCallouts
                .find(callout => calloutKey && callout.attributes?.Key === calloutKey)
            if (callout) {
                return (
                    <CalloutBox calloutBoxes={[callout]} />
                )
            }
            return <BlockQuote>{props.children}</BlockQuote>
        }

    const calloutBoxesAtTop = (pageDetails.attributes?.CalloutBoxes || [])
        .filter(box => box.Top)
        // Flow.js filter doesn't recognise that we filter out any null values in the next step so we type cast
        .map(box => (((box.callout?.data): any): CmsCalloutBoxFragmentType))
        .filter(box => box)

    const calloutBoxesAtBottom: Array<CmsCalloutBoxFragmentType> = (pageDetails.attributes?.CalloutBoxes || [])
        .filter(box => box.Bottom)
        // Flow.js filter doesn't recognise that we filter out any null values in the next step so we type cast
        .map(box => (((box.callout?.data): any): CmsCalloutBoxFragmentType))
        .filter(box => box)

    return (
        <StaticPage
            title={pageDetails.attributes?.Title || ""}
            bannerName={pageDetails.attributes?.Banner?.data?.attributes?.Key || "hand-and-person-with-heart"}
            bannerPrimary={pageDetails.attributes?.BannerTextPrimary}
            bannerSecondary={pageDetails.attributes?.BannerTextSecondary}
        >
            <div className="DynamicPage">
                <CalloutBox calloutBoxes={calloutBoxesAtTop} />
                <StrapiMarkdown
                    renderers={{
                        "blockquote": renderEmbCallout,
                    }}
                >
                    {pageDetails.attributes?.Body || ""}
                </StrapiMarkdown>
                <Accordion
                    title={pageDetails.attributes?.AccordionTitle || ""}
                    items={pageDetails.attributes?.Accordion || []}
                />
                <CalloutBox calloutBoxes={calloutBoxesAtBottom} />
            </div>
        </StaticPage>
    )
}

export default DynamicPage
