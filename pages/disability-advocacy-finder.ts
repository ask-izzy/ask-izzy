import type { GetStaticProps } from "next"

export { default } from "@/components/pages/DisabilityAdvocacyFinder"
import type {RouteSharedProps} from "@/types/routes"

export const getStaticProps: GetStaticProps<RouteSharedProps> = () => {
    return {
        props: {
            pageTitle: "Disability Advocacy Finder",
            pageType: ["Static Page", "Disability Advocacy Finder"],
        },
    }
}