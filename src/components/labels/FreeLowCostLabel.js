/* @flow */
import * as React from "react";
import BaseLabel from "./BaseLabel";

function FreeLowCostLabel(): React.Node {
    const labelText = "Free / Low Cost"
    const labelDescription = "You may be required to present " +
        "a Medicare or concession card"
    return (
        <BaseLabel
            className="FreeLowCostLabel"
            labelText={labelText}
            labelDescription={labelDescription}
        />
    )
}

export default FreeLowCostLabel
