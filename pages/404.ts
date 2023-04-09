import type {GetStaticProps} from "next"

import type {RouteSharedProps} from "@/types/routes.js"


export const getStaticProps: GetStaticProps<RouteSharedProps> = () => {
    return {
        props: {
            pageTitle: "404",
            pageType: ["404"],
        },
    }
}

export { default } from "@/components/pages/NotFoundStaticPage"