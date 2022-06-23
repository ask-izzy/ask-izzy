/* @flow */
import type { GetStaticProps } from "next"

export { default } from "@/components/pages/MyListPage.js"
import type {RouteSharedProps} from "@/flow/routes"

export const getStaticProps: GetStaticProps<RouteSharedProps> = (context) => {
    return {
        props: {
            pageTitle: "My List",
            pageType: ["Service"],
        },
    }
}