/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import classNames from "classnames";

import ScreenReader from "./ScreenReader";
import AddressLocation from "../iss/AddressLocation";
import Spacer from "./Spacer";
import {FmdGoodRounded} from "@mui/icons-material";
import FormatText from "./FormatText"

type Props = {
    location: AddressLocation,
    withSpacer?: boolean,
    singleLineAddress?: boolean,
    hasSolidIcon?: boolean,
}

class Address extends React.Component<Props, void> {
    static defaultProps: any = {
        withSpacer: false,
        singleLineAddress: false,
        hasSolidIcon: false,
    };
    renderSingleLineAddress(location: any): ReactNode {
        return <>
            <span className="street">
                {location.streetAddressLine1()}
            </span>
            {", "}
            <span className="suburb">
                {location.streetAddressLine2()}
            </span>
        </>
    }

    renderMultiLineAddress(location: any): ReactNode {
        return <>
            <div className="street">
                {location.streetAddressLine1()}
            </div>
            {" "}
            <div className="suburb">
                {location.streetAddressLine2()}
            </div>
        </>
    }


    render(): ReactNode {
        let location = this.props.location;

        return <>
            {this.props.withSpacer && <Spacer />}
            <div className="Address">
                <FmdGoodRounded />
                <ScreenReader>
                    Address of the service is
                </ScreenReader>
                <div className={classNames("Address-wrapper", {"single-line": this.props.singleLineAddress})}>
                    {" "}
                    {
                        this.props.singleLineAddress ?
                            this.renderSingleLineAddress(location)
                            : this.renderMultiLineAddress(location)
                    }
                    {" "}
                    {location.details && !this.props.singleLineAddress &&
                        <div className="details">
                            <FormatText>
                                {location.details}
                            </FormatText>
                        </div>
                    }
                </div>
            </div>
        </>
    }
}

export default Address;
