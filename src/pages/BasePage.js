/* @flow */

import React from "react";
import Helmet from "react-helmet";
import { makeTitle } from "../routes";
import { Route } from "react-router";
import history from "../utils/history";

import { ApolloProvider } from "react-apollo";
import client from "../utils/apolloClient";

type Props = {
    children: any,
    routes: any,
    params: any,
    location: any,
    computedMatch: any,
    title: string,
}

class BasePage extends Route<Props, {}> {
    static childContextTypes = {};

    getChildContext(): Object {
        return {};
    }

    render() {
        let match = this.props.match || this.props.computedMatch
        const canonicalUrl = `https://askizzy.org.au${this.props.location.pathname}`;
        let Component = this.props.component;

        return (
            <ApolloProvider client={client}>
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
                        <title>
                            {
                                makeTitle(
                                    this.props.title,
                                    match.params
                                )
                            }
                        </title>
                    </Helmet>

                    <main>
                        <Component
                            {...this.props}
                            match={match}
                            history={history}
                        />
                    </main>
                </div>
            </ApolloProvider>
        );
    }
}

export default BasePage
