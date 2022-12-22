// This route is no longer used and it kept to maintain compatibility
// in case someone bookmarked a link to this particular route or something.

import type { GetStaticPaths, GetStaticProps } from "next"

import categories from "@/src/constants/categories"
import PersonalisationRedirect from "@/components/pages/personalisation/PersonalisationRedirect";
import type {RouteSharedProps} from "@/types/routes"

export const getStaticPaths: GetStaticPaths = async() => {
    const categoryPaths: {params: {categoryOrContentPageSlug: string}}[] = []
    for (const category of categories) {
        categoryPaths.push({
            params: {
                categoryOrContentPageSlug: category.key,
            },
        })
    }

    return {
        paths: categoryPaths,
        fallback: false,
    }
}

export const getStaticProps: GetStaticProps<RouteSharedProps> = ({params}) => {
    return {
        props: {
            pageTitle: params?.categoryOrContentPageSlug as string,
            pageType: [
                params?.categoryOrContentPageSlug === "search" ?
                    "Search"
                    : "Category",
                "List Personalisation",
            ],
        },
    }
}

export default PersonalisationRedirect