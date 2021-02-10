/* @flow */

import React from "react";
import ReactMarkdown from "react-markdown";
import Helmet from "react-helmet";
import { makeTitle } from "../routes";
import icons from "../icons";
import Query from "../queries/query";
import StaticPage from "./StaticPage";
import pageQuery from "../queries/content/page.js";
import NotFoundStaticPage from "./NotFoundStaticPage";
import routerContext from "../contexts/router-context";
import gfm from "remark-gfm";
import Accordion from "../components/Accordion";

type Props = {
    location: any,
}

class DynamicPage extends React.Component<Props, void> {
    static contextType = routerContext;

    absoluteImageUrl(uri: string): string {
        // Strapi returns a relative image url, we need to change
        // it to point to our content server.
        return window.STRAPI_URL + uri;
    }

    render() {

        const params = {
            "path": this.props.location.pathname,
        };

        const loading = (
            <StaticPage
                title="Loading"
                bannerName="static"
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
                bannerName="static"
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
                                bannerName={page.Banner ? page.Banner.Key : ""}
                                bannerPrimary={page.BannerTextPrimary}
                                bannerSecondary={page.BannerTextSecondary}
                            >

                                <Helmet>
                                    <title>
                                        {
                                            makeTitle(
                                                page.Title,
                                                this.context.router.match.params
                                            )
                                        }
                                    </title>
                                </Helmet>

                                <div className="DynamicPage">
                                    <ReactMarkdown
                                        plugins={[gfm]}
                                        source={page.Body}
                                        transformImageUri={
                                            this.absoluteImageUrl
                                        }
                                    />
                                    <Accordion
                                        title={page.AccordionTitle}
                                        items={page.Accordion}
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
