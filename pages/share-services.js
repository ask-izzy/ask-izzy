/* @flow */
import * as React from "react";
import {useState} from "react";
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
    const [open, setOpen] = useState(true)

    return <div>
        <button onClick={() => setOpen(true)}>Share</button>
        {open && <ShareServices onCloseRequested={() => setOpen(false)} />}
    </div>
}
