/* @flow */
import * as React from "react";
import {useState} from "react";
import type { GetStaticProps } from "next"

import ShareServices from "@/components/ShareServicesDialog"
import type {RouteSharedProps} from "@/flow/routes"
import {ixaService} from "@/fixtures/services";
import Dialog from "@/components/base/Dialog"
import Button from "@/src/components/base/Button"

type Props = {
    onCloseRequested: () => void,
    onClearMyList: () => void,
}

export default function ShareServicesPage({
    onCloseRequested,
    onClearMyList,
}: Props): React.Node {
    const [open, setOpen] = useState(true)

    return <div>
        <Dialog
            open={open}
            onClose={onCloseRequested}
        >
            {
                ({titleProps}) =>
                    <div className="ClearMyListDialog">
                        <header>
                            <div {...titleProps}>
                                Clear all services from My List?
                            </div>
                        </header>
                        <div className="ClearMyListOptions">
                            <Button className="cancel-button" onClick={onCloseRequested}>
                                Cancel
                            </Button>
                            <Button
                                className="clear-button"
                                onClick={onClearMyList}
                                analyticsEvent={{
                                    event: "Action Triggered - List Cleared",
                                    eventAction: "List cleared",
                                    eventLabel: null,
                                }}
                            >
                                Clear My List
                            </Button>
                        </div>
                    </div>
            }
        </Dialog>
    </div>
}
