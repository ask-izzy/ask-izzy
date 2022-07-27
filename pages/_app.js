/* @flow */
// import colourStyles from "../src/styles/variables/colours.scss"
import React, {useEffect} from "react";
import type { Node as ReactNode } from "react"
import type { AppProps } from "next/app"
import { ApolloProvider } from "@apollo/client";
import Head from "next/head"
import { useRouter } from "next/router"
import type { NextRouter } from "next/router"

import "@/src/utils/global-setup"
import "../src/styles/bundle.scss"
import {DebugModeProvider} from "@/src/contexts/debug-mode-context";
import { getFullPageTitle } from "@/src/utils";
import "@/src/utils/page-loading"
import apolloClient from "@/src/utils/apolloClient";
import usePageViewAnalytics from "@/hooks/usePageViewAnalytics";
import useFocusOnHeader from "@/hooks/useFocusOnHeader";
import DebugColours from "@/src/components/DebugColours"
import {
    addPageLoadDependencies,
    closePageLoadDependencies,
} from "@/src/utils/page-loading"

import "@/src/analytics"

function App(appProps: AppProps): ReactNode {
    const { Component, pageProps } = appProps
    const router = useRouter()

    if (process.env.NODE_ENV === "test") {
        import("@/test/support/environment-setup")
    }

    useEffect(() => {
        router.events.on("routeChangeStart", url => {
            addPageLoadDependencies(url, "render")
        })

        router.events.on("routeChangeComplete", url => {
            closePageLoadDependencies(url, "render")
        })

        router.events.on("routeChangeError", url => {
            console.error("An error occurred when routing")
            closePageLoadDependencies(url, "render")
        })

        // Allow typography.com to record the hit for licencing
        // This causes a CORS error after the request is run,
        // which is not a problem as we don't need to do anything
        // with the response.
        fetch("https://cloud.typography.com/7948374/730248/css/fonts.css", {
            redirect: "manual",
        }).catch(() => {})
    }, [])

    const pageInfo = getPageInfo(appProps)

    usePageViewAnalytics(pageInfo)

    useFocusOnHeader()

    return (
        <ApolloProvider client={apolloClient}>
            <DebugModeProvider>
                {renderHeadMetadata(pageInfo, router)}
                <DebugColours />
                <div className="BasePage">
                    <Component {...pageProps} />
                </div>
            </DebugModeProvider>
        </ApolloProvider>
    )
}
export default App

export type PageInfo = {
    type: Array<string>,
    title: string
}

function getPageInfo({ Component, pageProps }: AppProps): PageInfo {
    const router = useRouter()
    const title = pageProps.pageTitle ?? Component.pageTitle ??
        (router.pathname === "/_error" ? "Server error" : undefined)
    const type = pageProps.pageType ?? Component.pageType ??
        (router.pathname === "/_error" ? ["500"] : undefined)
    if (title === undefined || type === undefined) {
        throw Error(`Route ${router.pathname} is missing shared props.`)
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
            <title>
                {getFullPageTitle(pageInfo.title, router, pageInfo.type)}
            </title>
        </Head>
    )
}