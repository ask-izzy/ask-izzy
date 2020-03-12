/* @flow */

import * as React from "react";

const LimitedServicesBanner = (): React.Node => {
    return (
        <div
            className="CurrentEmergencyNotice CurrentEmergencyResultsBanner"
        >
            <h3>
                Services are Currently Limited
            </h3>
            <p>
                Please be aware that due to *current emergency*, some services
                listed may not be operating or offering a more limited range
                of services. We are working to update these as soon as
                possible.
            </p>
        </div>
    )
}

export default LimitedServicesBanner
