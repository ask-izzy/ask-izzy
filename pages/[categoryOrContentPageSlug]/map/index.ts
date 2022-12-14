
import type { GetStaticProps } from "next"

import ResultsMapPage from "@/components/pages/ResultsMapPage";
export {getStaticPaths} from "@/pages/[categoryOrContentPageSlug]/personalise/index.js"
import type {RouteSharedProps} from "@/types/routes"

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