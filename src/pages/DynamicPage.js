/* @flow */

import React from "react";
import PropTypes from "proptypes";
import ReactMarkdown from "react-markdown";

import Query from "../queries/query";
import StaticPage from "./StaticPage";
import pageQuery from "../queries/content/page.js";
import NotFoundStaticPage from "./NotFoundStaticPage";

class DynamicPage extends React.Component<{}, void> {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    render() {
        //console.log(this.props.routes[this.props.routes.length - 1].title)

        const params = {
            "slug": this.props.location.pathname,
        };

        return (

            <Query
                query={pageQuery}
                params={params}
            >
                {data => {
                    if (
                        data.data.pages !== undefined && data.data.pages.length
                    ) {
                        return (
                            <StaticPage
                                title={data.data.pages[0].Title}
                                bannerName={data.data.pages[0].Banner}
                            >
                                <ReactMarkdown
                                    source={data.data.pages[0].Body}
                                />
                            </StaticPage>
                        )
                    }
                    return (<NotFoundStaticPage />)
                }
                }
            </Query>

        );
    }
}

export default DynamicPage;
