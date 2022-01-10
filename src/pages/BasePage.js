/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import Helmet from "react-helmet";
import { makeTitle } from "../utils";
import { Outlet } from "react-router-dom";

import { ApolloProvider } from "@apollo/client";
import createApolloClient from "../utils/apolloClient";
import HistoryListener from "../effects/HistoryListener";
import DebugColours from "../components/DebugColours";
import {DebugModeProvider} from "../contexts/debug-mode-context";
import {
    addPageLoadDependencies,
    closePageLoadDependencies,
} from "../utils/page-loading"
import routerContext from "../contexts/router-context";

class BasePage extends React.Component<{}> {
    static contextType: any = routerContext;

    componentDidMount(): void {
        closePageLoadDependencies(this.context.router.location, "render")
    }

    componentDidUpdate(): void {
        closePageLoadDependencies(this.context.router.location, "render")
    }

    render(): ReactNode {
        const { location, match } = this.context.router
        addPageLoadDependencies(location, "render")
        let pageTitle = "";
        pageTitle = makeTitle(
            match.props.title || "",
            match.params,
            match.props.type
        )
        const canonicalUrl = `https://askizzy.org.au${location.pathname}`;
        return <>
            <HistoryListener />
            <ApolloProvider client={createApolloClient()}>
                <DebugModeProvider>
                    <DebugColours />
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
                            <title>{pageTitle}</title>
                        </Helmet>
                        <Outlet />
                    </div>
                </DebugModeProvider>
            </ApolloProvider>
        </>
    }
}

export default BasePage
