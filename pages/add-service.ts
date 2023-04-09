import type {GetStaticProps} from "next"

export { default } from "@/components/pages/AddServicePage.js"
import type {RouteSharedProps} from "@/types/routes.js"

export const getStaticProps: GetStaticProps<RouteSharedProps> = () => {
    return {
        props: {
            pageTitle: "Add a service",
            pageType: ["Static Page", "Add a Service"],
        },
    }
}