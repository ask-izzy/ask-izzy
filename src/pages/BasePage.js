/* @flow */

import React from "react";
import Helmet from "react-helmet";
import DocumentTitle from "react-document-title";
import { makeTitle } from "../routes";
import { withRouter } from "react-router";

type Props = {
    children: any,
    routes: any,
    params: any,
    location: any,
    match: any,
}

class BasePage extends React.Component<Props, void> {
    static childContextTypes = {};

    getChildContext(): Object {
        return {};
    }

    render() {

        const canonicalUrl = `https://askizzy.org.au${this.props.location.pathname}`;

        return (
            <div className="BasePage">

                <Helmet>
                    <link
                        rel="canonical"
                        content={canonicalUrl}
                    />
                    <meta
                        property="og:url"
                        content={canonicalUrl}
                    />
                </Helmet>

                <DocumentTitle
                    title={makeTitle(
                        this.props.routes,
                        this.props.match.params
                    )}
                />
                <main>
                    {this.props.children}
                </main>
            </div>
        );
    }
}

export default withRouter(BasePage)
