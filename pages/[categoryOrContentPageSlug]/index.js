/* @flow */
import * as React from "react";
import type { GetStaticPaths, GetStaticProps } from "next"
import {promises as fs} from "fs"

import cmsPageQuery from "@/src/queries/content/page"
import cmsAllPagesQuery from "@/src/queries/content/allPages"
import cmsCalloutQuery from "@/src/queries/content/callout";
import categories, { getCategory } from "@/src/constants/categories"
import ResultsListPage from "@/components/pages/ResultsListPage"
import DynamicPage from "@/components/pages/DynamicPage"
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
    const categoryPaths = categories.map(category => ({
        params: { categoryOrContentPageSlug: category.key},
    }))

    let contentPages

    try {
        const { data } = await queryGraphQlWithErrorLogging({
            query: cmsAllPagesQuery,
            fetchPolicy: "no-cache",
        })
        contentPages = data.pages
    } catch (error) {
        throw error
    }

    // Load static pages to make sure the paths don't clash the the paths of
    // pages in the CMS.
    const topLevelPages = await fs.readdir("./pages")
    const staticPaths = topLevelPages
        .map(filename => filename.match(/([A-Za-z0-9_-]+).js/)?.[1])
        .filter(pathSegment => pathSegment)

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
        const { data } = await queryGraphQlWithErrorLogging({
            query: cmsPageQuery,
            fetchPolicy: "no-cache",
            variables: {
                path: `/${params.categoryOrContentPageSlug}`,
            },
        })

        const contentPage = data.pages[0]

        if (contentPage) {
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
        } else {
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
