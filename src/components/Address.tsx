import React from "react";

import Map from "@/src/icons/Map.js";
import ScreenReader from "@/src/components/ScreenReader.js";
import AddressLocation from "@/src/iss/AddressLocation.js";
import Spacer from "@/src/components/Spacer.js";


import UrlsToLinks from "@/src/components/UrlsToLink.js"


type Props = {
    location: AddressLocation,
    withSpacer?: boolean,
}

function Address({
    location,
    withSpacer = false,
}: Props) {
    return (
        <>
            {withSpacer && <Spacer />}
            <div className="Address">
                <ScreenReader>
                    Address of the service is
                </ScreenReader>
                <Map aria-hidden={true} />
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
    )
}

export default Address;
