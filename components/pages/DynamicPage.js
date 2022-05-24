/* @flow */

import * as React from "react";
import type {Node as ReactNode} from "React";

import StaticPage from "@/components/pages/StaticPage";
import Accordion from "@/src/components/Accordion";
import StrapiMarkdown from "@/src/components/StrapiMarkdown";
import CalloutBox from "@/src/components/CalloutBox";
import type {
    CalloutBoxType,
    CalloutType,
} from "@/src/components/CalloutBox";
import BlockQuote from "@/src/components/base/BlockQuote";

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
    children: React.Node,
}
type Props = {|
    pageDetails: PageDetails,
    embeddedCallouts: Array<CalloutType>
|}

class DynamicPage extends React.Component<Props> {
    /**
     * This is used to render any embedded callouts that are written as
     * > [callout(code)] - where it uses the blockquote tag
     * @param props - Thr Markdown props of a blockquote
     * @returns {JSX.Element} - returns either a callout or blockqupte
     */
    renderEmbCallout: (props: ReactMarkdownQuoteProps) => ReactNode =
    (props: ReactMarkdownQuoteProps) => {
        // Get the text content of the children
        const textContent = React.Children.map(props.children,
            paragraphElm => (
                React.Children.map(paragraphElm.props.children,
                    textElm => textElm.type(textElm.props))
            )).join("")

        const [, calloutKey] = textContent.match(/\[callout\((.+)\)]/) || [];
        const callout = this.props.embeddedCallouts
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


    render(): ReactNode {
        const page = this.props.pageDetails

        return (
            <StaticPage
                title={page.Title}
                bannerName={page.Banner ? page.Banner.Key
                    : "homepage"}
                bannerPrimary={page.BannerTextPrimary}
                bannerSecondary={page.BannerTextSecondary}
            >
                <div className="DynamicPage">
                    <CalloutBox
                        calloutBoxes={page.CalloutBoxes}
                        position="top"
                    />
                    <StrapiMarkdown
                        renderers={{
                            "blockquote": this.renderEmbCallout,
                        }}
                    >
                        {page.Body}
                    </StrapiMarkdown>
                    <Accordion
                        title={page.AccordionTitle}
                        items={page.Accordion}
                    />
                    <CalloutBox
                        calloutBoxes={page.CalloutBoxes}
                        position="bottom"
                    />
                </div>
            </StaticPage>
        );
    }

}

export default DynamicPage;
