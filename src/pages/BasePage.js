/* @flow */

import React from "react";
import Helmet from "react-helmet";
import DocumentTitle from "react-document-title";
import { makeTitle } from "../routes";

export default class BasePage extends React.Component {
    props: {
        main: any,
        children: any,
        footer: any,
        routes: any,
        params: any,
    };
    state: void;

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
                        this.props.params
                    )}
                />
                <main>
                    {this.props.main || this.props.children}
                </main>
                {this.props.footer}
            </div>
        );
    }
}
