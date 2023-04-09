import React from "react"

import DemographicLgbtiq from "@/src/icons/DemographicLgbtiq.js"
import Service from "@/src/iss/Service.js"


type Props = {
    object: Service
}

function LgbtiqIcon({object}: Props) {
    const lgbtiqaPlus = object.lgbtiqa_plus_specific

    if (!lgbtiqaPlus) {
        return null
    }

    return (
        <div className="LgbtiqIcon">
            <DemographicLgbtiq
                className="inline-icon"
            />
        </div>
    )
}

export default LgbtiqIcon
