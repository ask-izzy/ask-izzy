import type {GetStaticProps} from "next"

export {default} from "@/components/pages/BushfireSupportPage.js"
import type {RouteSharedProps} from "@/types/routes.js"


export const getStaticProps: GetStaticProps<RouteSharedProps> = () => {
    return {
        props: {
            pageTitle: "Bushfire Support",
            pageType: ["Static Page", "Bushfire Support"],
        },
    }
}