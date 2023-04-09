import React from "react"

import DemographicAboriginal from "@/src/icons/DemographicAboriginal.js"
import DemographicTorresStrait from "@/src/icons/DemographicTorresStrait.js"
import Service from "@/src/iss/Service.js"


type Props = {
    object: Service
}

function IndigenousServiceIcon({object}: Props) {
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
