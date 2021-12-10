/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import DemographicAboriginal from "../icons/demographic-aboriginal.svg";
import DemographicTorresStrait from "../icons/demographic-torres-strait.svg";
import Service from "../iss/Service";

type Props = {
    object: Service
}

class IndigenousServiceIcon extends React.Component<Props, void> {
    render(): null | ReactElement<"div"> {
        if (!this.props.object.Indigenous()) {
            return null;
        }

        return (
            <div className="IndigenousServiceIcon">
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
