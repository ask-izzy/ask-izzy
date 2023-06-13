
import type { GetStaticProps } from "next"

import ResultsMapPage from "@/components/pages/ResultsMapPage.js";
export {getStaticPaths} from "@/pages/[categoryOrContentPageSlug]/personalise/index"
import type {RouteSharedProps} from "@/types/routes.js"

export const getStaticProps: GetStaticProps<RouteSharedProps> = (context) => {
    return {
        props: {
            pageTitle: "Results map",
            pageType: [
                context.params?.categoryOrContentPageSlug === "search" ?
                    "Search"
                    : "Category",
                "Results Map",
            ],
        },
    }
}

export default ResultsMapPage