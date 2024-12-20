/* @flow */
import * as React from "react";
import type { GetStaticPaths, GetStaticProps } from "next"
import {promises as fs} from "fs"

import cmsPageQuery from "@/queries/content/page"
import cmsAllPagesQuery from "@/queries/content/allPages"
import cmsCalloutQuery from "@/queries/content/callout";
import categories, { getCategory } from "@/src/constants/categories"
import ResultsListPage from "@/components/pages/ResultsListPage"
import DynamicPage from "@/components/pages/DynamicPage.js"
import type {RouteSharedProps} from "@/flow/routes"
import {queryGraphQlWithErrorLogging} from "@/src/utils/apolloClient";
import type {CalloutType} from "@/src/components/CalloutBox"
import NotFoundStaticPage from "@/components/pages/NotFoundStaticPage"

type Props = {
    ...RouteSharedProps,
    categoryKey?: string,
    contentPage?: Object, // Apollo doesn't generate types from the specified
        // query. After we move to typescript we should setup graphql-codegen
        // but it's okay to use Object for now since graphql is strictly typed
        // and will throw an error if the returned data doesn't fit the schema.
    embeddedCallouts?: Array<CalloutType>,
}

export const getStaticPaths: GetStaticPaths = async() => {
    // Load static pages to make sure the paths don't clash the the paths of
    // pages in the CMS or categories.
    const topLevelStaticPages = await fs.readdir("./pages")
    const staticPaths = topLevelStaticPages
        .map(filename => filename.match(/([A-Za-z0-9_-]+)(?:.js)?/)?.[1])
        .filter(pathSegment => pathSegment)

    const categoryPaths = categories
        .filter(category => !staticPaths.includes(category.key))
        .map(category => ({
            params: { categoryOrContentPageSlug: category.key},
        }))

    const contentPages = await queryGraphQlWithErrorLogging({
        query: cmsAllPagesQuery,
        fetchPolicy: "no-cache",
    }).then(res => res.data.pages)


    const contentPagePaths = contentPages
        .map(page => page.Path.replace(/^\//, ""))
        .filter(slug => {
            if (staticPaths.includes(slug)) {
                console.warn(
                    `The CMS contains a page with the same path as a static ` +
                    `page (${slug}). Ignore it.`
                )
                return false
            }
            return true
        })
        .map(slug => ({
            params: {categoryOrContentPageSlug: slug},
        }))

    return {
        paths: [
            ...categoryPaths,
            ...contentPagePaths,
        ],
        fallback: "blocking",
    }
}

export const getStaticProps: GetStaticProps<Props> = async({params}) => {
    const category = getCategory(params.categoryOrContentPageSlug)
    if (category) {
        return {
            props: {
                pageTitle: "Results list",
                categoryKey: category.key,
                pageType: [
                    category.key === "search" ? "Search" : "Category",
                    "Results List",
                ],
            },
        }
    }

    try {
        const contentPage = await queryGraphQlWithErrorLogging({
            query: cmsPageQuery,
            fetchPolicy: "no-cache",
            variables: {
                path: `/${params.categoryOrContentPageSlug}`,
            },
        }).then(res => res.data.pages[0])

        if (!contentPage) {
            console.error(
                `"${params.categoryOrContentPageSlug}" is neither a category ` +
                    `or a content page`
            )
            return {
                props: {},
                notFound: true,
                revalidate: 10,
            }
        }

        const embeddedCalloutSlugs = [
            ...(contentPage.Body || "")
                .matchAll(/>\s+\[callout\(([^)]+)\)\]\s*(?:\n|$)/g),
        ].map(matchResult => matchResult[1])

        let embeddedCallouts = []
        if (embeddedCalloutSlugs.length) {
            const { data } = await queryGraphQlWithErrorLogging({
                query: cmsCalloutQuery,
                fetchPolicy: "no-cache",
                variables: {
                    keys: embeddedCalloutSlugs,
                },
            })

            embeddedCallouts = data.callouts
        }

        return {
            props: {
                contentPage,
                embeddedCallouts,
                pageTitle: contentPage.Title,
                pageType: [
                    "Static Page",
                    contentPage.Title,
                ],
            },
            revalidate: 10,
        }
    } catch (error) {
        if (error.graphQLErrors?.length) {
            console.error(error.graphQLErrors)
        }
        if (error.networkError) {
            console.error(error.networkError.message)
            console.error(error.networkError.result)
        }
        console.info("Request params:", params)
        console.error(
            "Error when getting props for category/content page: " + error.message
        )
        return {
            notFound: true,
            revalidate: 10,
        };
    }
}

export default function CategoryOrContentPage(props: Props): React.Node {
    const category = getCategory(props.categoryKey || "")
    if (category) {
        return (
            <ResultsListPage
                category={category}
            />
        )
    }

    if (props.contentPage) {
        return (
            <DynamicPage
                pageDetails={props.contentPage}
                embeddedCallouts={props.embeddedCallouts || []}
            />
        )
    }
    return <NotFoundStaticPage />
}
