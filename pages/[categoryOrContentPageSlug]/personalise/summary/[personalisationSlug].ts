import type { GetStaticProps } from "next"

export {default, getStaticPaths} from "@/pages/[categoryOrContentPageSlug]/personalise/page/[personalisationSlug].js"
import type {RouteSharedProps} from "@/types/routes.js"


export const getStaticProps: GetStaticProps<RouteSharedProps> = () => {
    return {
        props: {
            pageTitle: "Edit questions",
            pageType: ["Static Page", "Edit Questions Personalisation"],
        },
    };
};