/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import icons from "../icons";
import ScreenReader from "./ScreenReader";
import AddressLocation from "../iss/AddressLocation";
import Spacer from "./Spacer";

import UrlsToLinks from "./UrlsToLink"

type Props = {
    location: AddressLocation,
    withSpacer?: boolean,
}

class Address extends React.Component<Props, void> {
    static defaultProps: any = {
        withSpacer: false,
    };

    render(): ReactNode {
        let location = this.props.location;

        return <>
            {this.props.withSpacer && <Spacer />}
            <div className="Address">
                <ScreenReader>
                    Address of the service is
                </ScreenReader>
                <icons.Map aria-hidden={true} />
                <div className="Address-wrapper">
                    {" "}
                    <div className="street">
                        {location.streetAddressLine1()}
                    </div>
                    {" "}
                    <div className="suburb">
                        {location.streetAddressLine2()}
                    </div>
                    {" "}
                    {location.details &&
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
