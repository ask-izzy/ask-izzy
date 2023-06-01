/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import classNames from "classnames";
import icons from "../icons";
import ScreenReader from "./ScreenReader";
import AddressLocation from "../iss/AddressLocation";
import Spacer from "./Spacer";

import UrlsToLinks from "./UrlsToLink"

type Props = {
    location: AddressLocation,
    withSpacer?: boolean,
    singleLineAddress?: boolean,
}

class Address extends React.Component<Props, void> {
    static defaultProps: any = {
        withSpacer: false,
        singleLineAddress: false,
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
                <ScreenReader>
                    Address of the service is
                </ScreenReader>
                <icons.Map aria-hidden={true} />
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
                            <UrlsToLinks>
                                {location.details}
                            </UrlsToLinks>
                        </div>
                    }
                </div>
            </div>
        </>
    }
}

export default Address;
