import React from "react";

import PhoneTalk from "@/src/icons/PhoneTalk.js";
import Link from "@/src/components/base/Link.js";
import {MobileDetect as useMobileDetect} from "@/src/effects/MobileDetect.js";


function OnlineSafetyScreen() {
    const link1800Respect = "/service/634190-1800respect";
    const onlineChat = "https://chat.1800respect.org.au/";
    const number1800Respect = "1800 737 732";

    const isMobileView = useMobileDetect()

    return (
        <div className="AreYouSafe">
            <div className="safety-message">
                <PhoneTalk className="PhoneIcon" />
                <h2>
                    If you or someone else is in danger call{" "}
                    {
                        isMobileView ? (
                            <Link to="tel:000">000</Link>
                        ) : (
                            "000"
                        )
                    }.
                </h2>
                <p>
                    If you are worried about unhealthy,{" "}
                    abusive or violent behaviour in any{" "}
                    of your relationships,{" "}
                    <Link to={link1800Respect}>1800RESPECT</Link>
                    {" "}could help. Contact 1800RESPECT on
                </p>
                <span>
                    <Link className="phone-number"
                        to={`tel:${number1800Respect}`}
                    >
                        {number1800Respect}
                    </Link> or through their{" "}
                </span>
                <span>
                    <Link to={onlineChat}>
                        online chat.
                    </Link>
                </span>
            </div>
        </div>
    );
}

export default OnlineSafetyScreen;
