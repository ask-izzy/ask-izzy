/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import icons from "../icons";
import ScreenReader from "./ScreenReader";
import AddressLocation from "../iss/AddressLocation";
import Spacer from "./Spacer";

type Props = {
    location: AddressLocation,
    withSpacer?: boolean,
}

class Address extends React.Component<Props, void> {
    static defaultProps: any = {
        withSpacer: false,
    };

    static sampleProps: any = {
        complex: {
            location: new AddressLocation({
                "building": "Hamy building",
                "flat_unit": "Room 35",
                "level": "Level 3",
                "postcode": "3121",
                "state": "VIC",
                "street_name": "Elizabeth",
                "street_number": "33",
                "street_suffix": "",
                "street_type": "St",
                "suburb": "RICHMOND",
                "point": {},
            }),
        },
        hidden: {
            location: new AddressLocation({
                "postcode": "3121",
                "state": "VIC",
                "suburb": "RICHMOND",
                "point": undefined,
            }),
        },
    };

    render(): ReactNode {
        let location = this.props.location;

        return <>
            {this.props.withSpacer && <Spacer />}
            <div className="Address">
                <ScreenReader>
                    Address
                </ScreenReader>
                <icons.Map />
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
                            {location.details}
                        </div>
                    }
                </div>
            </div>
        </>
    }
}

export default Address;
