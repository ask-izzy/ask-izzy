/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import AccessibilityIcon from "../icons/accessibility.svg";
import Service from "../iss/Service";
import Spacer from "./Spacer";

type Props = {
    service: Service,
    withSpacer?: boolean
}

class Accessibility extends React.Component<Props, void> {
    static defaultProps: any = {
        withSpacer: false,
    };

    render(): ReactNode | null {
        const {service, withSpacer} = this.props
        let accessibilityMapping = {
            // "noaccess": "No wheelchair access",
            // "access": "Partial wheelchair access",
            "fullaccess": "Full wheelchair access",
        };
        let issAccessibility = service.accessibility;

        if (issAccessibility === "fullaccess") {
            return <>
                {withSpacer && <Spacer />}
                <div
                    className="Accessibility"
                    aria-label={`${
                        accessibilityMapping[issAccessibility]
                    }.`}
                >
                    <AccessibilityIcon
                        className="ColoredIcon"
                    />
                    <span>
                        {accessibilityMapping[issAccessibility]}
                    </span>
                </div>
            </>;
        }
        return null;
    }
}

export default Accessibility;
