/* @flow */

import type {Node as ReactNode} from "react"
import React from "react";
import Button from "./base/Button";
import Share from "../icons/Share"

type Props = {
    hasTextDescription?: boolean,
}

function ShareButton({
    hasTextDescription = false,
}: Props): ReactNode {
    const textDescription = "Share"

    return (
        <Button
            className="ShareButton"
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

    )
}

export default ShareButton
