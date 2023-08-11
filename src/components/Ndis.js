/* @flow */

import type {Node as ReactNode} from "React"
import React from "react"
import Service from "../iss/Service"
import Spacer from "./Spacer"

type Props = {|
    object: Service,
    compact?: boolean,
    withSpacer?: boolean,
|}

function Ndis({
    object,
    compact,
    withSpacer = false,
}: Props): null | ReactNode {

    let ndisApproved = object.ndis_approved

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
