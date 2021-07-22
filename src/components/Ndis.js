/* @flow */

import type {Element} from "React";
import React from "react";
import iss from "../iss";
import fixtures from "../../fixtures/services";
import Spacer from "./Spacer";

type Props = {
    object: iss.Service,
    compact?: boolean,
    spacer?: boolean,
}

export default class Ndis extends React.Component<Props, void> {
    static sampleProps: any = {default: {
        object: new iss.Service(fixtures.ixa),
        compact: true,
        spacer: false,
    }};

    render(): null | Element<"div"> {
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
                    {this.props.spacer && (<Spacer />)}
                    <div className="Ndis">
                        Part of National Disability Insurance Scheme
                    </div>
                </div>
            );
        }
        return null;
    }
}
