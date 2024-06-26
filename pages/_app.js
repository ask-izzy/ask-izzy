/* @flow */
import React, {useEffect} from "react";
import type { Node as ReactNode } from "react"
import type { AppProps } from "next/app"
import { ApolloProvider } from "@apollo/client";
import Head from "next/head"
import { useRouter } from "next/router"
import type { NextRouter } from "next/router"
import "core-js/actual/string/replace-all";
import * as Sentry from "@sentry/nextjs";

import "@/src/utils/global-setup"
import "../src/styles/bundle.scss"
import {DebugModeProvider} from "@/contexts/debug-mode-context";
import {MyListProvider} from "@/contexts/my-list-context";
import {ServiceResultsProvider} from "@/contexts/service-results-context";
import {ToastMessageProvider} from "@/contexts/toast-message-context";
import ToastMessage from "@/src/components/ToastMessage"
import { getFullPageTitle } from "@/src/utils";
import apolloClient from "@/src/utils/apolloClient";
import usePageViewAnalytics from "@/hooks/usePageViewAnalytics";
import useFocusOnHeader from "@/hooks/useFocusOnHeader";
import DebugColours from "@/src/components/DebugColours"
import DebugModeOffSwitch from "@/src/components/debug/DebugModeOffSwitch"
import "@/src/analytics"
import * as gtm from "@/src/google-tag-manager";
import storage from "@/src/storage";
import useTrackInitialRenderStatus from "@/hooks/useTrackInitialRenderStatus";

function App(appProps: AppProps): ReactNode {
    const { Component, pageProps, err } = appProps
    const router = useRouter()

    useTrackInitialRenderStatus()

    useEffect(() => {
        router.events.on("routeChangeError", (error, url) => {
            if (!error.cancelled) {
                Sentry.captureException(
                    error,
                    {
                        extra: {url},
                    }
                )
            }
        })

        const myListLength = Object.keys(
            storage.getJSON("my-list-services") || {}
        ).length
        gtm.emit({
            event: "State Changed - List Size On First Page Load",
            eventCat: "State changed",
            eventAction: "List size on first page load",
            eventLabel: null,
            eventValue: myListLength,
            sendDirectlyToGA: true,
        });
    }, [])

    const pageInfo = getPageInfo(appProps)

    usePageViewAnalytics(pageInfo)

    useFocusOnHeader()

    return (
        <ApolloProvider client={apolloClient}>
            <DebugModeProvider>
                <ServiceResultsProvider>
                    <ToastMessageProvider>
                        <MyListProvider>
                            {renderHeadMetadata(pageInfo, router)}
                            <DebugColours />
                            <DebugModeOffSwitch />
                            <div className="BasePage">
                                {/* err prop recommended by https://github.com/vercel/next.js/blob/dba9e2a12adeb2066d0d5bb9a49bdb3e29689b92/examples/with-sentry/pages/_app.js */}
                                <Component
                                    {...pageProps}
                                    err={err}
                                />
                            </div>
                            <ToastMessage/>
                        </MyListProvider>
                    </ToastMessageProvider>
                </ServiceResultsProvider>
            </DebugModeProvider>
        </ApolloProvider>
    )
}
export default App

export type PageInfo = {
    type: Array<string>,
    title: string | null
}

// This is a bit of a hack to allow us to continue defining
// route info in the page files used by the file-based-routing system. But
// at some point we should find a cleaner way of doing this.
function getPageInfo({ Component, pageProps }: AppProps): PageInfo {
    const router = useRouter()
    const title = pageProps.pageTitle ?? Component.pageTitle
    const type = pageProps.pageType ?? Component.pageType
    if (title === undefined || type === undefined) {
        Sentry.captureException(
            new Error(`Route ${router.pathname} is missing shared props.`),
            {
                extra: {Component, pageProps},
            }
        )
        return {
            title: null,
            type: ["Unknown"],
        }
    }
    return {title, type}
}


function renderHeadMetadata(pageInfo: any, router: NextRouter): ReactNode {
    const canonicalUrl = `https://askizzy.org.au${router.asPath}`;
    const siteName = "Ask Izzy"
    const description = `Ask Izzy is a mobile website that connects` +
        ` people who are in crisis with the services` +
        ` they need right now and nearby.`
    const ogTitle = `Ask Izzy: Find the help you need, now and nearby`
    const ogDescription = `Ask Izzy is a mobile website that connects ` +
        `people in need with housing, a meal, money ` +
        `help, health and wellbeing services, family ` +
        `violence support, counselling and much more.`

    return (
        <Head>
            <meta charSet="UTF-8" />
            <meta
                httpEquiv="X-UA-Compatible"
                content="IE=edge"
            />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <link
                rel="canonical"
                content={canonicalUrl}
            />
            <meta
                property="og:url"
                content={canonicalUrl}
            />
            <meta
                name="description"
                content={description}
            />
            <meta
                property="og:type"
                content="website"
            />
            <meta
                property="og:site_name"
                content={siteName}
            />
            <meta
                property="og:title"
                content={ogTitle}
            />
            <meta
                property="og:description"
                content={ogDescription}
            />
            <meta
                property="og:image"
                content="https://askizzy.org.au/images/askizzy-metatag.jpg"
            />
            <link
                rel="apple-touch-icon"
                sizes="57x57"
                href="/favicons/apple-touch-icon-57x57.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="60x60"
                href="/favicons/apple-touch-icon-60x60.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="72x72"
                href="/favicons/apple-touch-icon-72x72.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="76x76"
                href="/favicons/apple-touch-icon-76x76.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="114x114"
                href="/favicons/apple-touch-icon-114x114.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="120x120"
                href="/favicons/apple-touch-icon-120x120.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="144x144"
                href="/favicons/apple-touch-icon-144x144.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="152x152"
                href="/favicons/apple-touch-icon-152x152.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/favicons/apple-touch-icon-180x180.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="114x114"
                href="/favicons/apple-touch-icon-114x114.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="120x120"
                href="/favicons/apple-touch-icon-120x120.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="144x144"
                href="/favicons/apple-touch-icon-144x144.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="152x152"
                href="/favicons/apple-touch-icon-152x152.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/favicons/apple-touch-icon-180x180.png"
            />
            <link
                rel="icon"
                type="image/png"
                href="/favicons/favicon-32x32.png"
                sizes="32x32"
            />
            <link
                rel="icon"
                type="image/png"
                href="/favicons/favicon-96x96.png"
                sizes="96x96"
            />
            <link
                rel="icon"
                type="image/png"
                href="/favicons/favicon-16x16.png"
                sizes="16x16"
            />
            <link
                rel="icon"
                type="image/png"
                href="/favicons/android-chrome-192x192.png"
                sizes="192x192"
            />
            <link
                rel="icon"
                type="image/png"
                href="/favicons/android-chrome-192x192.png"
                sizes="192x192"
            />
            <link
                rel="manifest"
                href="/favicons/manifest.json"
            />
            <link
                rel="shortcut icon"
                href="/favicons/favicon.ico"
            />
            <meta
                name="apple-mobile-web-app-capable"
                content="yes"
            />
            <meta
                name="apple-mobile-web-app-title"
                content="Ask Izzy"
            />
            <meta
                name="application-name"
                content="Ask Izzy"
            />
            <meta
                name="msapplication-TileColor"
                content="#da532c"
            />
            <meta
                name="msapplication-config"
                content="/favicons/browserconfig.xml"
            />
            <meta
                name="theme-color"
                content="#ffffff"
            />
            <meta
                name="msapplication-TileImage"
                content="/favicons/mstile-144x144.png"
            />
            <link rel="preload"
                href="/fonts/hoc/GothamRnd-Light_Web.woff2"
                as="font"
                type="font/woff2"
                crossOrigin="true"
            />
            <link rel="preload"
                href="/fonts/hoc/GothamRnd-Book_Web.woff2"
                as="font"
                type="font/woff2"
                crossOrigin="true"
            />
            <link rel="preload"
                href="/fonts/hoc/GothamRnd-Medium_Web.woff2"
                as="font"
                type="font/woff2"
                crossOrigin="true"
            />
            <link rel="preload"
                href="/fonts/hoc/GothamRnd-Bold_Web.woff2"
                as="font"
                type="font/woff2"
                crossOrigin="true"
            />
            <title>
                {getFullPageTitle(pageInfo.title, router, pageInfo.type)}
            </title>
        </Head>
    )
}
