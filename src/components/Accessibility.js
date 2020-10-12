/* @flow */

import React from "react";
import icons from "../icons";
import type { Service } from "../iss";

class Accessibility extends React.Component<{object: Service}, void> {
    render() {
        let accessibilityMapping = {
            // "noaccess": "No wheelchair access",
            // "access": "Partial wheelchair access",
            "fullaccess": "Full wheelchair access",
        };
        let issAccessibility = this.props.object.accessibility;

        if (issAccessibility === "fullaccess") {
            return (
                <div className="Accessibility">
                    <icons.Accessibility
                        className="ColoredIcon brand-text-dark"
                    />
                    <span>
                        {accessibilityMapping[issAccessibility]}
                    </span>
                </div>
            );
        }
        return null;
    }
}

export default Accessibility;
