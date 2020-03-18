/* @flow */

import * as React from "react";
import { Link } from "react-router";

const LimitedServicesBanner = (): React.Node => {
    return (
        <div
            className="CurrentEmergencyNotice CurrentEmergencyResultsBanner"
        >
            <h3>
                Services may be limited due to coronavirus
            </h3>
            <p>
                Please be aware that due to the <Link to="/covid-19-support">
                coronavirus pandemic</Link> some services listed may not be
                operating or offering a more limited range of services.
                We are working to update these services as soon as possible.
            </p>
        </div>
    )
}

export default LimitedServicesBanner
