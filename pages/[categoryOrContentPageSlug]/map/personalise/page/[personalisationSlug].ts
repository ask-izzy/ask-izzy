import type { GetStaticProps } from "next"

export {default, getStaticPaths} from
    // eslint-disable-next-line max-len
    "@/pages/[categoryOrContentPageSlug]/personalise/page/[personalisationSlug]"
import type {RouteSharedProps} from "@/types/routes"

// @ts-expect-error TODO(ts-migration): Type '(context: GetStaticPropsContext<ParsedUrlQuery, PreviewData>) => { props:…
export const getStaticProps: GetStaticProps<RouteSharedProps> = (context) => {
    return {
        props: {
            pageTitle: context.params.categoryOrContentPageSlug,
            pageType: [
                context.params.categoryOrContentPageSlug === "search" ?
                    "Search"
                    : "Category",
                "Results Map Personalisation",
            ],
        },
    }
}