import type {ReactElement} from "react";
import React from "react";

type Props = {
    plural: boolean
}

class CrisisHeader extends React.Component<Props> {
    render(): ReactElement<"h3"> {
        return (
            <h3 className="CrisisHeader">
                For help and safety call:
            </h3>
        );
    }
}

export default CrisisHeader;
