import type {GetStaticProps} from "next"

import type {RouteSharedProps} from "@/flow/routes"

export const getStaticProps: GetStaticProps<RouteSharedProps> = () => {
    return {
        props: {
            pageTitle: "404",
            pageType: ["404"],
        },
    }
}

export { default } from "@/components/pages/NotFoundStaticPage"