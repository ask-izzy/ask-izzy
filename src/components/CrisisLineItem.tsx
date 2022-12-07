/* eslint-disable max-len */
import React from "react";

import Link from "@/src/components/base/Link";
import Service from "@/src/iss/Service";
import PhoneButton from "@/src/components/PhoneButton";
import DebugContainer from "@/src/components/DebugContainer";
import DebugQueryScore from "@/src/components/DebugQueryScore";
import DebugServiceRecord from "@/src/components/DebugServiceRecord";
import Collapser from "@/src/components/general/Collapser";


const crisisDescriptions = {
    // housing VIC
    // eslint-disable-next-line react/display-name
    2721562: () => (
        <ul className="bonusCopy">
            <li>If you are homeless or at risk of homelessness, 1800 825 955 will connect you with an Initial Assessment and Planning worker</li>
            <li>This call may not be free from mobiles. If you are ringing from a mobile you can ask to be called back</li>
            <li>When you call this number during the day you will be connected to the nearest Homelessness Entry Service in your area. At other times you will be connected to an After Hours service.</li>
        </ul>
    ),
    // NSW Link2home
    // eslint-disable-next-line react/display-name
    1838208: () => (
        <ul className="bonusCopy">
            <li>If you are homeless or at risk of being homeless, call Link2home from anywhere in NSW</li>
            <li>You can speak to someone 24 hours a day, 7 days a week</li>
            <li>We will give you information or refer you to a service that can best help you resolve your homelessness issue</li>
            <li>If you need interpreter assistance, call <Link to="tel:1300652488" >1300 652 488</Link>.</li>
        </ul>
    ),
}

type Props = {
    service: Service,
    resultNumber: number
}

function CrisisLineItem({
    service,
    resultNumber,
}: Props) {
    const phone = service.Phones()[0];

    if (!phone) {
        return null
    }

    const PhoneButtonDetails =
        <div className="detailsCollapser">
            {
                crisisDescriptions[service.id] &&
            <Collapser
                expandMessage="See details"
                collapseMessage="Hide details"
                analyticsEvent={{
                    event: `Action Triggered - Crisis Line Info`,
                    eventAction: "Show crisis line extra info",
                    eventLabel: null,
                }}
            >
                {crisisDescriptions[service.id](service)}
            </Collapser>
            }
        </div>

    return (
        <li className="CrisisLineItem">
            <h3>
                <Link
                    to={`/service/${service.slug}`}
                    analyticsEvent={{
                        event: `Link Followed - Service Result`,
                        eventAction: "Service result",
                        eventLabel: `Crisis line - number ${resultNumber}`,
                    }}
                >
                    {service.site.name}
                </Link>
            </h3>
            <PhoneButton
                {...phone}
                crisis={true}
                hasDetails={PhoneButtonDetails}
            />
            <DebugServiceRecord object={service} />
            {service._explanation &&
                <DebugContainer message="Query score">
                    <DebugQueryScore expl={service._explanation} />
                </DebugContainer>
            }
        </li>
    )
}

export default CrisisLineItem;
