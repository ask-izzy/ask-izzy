/* @flow */

import type {Node as ReactNode} from "React"
import React from "react"
import DemographicAboriginal from "../icons/DemographicAboriginal"
import DemographicTorresStrait from "../icons/DemographicTorresStrait"
import Service from "../iss/Service"

type Props = {
    object: Service
}

function IndigenousServiceIcon({object}: Props): ReactNode {
    if (!object.Indigenous()) {
        return null
    }

    return (
        <div className="IndigenousServiceIcon">
            <DemographicAboriginal
                className="inline-icon"
            />
            <DemographicTorresStrait
                className="inline-icon"
            />
        </div>
    )
}

export default IndigenousServiceIcon
