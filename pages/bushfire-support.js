/* @flow */
import type { GetStaticProps } from "next"

export { default } from "@/components/pages/BushfireSupportPage"
import type {RouteSharedProps} from "@/flow/routes"

export const getStaticProps: GetStaticProps<RouteSharedProps> = (context) => {
    return {
        props: {
            pageTitle: "Bushfire Support",
            pageType: ["Static Page", "Bushfire Support"],
        },
    }
}