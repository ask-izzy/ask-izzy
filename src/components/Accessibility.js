/* @flow */

import React from "react";
import DemographicDisability from "../icons/DemographicDisability";
import type { Service } from "../iss";

class Accessibility extends React.Component {
    props: {object: Service};
    state: void;

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
                    <DemographicDisability
                        className="ColoredIcon brand-text-dark"
                    />
                    {accessibilityMapping[issAccessibility]}
                </div>
            );
        }
        return null;
    }
}

export default Accessibility;
