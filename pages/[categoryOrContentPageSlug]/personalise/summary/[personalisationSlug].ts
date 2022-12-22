import type { GetStaticProps } from "next"

export {default, getStaticPaths} from "@/pages/[categoryOrContentPageSlug]/personalise/page/[personalisationSlug]"
import type {RouteSharedProps} from "@/types/routes"


export const getStaticProps: GetStaticProps<RouteSharedProps> = () => {
    return {
        props: {
            pageTitle: "Edit questions",
            pageType: ["Static Page", "Edit Questions Personalisation"],
        },
    };
};