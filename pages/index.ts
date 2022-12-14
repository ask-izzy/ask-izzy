import type { GetStaticProps } from "next"
import type { RouteSharedProps } from "@/flow/routes"

export const getStaticProps: GetStaticProps<RouteSharedProps> = () => {
    return {
        props: {
            pageTitle: "",
            pageType: ["Home"],
        },
    }
}

export { default } from "@/components/pages/HomePage"