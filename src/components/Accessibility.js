/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import icons from "../icons";
import Service from "../iss/Service";
import Spacer from "./Spacer";
import ScreenReader from "./ScreenReader";

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
                <div className="Accessibility">
                    <icons.Accessibility
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
            </>;
        }
        return null;
    }
}

export default Accessibility;
