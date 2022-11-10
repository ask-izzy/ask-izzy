/* @flow */

import React from "react"
import type {Node as ReactNode} from "react"

import Service from "../iss/Service"
import Spacer from "./Spacer"
import UrlsToLinks from "./UrlsToLink"

type Props = {
    object: Service,
}

function ImportantInformation({
    object,
}: Props): ReactNode {
    return (
        <div>
            {
                object.intake_info || object.intake_point ?
                    <div className="Feedback">
                        <Spacer />
                        <b>Important Information</b>
                        <UrlsToLinks>
                            {object.intake_info}
                        </UrlsToLinks>
                        <UrlsToLinks>
                            {object.intake_point}
                        </UrlsToLinks>
                    </div>
                    : <div />
            }
        </div>
    )
}

export default ImportantInformation