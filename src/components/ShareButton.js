/* @flow */

import type {Node as ReactNode} from "react"
import React, {useState} from "react";
import Button from "./base/Button";
import Share from "../icons/Share"

import Service from "@/src/iss/Service"
import ShareServicesDialog from "@/components/ShareServicesDialog"

type Props = {
    services?: Array<Service>,
    hasTextDescription?: boolean,
}

function ShareButton({
    hasTextDescription = false,
    services = [],
}: Props): ReactNode {
    const textDescription = "Share"
    const [open, setOpen] = useState(false)

    return <>
        <Button
            className="ShareButton"
            onClick={() => setOpen(true)}
            analyticsEvent={{
                event: "Action Triggered - Share Services Opened",
                eventAction: "Share services opened",
                eventLabel: null,
            }}
        >
            <div className="main-container"
                aria-label="Share"
            >
                <Share/>
                {
                    hasTextDescription ?
                        <span className="text-description">{textDescription}</span>
                        : null
                }
            </div>
        </Button>
        {open &&
            <ShareServicesDialog
                onCloseRequested={() => setOpen(false)}
                services={services}
            />
        }
    </>
}

export default ShareButton
