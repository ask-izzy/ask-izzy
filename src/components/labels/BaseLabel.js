/* @flow */

import type {Node as ReactNode} from "React";
import * as React from "react";

type Props = {
    labelText: string,
    labelDescription?: ?string,
    className?: ?string,
}

/**
 * A basic label with tool tip logic
 * @param labelText - The label text
 * @param labelDescription - The tooltip text
 * @param className - any overriding classnames
 * @return {JSX.Element} - Returns the base element
 * @constructor
 */
function BaseLabel(
    {
        labelText,
        labelDescription,
        className,
    }: Props): ReactNode {
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
            onMouseEnter={() => setShowDescription(!showDescription)}
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
