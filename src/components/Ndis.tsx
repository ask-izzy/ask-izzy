import type {ReactNode} from "react"
import React from "react"
import Service from "../iss/Service"
import Spacer from "./Spacer"

type Props = {
    object: Service,
    compact?: boolean,
    withSpacer?: boolean,
}

function Ndis({
    object,
    compact,
    withSpacer = false,
}: Props): null | ReactNode {

    let ndisApproved = object.is_ndis_approved

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
