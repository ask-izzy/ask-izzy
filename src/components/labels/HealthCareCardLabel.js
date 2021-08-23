/* @flow */

import type {Node as ReactNode} from "React";
import * as React from "react";
import BaseLabel from "./BaseLabel";

function HealthCareCardLabel(): ReactNode {
    const labelText = "Health care card"
    return (
        <BaseLabel
            className="HealthCareCardLabel"
            labelText={labelText}
        />
    )
}

export default HealthCareCardLabel
