/* @flow */
import type { GetStaticProps } from "next"

import PersonalisationSummaryPage from
"@/components/pages/personalisation/PersonalisationSummaryPage";
import type {RouteSharedProps} from "@/flow/routes"

export {getStaticPaths} from
    "@/pages/[categoryOrContentPageSlug]/personalise/index.js"

export const getStaticProps: GetStaticProps<RouteSharedProps> = (context) => {
    return {
        props: {
            pageTitle: "Edit questions",
            pageType: [
                context.params.categoryOrContentPageSlug === "search" ?
                    "Search"
                    : "Category",
                "Edit List Personalisation",
            ],
        },
    };
}

export default PersonalisationSummaryPage