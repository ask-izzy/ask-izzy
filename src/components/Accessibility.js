/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import icons from "../icons";
import type { Service } from "../iss";

class Accessibility extends React.Component<{object: Service}, void> {
    render(): null | ReactElement<"div"> {
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
                        className="ColoredIcon"
                    />
                    {accessibilityMapping[issAccessibility]}
                </div>
            );
        }
        return null;
    }
}

export default Accessibility;
