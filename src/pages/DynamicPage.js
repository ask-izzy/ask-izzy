/* @flow */

import * as React from "react";
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
import {absoluteImageUrl, renderLink} from "./DynamicPage.service";
import CalloutBox from "../components/CalloutBox";
type Props = {
    location: any,
}

class DynamicPage extends React.Component<Props, void> {
    static contextType = routerContext;


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
                                    <CalloutBox
                                        calloutBoxes={page.CalloutBoxes}
                                        position="top"
                                    />
                                    <ReactMarkdown
                                        plugins={[gfm]}
                                        source={page.Body}
                                        transformImageUri={absoluteImageUrl}
                                        renderers={{ "link": renderLink }}
                                    />
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
