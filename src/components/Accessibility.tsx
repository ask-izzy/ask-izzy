import React from "react";

import AccessibilityIcon from "@/src/icons/Accessibility.js";
import Service from "@/src/iss/Service.js";
import Spacer from "@/src/components/Spacer.js";
import ScreenReader from "@/src/components/ScreenReader.js";

type Props = {
    service: Service,
    withSpacer?: boolean
}

function Accessibility({service, withSpacer = false}: Props) {
    const accessibilityMapping = {
        // "noaccess": "No wheelchair access",
        // "access": "Partial wheelchair access",
        "fullaccess": "Full wheelchair access",
    };
    const issAccessibility = service.accessibility;

    if (issAccessibility === "fullaccess") {
        return (
            <>
                {withSpacer && <Spacer />}
                <div className="Accessibility">
                    <AccessibilityIcon
                        className="ColoredIcon"
                        aria-hidden={true}
                    />
                    <ScreenReader>
                        Service has
                    </ScreenReader>
                    <span>
                        {accessibilityMapping[issAccessibility]}
                    </span>
                </div>
            </>
        )
    }
    return null
}

export default Accessibility
