/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import Service from "../iss/Service";
import Spacer from "./Spacer";
import ScreenReader from "./ScreenReader";
import {AccessibleForwardRounded} from "@mui/icons-material";

type Props = {
    service: Service,
    withSpacer?: boolean
}

function Accessibility({service, withSpacer = false}: Props): ReactNode {
    let accessibilityMapping = {
        // "noaccess": "No wheelchair access",
        // "access": "Partial wheelchair access",
        "fullaccess": "Full wheelchair access",
    };
    let issAccessibility = service.accessibility;

    if (issAccessibility === "fullaccess") {
        return (
            <>
                {withSpacer && <Spacer />}
                <div className="Accessibility">
                    <AccessibleForwardRounded
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
