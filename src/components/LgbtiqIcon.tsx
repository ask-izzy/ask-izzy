import React from "react"

import DemographicLgbtiq from "@/src/icons/DemographicLgbtiq"
import Service from "@/src/iss/Service"

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
