import * as React from "react"
import type { GetStaticProps } from "next"

import DisabilityAdvocacyFinderInfoPage from "@/components/pages/DisabilityAdvocacyFinder"
import type {RouteSharedProps} from "@/types/routes"
import { useRouter } from "next/router"
import ResultsListPage from "@/components/pages/ResultsListPage"
import { getCategory } from "@/src/constants/categories"

export const getStaticProps: GetStaticProps<RouteSharedProps> = (context) => {
    return {
        props: {
            pageTitle: "Disability Advocacy Finder",
            pageType: ["Static Page", "Disability Advocacy Finder"],
        },
    }
}

export default function DisabilityAdvocacyFinderPage(): React.ReactNode {
    const router = useRouter()
    if ("helpSpecialisation" in router.query) {
        const category = getCategory("disability-advocacy-finder")
        return (
            <ResultsListPage
                category={category}
            />
        )
    }
    return <DisabilityAdvocacyFinderInfoPage />
}
