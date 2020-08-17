/* @flow */

import React from "react";
import PropTypes from "proptypes";
import ReactMarkdown from "react-markdown";
import DocumentTitle from "react-document-title";

import icons from "../icons";
import Query from "../queries/query";
import StaticPage from "./StaticPage";
import pageQuery from "../queries/content/page.js";
import NotFoundStaticPage from "./NotFoundStaticPage";

type Props = {
    location: any,
}

class DynamicPage extends React.Component<Props, void> {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

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
                <icons.Loading className="big" />
            </StaticPage>
        )

        const error = (
            <StaticPage
                title="Error"
                bannerName="static"
            >
                <p className="errorMessage">
                    Error retrieving content.  Please try again.
                </p>
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
                        const page = res.data.pages.pop();

                        return (
                            <StaticPage
                                title={page.Title}
                                bannerName={page.Banner}
                            >

                                <DocumentTitle
                                    title={
                                        page.Title + " | Ask Izzy"
                                    }
                                />

                                <div className="DynamicPage">
                                    <ReactMarkdown
                                        source={page.Body}
                                        transformImageUri={
                                            this.absoluteImageUrl
                                        }
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
