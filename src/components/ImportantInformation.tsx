import React from "react"

import Service from "@/src/iss/Service.js"
import Spacer from "@/src/components/Spacer.js"
import UrlsToLinks from "@/src/components/UrlsToLink.js"


type Props = {
    object: Service,
}

function ImportantInformation({
    object,
}: Props) {
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