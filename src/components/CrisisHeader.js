/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";

type Props = {
    plural: boolean
}

class CrisisHeader extends React.Component<Props, void> {
    render(): ReactElement<"h3"> {
        return (
            <h3 className="CrisisHeader">
                For help and safety call:
            </h3>
        );
    }
}

export default CrisisHeader;
