/* @flow */
import type { GetStaticProps } from "next"

export { default } from "@/components/pages/DisabilityAdvocacyFinder"
import type {RouteSharedProps} from "@/flow/routes"

export const getStaticProps: GetStaticProps<RouteSharedProps> = (context) => {
    return {
        props: {
            pageTitle: "Disability Advocacy Finder",
            pageType: ["Static Page", "Disability Advocacy Finder"],
        },
    }
}