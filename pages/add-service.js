/* @flow */
import type { GetStaticProps } from "next"

export { default } from "@/components/pages/AddServicePage"
import type {RouteSharedProps} from "@/flow/routes"

export const getStaticProps: GetStaticProps<RouteSharedProps> = (context) => {
    return {
        props: {
            pageTitle: "Add a service",
            pageType: ["Static Page", "Add a Service"],
        },
    }
}