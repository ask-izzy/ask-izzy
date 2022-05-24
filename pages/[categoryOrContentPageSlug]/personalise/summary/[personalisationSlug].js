/* @flow */

import type { GetStaticProps } from "next"

export {default, getStaticPaths} from
    // eslint-disable-next-line max-len
    "@/pages/[categoryOrContentPageSlug]/personalise/page/[personalisationSlug].js"
import type {RouteSharedProps} from "@/flow/routes"


export const getStaticProps: GetStaticProps<RouteSharedProps> = ({params}) => {
    return {
        props: {
            pageTitle: "Edit questions",
            pageType: ["Static Page", "Edit Questions Personalisation"],
        },
    };
};