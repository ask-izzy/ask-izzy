/* @flow */
import * as React from "react";
import BaseLabel from "./BaseLabel";

function FreeLowCostLabel(): React.Node {
    const labelText = "Free / Low Cost"
    const labelDescription = "You may be required pay a small fee"
    return (
        <BaseLabel
            className="FreeLowCostLabel"
            labelText={labelText}
            labelDescription={labelDescription}
        />
    )
}

export default FreeLowCostLabel
