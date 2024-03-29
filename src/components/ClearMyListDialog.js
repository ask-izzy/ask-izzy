/* @flow */
import * as React from "react";

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
    return <div>
        <Dialog
            open={true}
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
                            <Button className="cancel-button"
                                onClick={onCloseRequested}
                            >
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
