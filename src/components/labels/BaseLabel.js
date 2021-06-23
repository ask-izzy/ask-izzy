/* @flow */

import * as React from "react";

type Props = {
    labelText: string,
    labelDescription: string,
    className?: ?string,
}

function BaseLabel({labelText, labelDescription, className }: Props) {
    const [showDescription, setShowDescription] = React.useState(false);
    return (
        <div
            className={`BaseLabel ${
                labelDescription ? "hasDescription" : ""} ${
                className ? className : ""}`}
            onClick={evt => {
                evt.stopPropagation();
                setShowDescription(!showDescription)
            }}
            onMouseLeave={() => setShowDescription(false)}
        >
            {showDescription && labelDescription ? (
                <div className="labelDesc">
                    <div className="labelDescContent">
                        {labelDescription}
                    </div>
                </div>
            ) : null}
            {labelText}
        </div>
    )
}

export default BaseLabel
