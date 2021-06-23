/* @flow */
import * as React from "react";
import BaseLabel from "./BaseLabel";

function BulkBilledLabel(): React.Node {
    const labelText = "Bulk billed"
    return (
        <BaseLabel
            className="BulkBilledLabel"
            labelText={labelText}
        />
    )
}

export default BulkBilledLabel
