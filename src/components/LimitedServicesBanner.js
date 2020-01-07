/* @flow */

import * as React from "react";

const LimitedServicesBanner = (): React.Node => {
    return (
        <div
            className="BushfireNotice BushfireResultsBanner"
        >
            <h3>
                Bushfire support 2020
            </h3>
            <p>
                Please be aware that due to the bushfires currently affecting
                parts of Australia, some services listed may not be operating or
                offering a more limited range of services. We are working to
                update these as soon as possible.
            </p>
        </div>
    )
}

export default LimitedServicesBanner
