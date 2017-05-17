/* @flow */

import React from "react";
import DemographicAboriginal from "../icons/DemographicAboriginal";
import DemographicTorresStrait from "../icons/DemographicTorresStrait";
import type { Service } from "../iss";

class IndigenousServiceIcon extends React.Component {
    props: {object: Service};
    state: void;

    render() {
        if (!this.props.object.Indigenous()) {
            return null;
        }

        return (
            <div>
                <DemographicAboriginal
                    className="inline-icon"
                />
                <DemographicTorresStrait
                    className="inline-icon"
                />
            </div>
        );
    }

}

export default IndigenousServiceIcon;
