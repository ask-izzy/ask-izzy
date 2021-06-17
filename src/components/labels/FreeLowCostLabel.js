/* @flow */
import * as React from "react";

function FreeLowCostLabel(): React.Node {
    const [showDescription, setShowDescription] = React.useState(false);
    const labelText = "Free / Low Cost"
    const labelDescription = "You may be required to present " +
        "a Medicare or concession card"
    return (
        <div
            className="FreeLowCostLabel"
            onClick={evt => {
                evt.stopPropagation();
                setShowDescription(!showDescription)
            }}
            onMouseLeave={() => setShowDescription(false)}
        >
            {showDescription && (
                <div className="labelDesc">
                    <div className="labelDescContent">
                        {labelDescription}
                    </div>
                </div>
            )}
            {labelText}
        </div>
    )
}

export default FreeLowCostLabel
