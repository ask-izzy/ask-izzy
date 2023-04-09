import type { GetStaticProps } from "next"

export { default } from "@/components/pages/MyListPage.js"
import type {RouteSharedProps} from "@/types/routes.js"


export const getStaticProps: GetStaticProps<RouteSharedProps> = () => {
    return {
        props: {
            pageTitle: "My List",
            pageType: ["Service List"],
        },
    }
}
