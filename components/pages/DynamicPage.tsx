import React, {ReactNode} from "react";

import StaticPage from "@/components/pages/StaticPage.js";
import Accordion from "@/src/components/Accordion.js";
import StrapiMarkdown from "@/src/components/StrapiMarkdown.js";
import CalloutBox from "@/src/components/CalloutBox.js";
import type {
    CalloutBoxType,
    CalloutType,
} from "@/src/components/CalloutBox.js";
import BlockQuote from "@/src/components/base/BlockQuote.js";

type PageDetails = {
    id: number,
    created_at: string,
    updated_at: string,
    Title: string,
    Body: string,
    Path: string,
    BannerTextPrimary: string,
    BannerTextSecondary: string,
    Banner: {
        id: number,
        Key: string,
        created_at: string,
        updated_at: string,
    },
    Accordion: Array<{
        id: number,
        Title: string,
        Content: string,
    }>,
    AccordionTitle: string,
    CalloutBoxes: Array<CalloutBoxType>
  }
type ReactMarkdownQuoteProps = {
    children: ReactNode,
}
type Props = {
    pageDetails: PageDetails,
    embeddedCallouts: Array<CalloutType>
}

function DynamicPage({pageDetails, embeddedCallouts}: Props) {
    /**
     * This is used to render any embedded callouts that are written as
     * > [callout(code)] - where it uses the blockquote tag
     * @param props - Thr Markdown props of a blockquote
     * @returns {JSX.Element} - returns either a callout or blockqupte
     */
    const renderEmbCallout: (props: ReactMarkdownQuoteProps) => any =
        (props: ReactMarkdownQuoteProps) => {
            // Get the text content of the children
            const textContent = (React.Children.map(props.children,
                paragraphElm => (
                    React.Children.map((paragraphElm as any).props.children,
                        textElm => textElm.type(textElm.props))
                )) as any).join("")

            const [, calloutKey] = textContent.match(/\[callout\((.+)\)]/) || [];
            const callout = embeddedCallouts
                .find(callout => calloutKey && callout.Key === calloutKey)
            if (callout) {
                return (
                    <CalloutBox
                        calloutBoxes={[callout].map(callout => ({
                            callout,
                            Bottom: false,
                            Top: false,
                            created_at: "null",
                            id: 0,
                            updated_at: "null",
                        }))}
                        embedded={true}
                    />
                )
            }
            return <BlockQuote>{props.children}</BlockQuote>
        }

    return (
        <StaticPage
            title={pageDetails.Title}
            bannerName={pageDetails.Banner ? pageDetails.Banner.Key
                : "homepage"}
            bannerPrimary={pageDetails.BannerTextPrimary}
            bannerSecondary={pageDetails.BannerTextSecondary}
        >
            <div className="DynamicPage">
                <CalloutBox
                    calloutBoxes={pageDetails.CalloutBoxes}
                    position="top"
                />
                <StrapiMarkdown
                    renderers={{
                        "blockquote": renderEmbCallout,
                    }}
                >
                    {pageDetails.Body}
                </StrapiMarkdown>
                <Accordion
                    title={pageDetails.AccordionTitle}
                    items={pageDetails.Accordion}
                />
                <CalloutBox
                    calloutBoxes={pageDetails.CalloutBoxes}
                    position="bottom"
                />
            </div>
        </StaticPage>
    )
}

export default DynamicPage
