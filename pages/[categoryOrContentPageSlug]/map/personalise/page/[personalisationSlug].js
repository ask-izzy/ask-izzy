/* @flow */
import type { GetStaticProps } from "next"

export {default, getStaticPaths} from
    // eslint-disable-next-line max-len
    "@/pages/[categoryOrContentPageSlug]/personalise/page/[personalisationSlug].js"
import type {RouteSharedProps} from "@/flow/routes"

export const getStaticProps: GetStaticProps<RouteSharedProps> = (context) => {
    return {
        props: {
            pageTitle: context.params.categoryOrContentPageSlug,
            pageType: [
                context.params.categoryOrContentPageSlug === "search" ?
                    "Search"
                    : "Category",
                "Results Map Personalisation",
            ],
        },
    }
}