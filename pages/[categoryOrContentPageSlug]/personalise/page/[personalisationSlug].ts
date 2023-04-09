import type { GetStaticPaths, GetStaticProps } from "next"

import categories from "@/src/constants/categories.js"
import RenderPersonalisationPage from "@/components/pages/personalisation/RenderPersonalisationPage.js";
import type {RouteSharedProps} from "@/types/routes.js"


export const getStaticPaths: GetStaticPaths = async() => {
    const categoryPaths: Array<{ params: {
        categoryOrContentPageSlug: string,
        personalisationSlug: string,
    }}> = []
    for (const category of categories) {
        for (const personalisation of category.personalisation) {
            categoryPaths.push({
                params: {
                    categoryOrContentPageSlug: category.key,
                    personalisationSlug: personalisation.name,
                },
            })
        }
    }

    return {
        paths: categoryPaths,
        fallback: false,
    }
}

export const getStaticProps: GetStaticProps<RouteSharedProps> = ({params}) => {
    return {
        props: {
            pageTitle: "Edit questions",
            pageType: [
                params?.categoryOrContentPageSlug === "search" ?
                    "Search"
                    : "Category",
                "List Personalisation",
            ],
        },
    };
};

export default RenderPersonalisationPage