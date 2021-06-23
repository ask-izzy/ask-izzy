/* @flow */
import * as React from "react";
import BaseLabel from "./BaseLabel";

function HealthCareCardLabel(): React.Node {
    const labelText = "Health care card"
    return (
        <BaseLabel
            className="HealthCareCardLabel"
            labelText={labelText}
        />
    )
}

export default HealthCareCardLabel
