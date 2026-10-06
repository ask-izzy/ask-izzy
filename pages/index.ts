import type { GetStaticProps } from "next"
import type { RouteSharedProps } from "@/types/routes"

export const getStaticProps: GetStaticProps<RouteSharedProps> = (context) => {
    return {
        props: {
            pageTitle: "",
            pageType: ["Home"],
        },
    }
}

export { default } from "@/components/pages/HomePage"