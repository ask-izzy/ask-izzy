/* @flow */

import React from "react";
import DemographicAboriginal from "../icons/DemographicAboriginal";
import type { Service } from "../iss";
import storage from "../storage";

class IndigenousServiceIcon extends React.Component {
    props: {object: Service};
    state: void;

    render() {
        if (!this.props.object.Indigenous()) {
            return null;
        }

        if (!storage.getUserIsIndigenous()) {
            return null;
        }

        return (
            <DemographicAboriginal
                className="inline-icon"
            />
        );
    }

}

export default IndigenousServiceIcon;
