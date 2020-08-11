/* @flow */

import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import { makeTitle } from "../routes";
import { Route, withRouter } from "react-router";
import { InjectRouterContext } from "../contexts/router-context"

import { ApolloProvider } from "react-apollo";
import client from "../utils/apolloClient";
import HistoryListener from "../components/effects/HistoryListener";

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
        // console.log('match', match, useHistory(), useLocation(), useParams())


        return (
            <InjectRouterContext matchedRoute={match}>
                <HistoryListener routeMatch={match} />
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
                            />
                        </main>
                    </div>
                </ApolloProvider>
            </InjectRouterContext>
        );
    }
}

export default BasePage
