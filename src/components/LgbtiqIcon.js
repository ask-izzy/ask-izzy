/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import DemographicLgbtiq from "../icons/DemographicLgbtiq";
import type { Service } from "../iss";

type Props = {
    object: Service
}

class LgbtiqIcon extends React.Component<Props, void> {
    render(): null | ReactElement<"div"> {
        let lgbtiqaPlus = this.props.object.lgbtiqa_plus_specific;

        if (!lgbtiqaPlus) {
            return null;
        }

        return (
            <div className="LgbtiqIcon">
                <DemographicLgbtiq
                    className="inline-icon"
                />
            </div>
        );
    }
}

export default LgbtiqIcon;
