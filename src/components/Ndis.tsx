import React from "react"
import Service from "@/src/iss/Service.js"
import Spacer from "@/src/components/Spacer.js"


type Props = {
    object: Service,
    compact?: boolean,
    withSpacer?: boolean,
}

function Ndis({
    object,
    compact,
    withSpacer = false,
}: Props) {

    const ndisApproved = object.ndis_approved

    if (ndisApproved) {
        if (compact) {
            return (
                <div className="NdisCompact">
                    Part of NDIS
                </div>
            )
        }
        return (
            <div>
                {withSpacer && (<Spacer />)}
                <div className="Ndis">
                    Part of National Disability Insurance Scheme
                </div>
            </div>
        )
    }
    return null
}

export default Ndis
