import type { GetStaticProps } from "next"

export {default, getStaticPaths} from "@/pages/[categoryOrContentPageSlug]/personalise/page/[personalisationSlug]"
import type {RouteSharedProps} from "@/types/routes.js"

export const getStaticProps: GetStaticProps<RouteSharedProps> = (context) => {
    return {
        props: {
            pageTitle: context?.params?.categoryOrContentPageSlug as string,
            pageType: [
                context?.params?.categoryOrContentPageSlug === "search" ?
                    "Search"
                    : "Category",
                "Results Map Personalisation",
            ],
        },
    }
}