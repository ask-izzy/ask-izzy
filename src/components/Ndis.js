/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import Service from "../services/Service";
import Spacer from "./Spacer";

type Props = {
    object: Service,
    compact?: boolean,
    withSpacer?: boolean,
}

export default class Ndis extends React.Component<Props, void> {
    static defaultProps: any = {
        withSpacer: false,
    };

    render(): null | ReactElement<"div"> {
        let ndisApproved = this.props.object.ndis_approved;

        if (ndisApproved) {
            if (this.props.compact) {
                return (
                    <div className="NdisCompact">
                        Part of NDIS
                    </div>
                );
            }
            return (
                <div>
                    {this.props.withSpacer && (<Spacer />)}
                    <div className="Ndis">
                        Part of National Disability Insurance Scheme
                    </div>
                </div>
            );
        }
        return null;
    }
}
