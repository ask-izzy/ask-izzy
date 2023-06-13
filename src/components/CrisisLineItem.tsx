import React, {ReactNode} from "react";



import Link from "@/src/components/base/Link.js";
import Service from "@/src/iss/Service.js";
import PhoneButton from "@/src/components/PhoneButton.js";
import DebugContainer from "@/src/components/DebugContainer.js";
import DebugQueryScore from "@/src/components/DebugQueryScore.js";
import DebugServiceRecord from "@/src/components/DebugServiceRecord.js";
import Collapser from "@/src/components/general/Collapser.js";
import TooltipInformation from "@/src/components/TooltipInformation.js";
import Info from "@/src/icons/Info.js";


const crisisDescriptions = {
    // housing VIC
    2721562: (service) => (
        <ul className="bonusCopy">
            <li>If you are homeless or at risk of homelessness, 1800 825 955 will connect you with an Initial Assessment and Planning worker</li>
            <li>This call may not be free from mobiles. If you are ringing from a mobile you can ask to be called back</li>
            <li>When you call this number during the day you will be connected to the nearest Homelessness Entry Service in your area. At other times you will be connected to an After Hours service.</li>
        </ul>
    ),
    // NSW Link2home
    1838208: (service) => (
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

function CrisisLineItem ({
    service,
    resultNumber,
}: Props) {
    const PhoneButtonDetails: ReactNode =
        <div className="details-tooltip">
            {crisisDescriptions[service.id] && crisisDescriptions[service.id](service)}
        </div>
    
    const phone = service.Phones()[0];
    const hasDetails = crisisDescriptions[service.id]

    if (!phone) {
        return null
    }

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
                hasDetails={
                    hasDetails ?
                        <TooltipInformation
                            content = {PhoneButtonDetails}
                        >
                            <div
                                className="info-icon-container"
                                aria-label="More information about this crisis line"
                            >
                                <Info />
                            </div>
                        </TooltipInformation>
                        : undefined
                }
            />
            <DebugServiceRecord object={service} />
            {service._explanation &&
                <DebugContainer message="Query score">
                    <DebugQueryScore expl={service._explanation} />
                </DebugContainer>
            }
        </li>
    );
}

CrisisLineItem.displayName = "CrisisLineItem";
export default CrisisLineItem;
