import type {ReactNode} from "react"
import React from "react"
import DemographicLgbtiq from "../icons/DemographicLgbtiq"
import Service from "../iss/Service"

type Props = {
    object: Service
}

function LgbtiqIcon({object}: Props): ReactNode {
    let lgbtiqaPlus = object.is_lgbtiqa_plus_specific

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
