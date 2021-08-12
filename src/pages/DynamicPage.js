/* @flow */

import * as React from "react";
import type {Node as ReactNode} from "React";
import Helmet from "react-helmet";

import { makeTitle } from "../utils";
import icons from "../icons";
import Query from "../queries/query";
import StaticPage from "./StaticPage";
import pageQuery from "../queries/content/page.js";
import NotFoundStaticPage from "./NotFoundStaticPage";
import routerContext from "../contexts/router-context";
import Accordion from "../components/Accordion";
import StrapiMarkdown from "../components/StrapiMarkdown";
import CalloutBox from "../components/CalloutBox";
import BlockQuote from "../components/base/BlockQuote";
import CalloutQuery from "../queries/content/callout";

type ReactMarkdownQuoteProps = {
    children: React.Node
}

class DynamicPage extends React.Component<{}> {
    static contextType: any = routerContext;


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

        const embeddedCallouts = textContent.match(/\[callout.(.*).]/);
        if (embeddedCallouts) {
            return (
                <Query
                    query={CalloutQuery}
                    errorComponent={
                        <div className="loadingStatus">
                            Could not load the callout {embeddedCallouts[1]}
                        </div>
                    }
                    args={{
                        key: embeddedCallouts[1],
                    }}
                >
                    {res => (
                        <CalloutBox
                            calloutBoxes={res.data.callouts.map(callout => ({
                                callout,
                            }))}
                            embedded={true}
                        />
                    )}
                </Query>
            )
        }
        return <BlockQuote>{props.children}</BlockQuote>
    }


    render(): ReactNode {
        const params = {
            "path": this.context.router.location.pathname,
        };

        const loading = (
            <StaticPage
                title="Loading"
                bannerName="homepage"
            >
                <div className="DynamicPage">
                    <div className="loadingStatus">
                        <icons.Loading className="big" />
                    </div>
                </div>
            </StaticPage>
        )

        const error = (
            <StaticPage
                title="Error"
                bannerName="homepage"
            >
                <div className="DynamicPage">
                    <div className="loadingStatus">
                        Error retrieving content.  Please try again.
                    </div>
                </div>
            </StaticPage>
        )

        return (

            <Query
                query={pageQuery}
                args={params}
                loadingComponent={loading}
                errorComponent={error}
            >
                {res => {
                    if (
                        res.data.pages !== undefined && res.data.pages.length
                    ) {
                        const page = res.data.pages[0];

                        return (
                            <StaticPage
                                title={page.Title}
                                bannerName={page.Banner ? page.Banner.Key
                                    : "homepage"}
                                bannerPrimary={page.BannerTextPrimary}
                                bannerSecondary={page.BannerTextSecondary}
                            >
                                <Helmet>
                                    <title>
                                        {makeTitle(
                                            page.Title,
                                            this.context.router.match.params,
                                            this.context.router.match.props.type
                                        )}
                                    </title>
                                </Helmet>

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
                        )
                    }
                    return (<NotFoundStaticPage />)
                }}
            </Query>
        );
    }

}

export default DynamicPage;
