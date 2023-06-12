/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import Service from "../iss/Service";


import PhoneSolid from "@/src/icons/PhoneSolid";
import Directions from "@/src/icons/Directions";
import Link from "@/src/components/base/Link";
import GoogleMapsLink from "@/src/components/GoogleMapsLink";
import {PhoneHref} from "@/helpers/regex.helpers";


type Props = {
    service: Service,
}

function ResultListItemContact({
    service,
}: Props): ReactNode {
    if (service.Phones().length === 0) {
        return <></>;
    }
    const firstPhoneNumber = service.Phones()[0].number;

    return (
        <div className="ResultListItemContact">
            <Link
                to={PhoneHref(firstPhoneNumber)}
                className="ContactButton"
                analyticsEvent={{
                    event: "Link Followed - Phone Contact - My List",
                    eventAction: `Contact detail - phone - My List`,
                    eventLabel: `${firstPhoneNumber}`,
                }}
            >
                <div className="contact-text">
                    <PhoneSolid />
                    <span>Call</span>
                    <span className="number value">
                        {firstPhoneNumber}
                    </span>
                </div>
            </Link>
            {
                service.Phones().length > 1 ?
                    <div className="contact-other">
                        <div className="contact-comment">
                            {service.Phones()[0].comment}
                        </div>
                        <Link
                            to={`/service/${service.slug}`}
                        >
                            More Call options >
                        </Link>
                    </div>
                    : <div className="contact-other">
                        <GoogleMapsLink
                            to={service.location}
                            className="withoutTimes"
                            hideSpacer={true}
                            hideConfidential={true}
                        >
                            <Directions
                                className="ExternalLinkIcon"
                            />
                            <span>
                                Get directions
                            </span>
                        </GoogleMapsLink>
                    </div>
            }
        </div>
    );
}

export default ResultListItemContact;
