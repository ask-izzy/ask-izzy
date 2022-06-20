/* @flow */
import * as React from "react";
import type { GetStaticProps } from "next"

import ShareServices from "@/components/ShareServices"
import type {RouteSharedProps} from "@/flow/routes"

export const getStaticProps: GetStaticProps<RouteSharedProps> = async({params}) => {
    return {
        props: {
            pageTitle: "Share Services Page",
            pageType: [
                "Share Services Test Page",
            ],
        },
    }
}

export default function ShareServicesPage(props: RouteSharedProps): React.Node {
    return <ShareServices />
}
